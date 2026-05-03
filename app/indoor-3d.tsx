import { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { File } from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

// requires têm de ser estáticos no Metro bundler — só incluir ficheiros que existem
const MODEL_MAP: Record<string, Record<number, number>> = {
  sectorE: {
    0: require('../assets/models/sectorE/floor_0.glb'),
  },
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  // processar em chunks para evitar stack overflow em modelos grandes
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunkSize, bytes.length)));
  }
  return btoa(binary);
}

async function loadModelAsBase64(buildingId: string, level: number): Promise<string> {
  const moduleId = MODEL_MAP[buildingId]?.[level];
  if (moduleId == null) throw new Error(`Sem modelo registado para ${buildingId}/piso ${level}`);

  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();

  const localUri = asset.localUri;
  if (!localUri) throw new Error(`localUri null após download (asset.uri: ${asset.uri})`);

  // expo-file-system v19 — nova API com classe File
  const file = new File(localUri);
  const buffer = await file.arrayBuffer();
  return arrayBufferToBase64(buffer);
}

const THREE_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f2f2f7; overflow: hidden; }
    canvas { display: block; width: 100vw; height: 100vh; }
    #loader {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.4);
      color: #fff; font-family: sans-serif; font-size: 16px; letter-spacing: 0.5px;
    }
    #error {
      position: fixed; bottom: 120px; left: 24px; right: 24px;
      display: none; flex-direction: column; align-items: center;
      background: #fff0f0; border-radius: 12px; padding: 16px;
      color: #c00; font-family: sans-serif; font-size: 14px; text-align: center;
    }
    #hint {
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.55); color: #fff;
      font-family: sans-serif; font-size: 13px; padding: 7px 16px;
      border-radius: 20px; pointer-events: none; white-space: nowrap;
      opacity: 1; transition: opacity 1s;
    }
  </style>
