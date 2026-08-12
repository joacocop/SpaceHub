export interface SpaceEvent {
  id: number;
  name: string;
  type: 'launch' | 'landing' | 'discovery' | 'observation';
  date: Date;
  location: string;
  description: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Satellite {
  id: number;
  name: string;
  orbit: string;
  altitude: number;
  velocity: number;
  active: boolean;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: Date;
  success: boolean;
  message?: string;
}