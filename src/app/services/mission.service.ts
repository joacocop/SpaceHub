import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Mission {
  id: number;
  name: string;
  destination: string;
  launchDate: Date;
  status: 'programada' | 'en_curso' | 'completada' | 'cancelada';
  crew: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private missions: Mission[] = [
    { id: 1, name: 'Artemis III', destination: 'Luna', launchDate: new Date('2026-09-15'), status: 'programada', crew: 4, description: 'Misión tripulada de aterrizaje lunar' },
    { id: 2, name: 'Mars-2026', destination: 'Marte', launchDate: new Date('2026-11-01'), status: 'programada', crew: 0, description: 'Rover de exploración marciana' },
    { id: 3, name: 'ISS Expedition 72', destination: 'ISS', launchDate: new Date('2026-03-01'), status: 'en_curso', crew: 6, description: 'Expedición de investigación en estación espacial' },
    { id: 4, name: 'Voyager Legacy', destination: 'Espacio Profundo', launchDate: new Date('2025-06-15'), status: 'completada', crew: 0, description: 'Sonda de exploración interplanetaria' },
    { id: 5, name: 'Europa Clipper', destination: 'Júpiter', launchDate: new Date('2024-10-14'), status: 'en_curso', crew: 0, description: 'Exploración de la luna Europa' }
  ];

  private missionsSubject = new BehaviorSubject<Mission[]>(this.missions);
  public missions$ = this.missionsSubject.asObservable();
  private nextId = 6;

  getMissions(): Mission[] {
    return this.missions;
  }

  getMissionById(id: number): Mission | undefined {
    return this.missions.find(m => m.id === id);
  }

  addMission(mission: Omit<Mission, 'id'>): void {
    const newMission = { ...mission, id: this.nextId++ };
    this.missions.push(newMission);
    this.missionsSubject.next(this.missions);
  }

  updateMission(id: number, updates: Partial<Mission>): void {
    const index = this.missions.findIndex(m => m.id === id);
    if (index !== -1) {
      this.missions[index] = { ...this.missions[index], ...updates };
      this.missionsSubject.next(this.missions);
    }
  }

  deleteMission(id: number): void {
    this.missions = this.missions.filter(m => m.id !== id);
    this.missionsSubject.next(this.missions);
  }
}