</head>
<body>
  <div id="loader">A carregar modelo...</div>
  <div id="error"></div>
  <div id="hint">Toca numa sala para navegar</div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    // ─── GLOBAL ERROR TRAP ───────────────────────────────────────────────────
    // Catches any unhandled JS errors (e.g. undefined functions, syntax errors)
    // and surfaces them as a toast so they are never swallowed silently.
    window.addEventListener('error', function(ev) {
      const msg = (ev.message || 'JS error') + (ev.filename ? ' @ ' + ev.lineno : '');
      console.error('[Indoor3D JS ERROR]', msg);
      try { showToast('Erro interno: ' + ev.message); } catch(_) {}
      try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEBUG', msg: 'JSERR: ' + msg })); } catch(_) {}
    });

    // ─── CORE STATE ──────────────────────────────────────────────────────────
    let scene, camera, renderer, currentModel;

    // ─── PERSON STATE ────────────────────────────────────────────────────────
    let personMarker = null;
    let personPos = new THREE.Vector3(0, 0, 0);
    let personAnimPath = null;
    let personAnimT = 0;
    let personAnimSpeedPerFrame = 0.008;
    let personAnimating = false;
    let personFloorY = 0;
    let modelSpan = 20; // updated after each model load; drives person scale

    function createPersonMarker(pos) {
      if (personMarker) { scene.remove(personMarker); personMarker = null; }
      const group = new THREE.Group();

      // Scale so person is ~5% of building width — always visible from default zoom
      const s = Math.max(0.3, modelSpan * 0.05);

      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xFF6B00, emissive: 0xDD2200, emissiveIntensity: 0.5 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 12), bodyMat);
      body.position.y = 0.27 * s;
      body.scale.setScalar(s);
      group.add(body);

      const headMat = new THREE.MeshStandardMaterial({ color: 0xFFCC33, emissive: 0xFF8800, emissiveIntensity: 0.5 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), headMat);
      head.position.y = 0.72 * s;
      head.scale.setScalar(s);
      group.add(head);

      const arrowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 8), arrowMat);
      arrow.position.set(0, 0.28 * s, -0.28 * s);
      arrow.rotation.x = Math.PI / 2;
      arrow.scale.setScalar(s);
      group.add(arrow);

      group.position.copy(pos);
      personMarker = group;
      scene.add(personMarker);
    }

    function clearPerson() {
      if (personMarker) { scene.remove(personMarker); personMarker = null; }
      personAnimating = false;
      personAnimPath = null;
    }

    function beginPersonAnimation(curve) {
      personAnimPath = curve;
      personAnimT = 0;
      personAnimating = true;
      const len = curve.getLength();
      // speed adapts: full path in ~2s at 60fps regardless of distance
      personAnimSpeedPerFrame = 1 / Math.max(60, len * 6);
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────
    function isNavNode(name) {
      if (!name) return false;
      const lo = name.toLowerCase();
      return lo.startsWith('sala_') || lo === 'bar' || lo.startsWith('wc_');
    }
    function isCollider(name) {
      return !!name && name.toLowerCase().startsWith('col_');
    }

    // ─── CAMERA (static top-down, zoom only) ─────────────────────────────────
    // theta and phi are fixed — only radius changes (zoom)
    let spherical = { theta: 0, phi: 0.35, radius: 30 };
    const target = new THREE.Vector3(0, 0, 0);
    let lastPinchDist = null;
    let tapStart = null, tapTime = 0;
    // Zoom limits — updated after each model load to fit model size
    let zoomMin = 3, zoomMax = 500;

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf2f2f7);
      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      document.body.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(5, 20, 10); dir.castShadow = true; scene.add(dir);
      scene.add(new THREE.HemisphereLight(0xddeeff, 0x222211, 0.5));
      setupControls();
      window.addEventListener('resize', onResize);
      animate();
    }

    // Pan-state: when the user drags > DRAG_THRESHOLD pixels we switch from
    // "tap → navigate" mode into "drag → pan camera target" mode.
    let isPanning = false;
    let panLast   = null;
    const DRAG_THRESHOLD = 8;

    // Pixels-to-world scale at the current camera distance (top-down approximation)
    function pixelToWorld() {
      return (2 * spherical.radius * Math.tan(camera.fov * Math.PI / 360)) / window.innerHeight;
    }

    // Translate target along the camera's projected XZ axes by (dx,dy) screen pixels.
    function panTargetBy(dx, dy) {
      const s = pixelToWorld();
      // Forward axis (camera-to-target) projected onto XZ
      const fwd = new THREE.Vector3(target.x - camera.position.x, 0, target.z - camera.position.z);
      if (fwd.lengthSq() < 1e-6) return;
      fwd.normalize();
      // Right axis (perpendicular to forward, in XZ)
      const rh = new THREE.Vector3(-fwd.z, 0, fwd.x);
      target.addScaledVector(rh,  -dx * s);
      target.addScaledVector(fwd,  dy * s);
      updateCamera();
    }

    // Multiplicative zoom — feels smooth at any radius (instead of linear delta).
    function zoomBy(factor) {
      spherical.radius = Math.max(zoomMin, Math.min(zoomMax, spherical.radius * factor));
      updateCamera();
    }

    function setupControls() {
      const el = renderer.domElement;

      // Mouse wheel — multiplicative zoom (smooth at every scale)
      el.addEventListener('wheel', e => {
        zoomBy(Math.exp(e.deltaY * 0.0015));
      }, { passive: true });

      // Mouse: tap → navigate, drag → pan
      el.addEventListener('mousedown', e => {
        tapStart = { x: e.clientX, y: e.clientY };
        tapTime  = Date.now();
        panLast  = { x: e.clientX, y: e.clientY };
        isPanning = false;
      });
      el.addEventListener('mousemove', e => {
        if (!panLast) return;
        if (tapStart && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) > DRAG_THRESHOLD) {
          tapStart = null; isPanning = true;
        }
        if (isPanning) {
          panTargetBy(e.clientX - panLast.x, e.clientY - panLast.y);
          panLast = { x: e.clientX, y: e.clientY };
        }
      });
      el.addEventListener('mouseup', e => {
        if (tapStart && !isPanning &&
            Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) < DRAG_THRESHOLD &&
            Date.now() - tapTime < 300) {
          handleTap(e.clientX, e.clientY);
        }
        tapStart = null; panLast = null; isPanning = false;
      });
      el.addEventListener('mouseleave', () => { tapStart = null; panLast = null; isPanning = false; });

      // Touch: 1 finger = tap-or-pan, 2 fingers = pinch zoom + 2-finger pan
      el.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
          tapStart  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          tapTime   = Date.now();
          panLast   = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          lastPinchDist = null;
          isPanning = false;
        } else if (e.touches.length === 2) {
          tapStart = null;
          isPanning = false;
          lastPinchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          panLast = {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          };
        }
      }, { passive: true });
      el.addEventListener('touchmove', e => {
        // Single-finger drag → pan
        if (e.touches.length === 1 && panLast) {
          const t = e.touches[0];
          if (tapStart && Math.hypot(t.clientX - tapStart.x, t.clientY - tapStart.y) > DRAG_THRESHOLD) {
            tapStart = null; isPanning = true;
          }
          if (isPanning) {
            panTargetBy(t.clientX - panLast.x, t.clientY - panLast.y);
            panLast = { x: t.clientX, y: t.clientY };
          }
        }
        // Two-finger pinch → zoom (multiplicative); two-finger drag → pan
        if (e.touches.length === 2 && lastPinchDist !== null) {
          const d = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          if (d > 0 && lastPinchDist > 0) zoomBy(lastPinchDist / d);
          lastPinchDist = d;
          // Pan with the centre of the pinch
          if (panLast) {
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            panTargetBy(cx - panLast.x, cy - panLast.y);
            panLast = { x: cx, y: cy };
          }
        }
      }, { passive: true });
      el.addEventListener('touchend', e => {
        if (tapStart && !isPanning &&
            e.changedTouches.length === 1 &&
            Date.now() - tapTime < 300 &&
            Math.hypot(e.changedTouches[0].clientX - tapStart.x, e.changedTouches[0].clientY - tapStart.y) < DRAG_THRESHOLD) {
          handleTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
        tapStart = null; lastPinchDist = null; panLast = null; isPanning = false;
      }, { passive: true });
    }

    function updateCamera() {
      const sinPhi = Math.sin(spherical.phi);
      camera.position.set(
        target.x + spherical.radius * sinPhi * Math.sin(spherical.theta),
        target.y + spherical.radius * Math.cos(spherical.phi),
        target.z + spherical.radius * sinPhi * Math.cos(spherical.theta)
      );
      camera.lookAt(target);
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // ─── TAP → NAVIGATE ──────────────────────────────────────────────────────
    // Any tap starts navigation — even in open areas with no floor geometry.
    function handleTap(clientX, clientY) {
      if (!currentModel) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      const camRay = new THREE.Raycaster();
      camRay.setFromCamera(ndc, camera);

      let dest;
      const meshes = [];
      currentModel.traverse(obj => { if (obj.isMesh) meshes.push(obj); });
      const hits = camRay.intersectObjects(meshes, false);

      if (hits.length > 0) {
        // Prefer a non-wall mesh (floor / corridor surface over wall tops)
        const wallSet = new Set(wallMeshes);
        const bestHit = hits.find(h => !wallSet.has(h.object)) || hits[hits.length - 1];
        dest = bestHit.point.clone();
      } else {
        // No mesh hit — project the camera ray onto the navigation plane.
        // This lets the person navigate to open corridors with no floor geometry.
        const navPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -personFloorY);
        dest = new THREE.Vector3();
        if (!camRay.ray.intersectPlane(navPlane, dest)) return;
      }

      dest.y = personFloorY;
      navigateToPoint(dest);

      const hint = document.getElementById('hint');
      if (hint) { hint.style.opacity = '0'; setTimeout(() => { hint.style.display = 'none'; }, 600); }
    }

    // ─── PATHFINDING — visibility-graph A* ───────────────────────────────────
    // Wall meshes + their pre-computed XZ bounding boxes (parallel arrays).
    let wallMeshes = [];
    let wallBBoxes  = []; // THREE.Box3, one per wallMesh entry

    // ── 2-D segment vs. axis-aligned bbox (XZ plane only) ──────────────────
    // No raycasting — works regardless of mesh normals, face orientation or Y height.
    // Returns true if the segment (ax,az)→(bx,bz) passes through the box [x0,x1]×[z0,z1].
    function segHitsBox(ax, az, bx, bz, x0, x1, z0, z1) {
      // Quick reject via segment's own bounding box
      if (Math.max(ax,bx) < x0 || Math.min(ax,bx) > x1) return false;
      if (Math.max(az,bz) < z0 || Math.min(az,bz) > z1) return false;
      const dx = bx - ax, dz = bz - az;
      let lo = 0, hi = 1;
      if (Math.abs(dx) > 1e-9) {
        const t1 = (x0-ax)/dx, t2 = (x1-ax)/dx;
        lo = Math.max(lo, Math.min(t1,t2));
        hi = Math.min(hi, Math.max(t1,t2));
      } else if (ax < x0 || ax > x1) return false;
      if (Math.abs(dz) > 1e-9) {
        const t1 = (z0-az)/dz, t2 = (z1-az)/dz;
        lo = Math.max(lo, Math.min(t1,t2));
        hi = Math.min(hi, Math.max(t1,t2));
      } else if (az < z0 || az > z1) return false;
      return lo <= hi;
    }

    // LOS: true if no wall bbox blocks the straight XZ line from a→b.
    // NEAR clips 15 cm from each endpoint so the person/goal being right next
    // to a wall doesn't falsely block the path.
    function hasLineOfSight(a, b) {
      const ax = a.x, az = a.z, bx = b.x, bz = b.z;
      const dist = Math.sqrt((bx-ax)*(bx-ax) + (bz-az)*(bz-az));
      if (dist < 0.3) return true;
      const NEAR = 0.15;
      // Clip segment endpoints inward by NEAR
      const t0 = NEAR / dist, t1 = 1 - NEAR / dist;
      const sx = ax + (bx-ax)*t0, sz = az + (bz-az)*t0; // start
      const ex = ax + (bx-ax)*t1, ez = az + (bz-az)*t1; // end
      for (const bb of wallBBoxes) {
        if (segHitsBox(sx, sz, ex, ez, bb.min.x, bb.max.x, bb.min.z, bb.max.z)) return false;
      }
      return true;
    }

    // ─── GRID A* ─────────────────────────────────────────────────────────────
    // Divides the model's XZ footprint into a uniform grid and runs A*.
    // Cells that overlap a col_ bounding box are blocked.
    // This naturally navigates through any physical door gap (no waypoints needed).
    //
    // The cell SIZE is adaptive (computed in buildGrid).  For small Blender
    // models (~20 m) cells are ~0.3 m; for huge models (~500 m) they grow to
    // keep the total grid around ~250×250 — otherwise A* would explore millions
    // of cells per click and freeze the WebView.
    let grid = null;

    function buildGrid() {
      grid = null;
      if (!currentModel) return;
      const mb = new THREE.Box3().setFromObject(currentModel);
      const sx = mb.max.x - mb.min.x;
      const sz = mb.max.z - mb.min.z;
      const span = Math.max(sx, sz);
      // Target ~350 cells in the longer dimension; floor of 0.3 m so even tiny
      // models don't get a degenerate 1-cell grid.
      const cell = Math.max(0.3, span / 350);
      const PAD  = cell * 4;
      const x0 = mb.min.x - PAD, z0 = mb.min.z - PAD;
      const cols = Math.ceil((sx + PAD * 2) / cell) + 1;
      const rows = Math.ceil((sz + PAD * 2) / cell) + 1;
      const blocked = new Uint8Array(cols * rows);
      for (const bb of wallBBoxes) {
        // Block cells whose CENTER is inside the wall bbox.  Using
        // floor()..ceil() on edges over-blocks borderline cells which can
        // close narrow doorways when cell ≥ door width.  Center-based is
        // strictly safer for navigation (narrow gaps stay passable; the only
        // cost is the character may clip wall corners by ½ cell visually).
        const c0 = Math.max(0, Math.ceil((bb.min.x - x0) / cell));
        const c1 = Math.min(cols - 1, Math.floor((bb.max.x - x0) / cell));
        const r0 = Math.max(0, Math.ceil((bb.min.z - z0) / cell));
        const r1 = Math.min(rows - 1, Math.floor((bb.max.z - z0) / cell));
        for (let r = r0; r <= r1; r++)
          for (let c = c0; c <= c1; c++)
            blocked[r * cols + c] = 1;
      }
      grid = { x0, z0, cols, rows, cell, blocked };
      try {
        if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'DEBUG', msg: 'GRID cell=' + cell.toFixed(2) + ' cols=' + cols + ' rows=' + rows
        }));
      } catch(_) {}
    }

    function worldToCell(wx, wz) {
      if (!grid) return { c: 0, r: 0 };
      return {
        c: Math.max(0, Math.min(grid.cols - 1, Math.round((wx - grid.x0) / grid.cell))),
        r: Math.max(0, Math.min(grid.rows - 1, Math.round((wz - grid.z0) / grid.cell)))
      };
    }

    function cellToWorld(c, r) {
      return new THREE.Vector3(grid.x0 + c * grid.cell, personFloorY, grid.z0 + r * grid.cell);
    }

    function cellFree(c, r) {
      if (!grid || c < 0 || c >= grid.cols || r < 0 || r >= grid.rows) return false;
      return grid.blocked[r * grid.cols + c] === 0;
    }

    // Spiral-search for nearest free cell (in case start/goal lands inside a wall)
    function nearestFree(c, r) {
      if (cellFree(c, r)) return { c, r };
      for (let d = 1; d <= 6; d++) {
        for (let dc = -d; dc <= d; dc++) {
          for (let dr = -d; dr <= d; dr++) {
            if (Math.abs(dc) !== d && Math.abs(dr) !== d) continue;
            if (cellFree(c + dc, r + dr)) return { c: c + dc, r: r + dr };
          }
        }
      }
      return { c, r };
    }

    // Walk grid cells along the line (ax,az)→(bx,bz) — returns true if EVERY
    // cell is free.  Used instead of raycasting for both path-check and simplify.
    function gridLineIsClear(ax, az, bx, bz) {
      if (!grid) return false; // no grid → force A* path (not a clear straight line)
      const sc = worldToCell(ax, az);
      const ec = worldToCell(bx, bz);
      const steps = Math.max(Math.abs(ec.c - sc.c), Math.abs(ec.r - sc.r));
      if (steps === 0) return cellFree(sc.c, sc.r);
      for (let i = 0; i <= steps; i++) {
        const t  = i / steps;
        const c  = Math.round(sc.c + (ec.c - sc.c) * t);
        const r  = Math.round(sc.r + (ec.r - sc.r) * t);
        if (!cellFree(c, r)) return false; // was: gridBlocked(c,r) — function never existed → ReferenceError
      }
      return true;
    }

    // Greedy string-pull: remove waypoints where grid LOS is clear.
    function simplifyPathGrid(pts) {
      if (pts.length <= 2) return pts;
      const out = [pts[0]];
      let i = 0;
      while (i < pts.length - 1) {
        let j = pts.length - 1;
        while (j > i + 1 && !gridLineIsClear(pts[i].x, pts[i].z, pts[j].x, pts[j].z)) j--;
        out.push(pts[j]);
        i = j;
      }
      return out;
    }

    // Binary-min-heap A*.  The previous version scanned the whole open list
    // linearly each iteration → O(N²) → froze the WebView for several seconds
    // on large grids.  Heap version is O(N log N) and runs in <100 ms even
    // on 250×250 grids with thousands of nodes expanded.
    function gridAstar(sc, sr, gc, gr) {
      const { cols, rows, blocked } = grid;
      const N = cols * rows;
      if (N > 4_000_000) return null; // safety: refuse insanely big grids
      const G = new Float32Array(N).fill(Infinity);
      const came = new Int32Array(N).fill(-1);
      const closed = new Uint8Array(N);
      const K = (c, r) => r * cols + c;
      const H = (c, r) => Math.sqrt((c - gc) * (c - gc) + (r - gr) * (r - gr));
      const DIRS = [[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[-1,1,1.414],[1,-1,1.414],[-1,-1,1.414]];

      // Min-heap: parallel arrays heapF (priority) and heapK (cell index).
      const heapF = [], heapK = [];
      function hpush(k, f) {
        let i = heapF.length;
        heapF.push(f); heapK.push(k);
        while (i > 0) {
          const p = (i - 1) >> 1;
          if (heapF[p] <= heapF[i]) break;
          const tf = heapF[p]; heapF[p] = heapF[i]; heapF[i] = tf;
          const tk = heapK[p]; heapK[p] = heapK[i]; heapK[i] = tk;
          i = p;
        }
      }
      function hpop() {
        const k0 = heapK[0];
        const last = heapF.length - 1;
        if (last > 0) { heapF[0] = heapF[last]; heapK[0] = heapK[last]; }
        heapF.pop(); heapK.pop();
        let i = 0; const n = heapF.length;
        while (true) {
          const l = 2*i + 1, r = 2*i + 2;
          let s = i;
          if (l < n && heapF[l] < heapF[s]) s = l;
          if (r < n && heapF[r] < heapF[s]) s = r;
          if (s === i) break;
          const tf = heapF[i]; heapF[i] = heapF[s]; heapF[s] = tf;
          const tk = heapK[i]; heapK[i] = heapK[s]; heapK[s] = tk;
          i = s;
        }
        return k0;
      }

      const sk = K(sc, sr), ek = K(gc, gr);
      G[sk] = 0;
      hpush(sk, H(sc, sr));

      let iters = 0;
      const MAX_ITERS = 250000; // hard cap so a click can never freeze forever

      while (heapF.length > 0) {
        if (++iters > MAX_ITERS) return null;
        const cur = hpop();
        if (closed[cur]) continue; // stale heap entry — already popped via better path
        if (cur === ek) {
          const path = [];
          let k = cur;
          while (k !== -1) { path.unshift(cellToWorld(k % cols, Math.floor(k / cols))); k = came[k]; }
          return path;
        }
        closed[cur] = 1;
        const cc = cur % cols, cr = Math.floor(cur / cols);
        for (let d = 0; d < 8; d++) {
          const dc = DIRS[d][0], dr = DIRS[d][1], cost = DIRS[d][2];
          const nc = cc + dc, nr = cr + dr;
          if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
          const nk = K(nc, nr);
          if (blocked[nk] || closed[nk]) continue;
          const ng = G[cur] + cost;
          if (ng < G[nk]) {
            came[nk] = cur;
            G[nk] = ng;
            hpush(nk, ng + H(nc, nr)); // duplicates OK — closed[] guards on pop
          }
        }
      }
      return null;
    }

    // Remove intermediate waypoints where direct LOS is clear (smooth the grid path)
    function simplifyPath(pts) {
      if (pts.length <= 2) return pts;
      const out = [pts[0]];
      let i = 0;
      while (i < pts.length - 1) {
        let j = pts.length - 1;
        while (j > i + 1 && !hasLineOfSight(pts[i], pts[j])) j--;
        out.push(pts[j]);
        i = j;
      }
      return out;
    }

    // ─── RENDER / ANIMATION LOOP ──────────────────────────────────────────────
    let pathLine = null, destMarker = null, pulseT = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (destMarker) { pulseT += 0.05; destMarker.scale.setScalar(1 + 0.3 * Math.sin(pulseT)); }
      if (personAnimating && personAnimPath) {
        personAnimT = Math.min(1, personAnimT + personAnimSpeedPerFrame);
        const pos = personAnimPath.getPoint(personAnimT);
        pos.y = personFloorY;
        if (personMarker) {
          if (personAnimT < 0.999) {
            const ahead = personAnimPath.getPoint(Math.min(1, personAnimT + 0.01));
            const d2 = new THREE.Vector2(ahead.x - pos.x, ahead.z - pos.z);
            if (d2.lengthSq() > 0.00001) personMarker.rotation.y = Math.atan2(d2.x, d2.y);
          }
          personMarker.position.copy(pos);
        }
        personPos.copy(pos);
        if (personAnimT >= 1) personAnimating = false;
      }
      renderer.render(scene, camera);
    }

    // ─── PATH HELPERS ─────────────────────────────────────────────────────────
    function getRoomCentroid(obj) {
      const box = new THREE.Box3().setFromObject(obj);
      const c = box.getCenter(new THREE.Vector3());
      c.y = box.min.y + 0.15;
      return c;
    }

    function clearPath() {
      [pathLine, destMarker].forEach(m => { if (m) scene.remove(m); });
      pathLine = destMarker = null;
    }

    // Build a path of straight line segments — no curve smoothing so the path
    // can never bulge into walls at corners. Used for both the visible tube
    // and the person animation.
    function buildLinearPath(positions) {
      const cp = new THREE.CurvePath();
      for (let i = 0; i < positions.length - 1; i++) {
        cp.add(new THREE.LineCurve3(positions[i].clone(), positions[i + 1].clone()));
      }
      return cp;
    }

    function drawPath(positions) {
      if (positions.length < 2) return;
      const tubeR = Math.max(0.05, modelSpan * 0.012);
      const cp = buildLinearPath(positions);
      const segs = Math.max(positions.length * 4, 30);
      pathLine = new THREE.Mesh(
        new THREE.TubeGeometry(cp, segs, tubeR, 8, false),
        new THREE.MeshStandardMaterial({ color: 0xFF6B00, emissive: 0xFF3300, emissiveIntensity: 0.9, transparent: true, opacity: 0.97 })
      );
      scene.add(pathLine);
    }

    function drawDestMarker(pos) {
      const r = Math.max(0.1, modelSpan * 0.035);
      destMarker = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xFF2D55, emissive: 0xFF0000, emissiveIntensity: 0.9 })
      );
      destMarker.position.copy(pos); destMarker.position.y += r;
      pulseT = 0; scene.add(destMarker);
    }

    // ─── NAVIGATE ────────────────────────────────────────────────────────────
    function navigateToPoint(goalPos) {
      if (!currentModel) { showToast('Modelo ainda não carregado'); return; }
      if (!grid) { showToast('Mapa de navegação ainda a carregar...'); return; }
      clearPath();

      // Check direct path using the GRID (not bbox LOS — grid is always consistent)
      if (gridLineIsClear(personPos.x, personPos.z, goalPos.x, goalPos.z)) {
        drawDestMarker(goalPos);
        const pts = [personPos.clone(), goalPos.clone()];
        drawPath(pts); beginPersonAnimation(buildLinearPath(pts));
        return;
      }

      // Grid A* — navigates cell by cell through any door gap
      const sc = worldToCell(personPos.x, personPos.z);
      const gc = worldToCell(goalPos.x,   goalPos.z);
      const s  = nearestFree(sc.c, sc.r);
      const g  = nearestFree(gc.c, gc.r);
      const raw = gridAstar(s.c, s.r, g.c, g.r);

      if (!raw || raw.length < 2) {
        showToast('Não é possível encontrar um caminho para este local');
        return;
      }

      // Pin exact world start/end, then string-pull using the grid
      raw[0] = personPos.clone();
      raw[raw.length - 1] = goalPos.clone();
      const pts = simplifyPathGrid(raw);

      drawDestMarker(goalPos);
      drawPath(pts);
      beginPersonAnimation(buildLinearPath(pts));
    }

    // Called from NAVIGATE message with a named destination
    function navigateFromPersonTo(destName) {
      if (!currentModel) return;
      const nodes = [];
      currentModel.traverse(obj => {
        if (obj.isMesh && isNavNode(obj.name)) nodes.push({ id: obj.name, pos: getRoomCentroid(obj) });
      });
      const goal = nodes.find(n => n.id === destName)
                || nodes.find(n => n.id.toLowerCase() === destName.toLowerCase());
      if (!goal) { showError(destName + ' não encontrada'); return; }
      navigateToPoint(goal.pos);
    }

    // ─── GLB LOADER ──────────────────────────────────────────────────────────
    function loadGLBFromBase64(base64, onLoaded) {
      showLoader(true);
      if (currentModel) { scene.remove(currentModel); currentModel = null; }
      clearPath();
      clearPerson();
      wallMeshes = [];
      wallBBoxes  = [];
      grid = null;

      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

      function afterLoad(model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        currentModel = model;
        scene.add(model);
        // CRITICAL: force all child world matrices to update NOW.
        // Without this, Box3.setFromObject / getRoomCentroid / raycasting all
        // use stale matrices (from before the position shift) and everything
        // ends up in the wrong place until the first renderer.render() fires.
        model.updateMatrixWorld(true);

        // Fit camera using only structural meshes (walls/rooms), NOT the floor
        // plane — a large Plane.* would skew the bounding box and push the
        // camera to an absurd distance.
        let structBox = null;
        model.traverse(obj => {
          if (!obj.isMesh) return;
          const wb = new THREE.Box3().setFromObject(obj);
          if ((wb.max.y - wb.min.y) < 0.3) return; // skip flat floors/markers
          structBox = structBox ? structBox.union(wb) : wb.clone();
        });
        const fitBox = structBox || box;
        const fitSize = fitBox.getSize(new THREE.Vector3());
        modelSpan = Math.max(fitSize.x, fitSize.z);

        // Dynamic zoom limits
        zoomMin = modelSpan * 0.15;
        zoomMax = modelSpan * 3.0;
        spherical.radius = modelSpan * 1.3;
        spherical.phi = 0.35;
        spherical.theta = 0;
        target.set(0, 0, 0);
        updateCamera();

        // Collect wall meshes for LOS — set DoubleSide so raycasts work from
        // inside the building regardless of which way face normals point.
        // Exclude floor/ceiling shaped meshes: anything whose height is less than
        // 20% of BOTH its width and depth is a flat slab, not a wall.
        wallMeshes = [];
        wallBBoxes  = [];

        // ── Prefer explicit col_* collision objects (added in Blender) ──────
        // If ANY col_* mesh exists the code uses ONLY those for collision and
        // hides them from the render.  This gives the designer full control:
        // place a thin box/plane on top of every wall section, leave gaps for
        // doorways, and the pathfinding just works.
        let hasColliders = false;
        model.traverse(obj => { if (obj.isMesh && isCollider(obj.name)) hasColliders = true; });

        if (hasColliders) {
          model.traverse(obj => {
            if (!obj.isMesh || !isCollider(obj.name)) return;
            obj.visible = false; // invisible — collision only
            const wb = new THREE.Box3().setFromObject(obj);
            wallMeshes.push(obj);
            wallBBoxes.push(wb);
          });
        } else {
          // ── Fallback: auto-detect walls by geometry ──────────────────────
          // (used when the model has no col_* objects)
          model.traverse(obj => {
            if (!obj.isMesh || isNavNode(obj.name)) return;
            const wb = new THREE.Box3().setFromObject(obj);
            const sz = wb.getSize(new THREE.Vector3());
            if (sz.y < 0.3) return; // too short
            if (sz.y < sz.x * 0.2 && sz.y < sz.z * 0.2) return; // floor/ceiling slab
            wallMeshes.push(obj);
            wallBBoxes.push(wb);
          });
        }

        // Build the navigation grid from the col_ bboxes
        buildGrid();

        // Place person at first nav node; fallback to floor centre if none found
        let startPos = null;
        const navNodeNames = [];
        model.traverse(obj => {
          if (!obj.isMesh || !isNavNode(obj.name)) return;
          navNodeNames.push(obj.name);
          if (!startPos) startPos = getRoomCentroid(obj);
        });
        if (!startPos) startPos = new THREE.Vector3(0, box.min.y + 0.1, 0);
        personFloorY = startPos.y;
        personPos.copy(startPos);
        createPersonMarker(startPos);

        // Debug — visible in Metro / Expo console
        const dbg = { type: 'DEBUG_LOAD', walls: wallMeshes.length,
          wallNames: wallMeshes.map(m => m.name).slice(0, 20),
          navNodes: navNodeNames, floorY: personFloorY, modelSpan };
        console.log('[Indoor3D]', JSON.stringify(dbg));
        try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(dbg)); } catch(_) {}

        showLoader(false);
        if (onLoaded) onLoaded(model);
      }

      if (typeof THREE.GLTFLoader !== 'undefined') {
        new THREE.GLTFLoader().parse(
          bytes.buffer, '',
          gltf => afterLoad(gltf.scene),
          err => {
            const msg = 'GLTFLoader: ' + err.message;
            showError('Erro ao carregar: ' + err.message);
            try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEBUG', msg })); } catch (e) {}
          }
        );
      } else {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 6), new THREE.MeshStandardMaterial({ color: 0x4A90D9 }));
        mesh.name = 'sala_placeholder';
        afterLoad(mesh);
      }
    }

    // ─── UTILITIES ───────────────────────────────────────────────────────────
    function showLoader(v) { document.getElementById('loader').style.display = v ? 'flex' : 'none'; }
    function showError(msg) { const el = document.getElementById('error'); el.textContent = msg; el.style.display = 'flex'; showLoader(false); }
    let toastTimer = null;
    function showToast(msg) {
      let el = document.getElementById('toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
          'background:rgba(30,30,30,0.92);color:#fff;font-family:sans-serif;font-size:15px;' +
          'padding:14px 22px;border-radius:14px;text-align:center;pointer-events:none;' +
          'z-index:999;max-width:80vw;line-height:1.4;';
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.style.opacity = '1';
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 3000);
    }

    // ─── MESSAGE HANDLER ─────────────────────────────────────────────────────
    let pendingDestino = null;
    function handleMessage(raw) {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'LOAD_MODEL') {
          pendingDestino = msg.destinoPendente || null;
          loadGLBFromBase64(msg.base64, () => {
            if (pendingDestino) { navigateFromPersonTo(pendingDestino); pendingDestino = null; }
          });
        }
        if (msg.type === 'SET_BG') scene.background = new THREE.Color(msg.color);
        if (msg.type === 'NAVIGATE') navigateFromPersonTo(msg.destino);
      } catch (e) { console.error(e); }
    }

    window.addEventListener('message', e => handleMessage(e.data));
    document.addEventListener('message', e => handleMessage(e.data));

    (function () {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/js/loaders/GLTFLoader.js';
      s.onload = () => console.log('GLTFLoader ready');
      document.head.appendChild(s);
    })();

    init();
    updateCamera();
  </script>
