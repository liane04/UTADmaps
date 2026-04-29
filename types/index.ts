export interface User {
  id: string;
  email: string;
  user_metadata?: {
    ical_chave?: string;
    [key: string]: unknown;
  };
}

export interface Building {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
}

export interface Floor {
  id: string;
  building_id: string;
  name: string;
  level: number;
}

export interface Room {
  id: string;
  building_id: string;
  floor_id: string;
  name: string;
  type: string;
  description: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  room_id: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  class_name: string;
  start_time: string;
  end_time: string;
  room_id: string | null;
}
