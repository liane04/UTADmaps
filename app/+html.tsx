import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * HTML wrapper customizado para a versão web do UTAD Maps.
 *
 * Implementa requisitos WCAG 2.2:
 *  - 3.1.1 (A) Language of Page: `<html lang="pt-PT">`
 *  - 2.4.2 (A) Page Titled: `<title>` descritivo
 *  - 1.4.10 (AA) Reflow: viewport com initial-scale=1 sem maximum-scale
 *  - 1.4.4 (AA) Resize Text: NÃO usar `user-scalable=no` (permite zoom até 200%)
 *
 * Este ficheiro é apenas usado em web (Expo Web). Em iOS/Android é ignorado.
 *
 * Documentação: https://docs.expo.dev/router/reference/static-rendering/#root-html
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-PT">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="UTAD Maps — Aplicação de navegação inteligente para o campus da Universidade de Trás-os-Montes e Alto Douro. Indoor, outdoor e integração com horário académico."
        />
        <meta name="theme-color" content="#0066CC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UTAD Maps" />
        <meta name="format-detection" content="telephone=no" />
        <title>UTAD Maps — Navegação inteligente no campus</title>

        {/* Disable body scrolling on web (managed by RN ScrollView) */}
        <ScrollViewStyleReset />

        {/* Inline CSS minimal: focus-visible + skip link for WCAG 2.4.1/2.4.7 */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>
        <a href="#main" className="skip-to-content">
          Saltar para o conteúdo principal
        </a>
        <main id="main" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #F2F2F7;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000000;
  }
}
/* WCAG 2.4.7 Focus Visible: garantir contorno em todos os elementos focados via teclado */
*:focus-visible {
  outline: 3px solid #0066CC;
  outline-offset: 2px;
}
/* WCAG 2.4.1 Bypass Blocks: skip-to-content link */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  background: #000;
  color: #fff;
  padding: 12px 16px;
  z-index: 9999;
  text-decoration: none;
  font-weight: 600;
}
.skip-to-content:focus {
  left: 8px;
  top: 8px;
}
`;