</body>
</html>`;

export default function Indoor3DScreen() {
  const router = useRouter();
  const { colors } = useSettings();
  const { tr } = useLanguage();
  const params = useLocalSearchParams<{
    buildingId: string;
    buildingName: string;
    floors: string;
    destino?: string;
    floorDestino?: string;
  }>();

  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [currentFloor, setCurrentFloor] = useState<number>(-1);
  const [modelError, setModelError] = useState<string | null>(null);
  const [showFloorMenu, setShowFloorMenu] = useState(false);

  const buildingId = params.buildingId ?? '';
  const buildingName = params.buildingName ?? '';
  const floorLevels: number[] = params.floors ? JSON.parse(params.floors) : [];
  const destino = params.destino ?? null;
  const floorDestino = params.floorDestino ? parseInt(params.floorDestino) : null;

  const sortedFloors = [...floorLevels].sort((a, b) => b - a);
  const hasMultipleFloors = floorLevels.length > 1;

  const sendModelToWebView = useCallback(async (level: number) => {
    if (!webViewRef.current) return;
    setLoading(true);
    setModelError(null);

    try {
      const base64 = await loadModelAsBase64(buildingId, level);
      webViewRef.current.postMessage(
        JSON.stringify({ type: 'LOAD_MODEL', base64, destinoPendente: destino ?? null })
      );
      setTimeout(() => setLoading(false), 800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[Indoor3D] loadModel failed:', msg);
      setModelError(msg);
      setLoading(false);
    }
  }, [buildingId, destino]);

  const handleWebViewLoad = useCallback(() => {
    const initialFloor = floorDestino ?? (floorLevels.length > 0 ? Math.min(...floorLevels) : 0);
    setCurrentFloor(initialFloor);
    webViewRef.current?.postMessage(JSON.stringify({ type: 'SET_BG', color: colors.bg }));
    sendModelToWebView(initialFloor);
  }, [floorLevels, floorDestino, colors.bg, sendModelToWebView]);

  const handleFloorSelect = (level: number) => {
    setShowFloorMenu(false);
    if (level === currentFloor || loading) return;
    setCurrentFloor(level);
    sendModelToWebView(level);
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <Ionicons name="cube-outline" size={64} color={colors.subtext} />
        <Text style={{ fontSize: 16, color: colors.subtext, marginTop: 16, textAlign: 'center', paddingHorizontal: 32 }}>
          {tr('Visualização 3D disponível apenas na app móvel.', '3D view available on mobile app only.')}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        >
          <Text style={{ color: colors.bg, fontWeight: '600' }}>{tr('Voltar', 'Back')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <WebView
        ref={webViewRef}
        style={StyleSheet.absoluteFillObject}
        originWhitelist={['*']}
        source={{ html: THREE_HTML }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        onLoad={handleWebViewLoad}
        onError={e => setModelError(e.nativeEvent.description)}
        onMessage={e => {
          try {
            const data = JSON.parse(e.nativeEvent.data);
            if (data.type === 'DEBUG') console.log('[Indoor3D]', data.msg);
            if (data.type === 'DEBUG_LOAD') console.log('[Indoor3D DEBUG_LOAD]', JSON.stringify(data));
          } catch {}
        }}
      />

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {tr('A carregar piso...', 'Loading floor...')}
          </Text>
        </View>
      )}

      {modelError && (
        <View style={styles.errorOverlay} pointerEvents="none">
          <Ionicons name="alert-circle-outline" size={36} color="#FF3B30" />
          <Text style={styles.errorText}>{modelError}</Text>
        </View>
      )}

      {/* Header */}
      <SafeAreaView edges={['top']} style={[styles.header, { backgroundColor: colors.card + 'EE' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {buildingName}
          </Text>
        </TouchableOpacity>

        {/* Floor pill — tappable when há múltiplos pisos */}
        <TouchableOpacity
          style={[styles.floorPill, { backgroundColor: colors.primary }]}
          onPress={() => hasMultipleFloors && setShowFloorMenu(v => !v)}
          disabled={!hasMultipleFloors}
          activeOpacity={hasMultipleFloors ? 0.7 : 1}
        >
          <Text style={[styles.floorPillText, { color: colors.bg }]}>
            {tr('Piso', 'Floor')} {currentFloor >= 0 ? currentFloor : '–'}
          </Text>
          {hasMultipleFloors && (
            <Ionicons
              name={showFloorMenu ? 'chevron-up' : 'chevron-down'}
              size={12}
              color={colors.bg}
              style={{ marginLeft: 4 }}
            />
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Floor dropdown menu */}
      {showFloorMenu && (
        <>
          {/* Backdrop para fechar o menu */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setShowFloorMenu(false)}
            activeOpacity={1}
          />
          <View style={[styles.floorMenu, { backgroundColor: colors.card }]}>
            {sortedFloors.map((level, idx) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.floorMenuItem,
                  idx < sortedFloors.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  currentFloor === level && { backgroundColor: colors.primary + '22' },
                ]}
                onPress={() => handleFloorSelect(level)}
                disabled={loading}
              >
                <Text style={[
                  styles.floorMenuItemText,
                  { color: currentFloor === level ? colors.primary : colors.text },
                ]}>
                  {tr('Piso', 'Floor')} {level}
                </Text>
                {currentFloor === level && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Banner de navegação */}
      {destino && (
        <View style={styles.navBanner}>
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text style={styles.navBannerText} numberOfLines={1}>
            {tr(`A navegar para: ${destino.replace(/_/g, ' ')}`, `Navigating to: ${destino.replace(/_/g, ' ')}`)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 6,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  headerTitle: { fontSize: 17, fontWeight: '700', marginLeft: 4, flex: 1 },
  floorPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 16,
  },
  floorPillText: { fontWeight: '700', fontSize: 13 },
  floorMenu: {
    position: 'absolute',
    top: 90,
    right: 16,
    borderRadius: 12,
    minWidth: 140,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 10,
    overflow: 'hidden',
    zIndex: 100,
  },
  floorMenuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13,
  },
  floorMenuItemText: { fontSize: 15, fontWeight: '600' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center', justifyContent: 'center', gap: 12,
    zIndex: 50,
  },
  loadingText: { fontSize: 15, fontWeight: '600' },
  errorOverlay: {
    position: 'absolute', bottom: 40, left: 24, right: 24,
    backgroundColor: '#FFF0F0', borderRadius: 12,
    padding: 16, alignItems: 'center', gap: 8,
    zIndex: 50,
  },
  errorText: { color: '#FF3B30', fontSize: 14, textAlign: 'center' },
  navBanner: {
    position: 'absolute', top: 90, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 5,
    zIndex: 40,
  },
  navBannerText: { color: '#fff', fontWeight: '600', fontSize: 14, flex: 1 },
});
