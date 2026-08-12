import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Astronaut {
  id: number;
  name: string;
  role: string;
  mission: string;
  status: 'active' | 'resting' | 'EVA';
  health: {
    heartRate: number;
    bloodPressure: string;
    oxygenLevel: number;
  };
  image: string;
  daysInSpace: number;
}

@Component({
  selector: 'app-astronauts',
  templateUrl: './astronauts.component.html',
  styleUrls: ['./astronauts.component.css']
})
export class AstronautsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  astronauts: Astronaut[] = [
    {
      id: 1,
      name: 'Commander Sarah Chen',
      role: 'Commander',
      mission: 'Artemis III',
      status: 'active',
      health: { heartRate: 72, bloodPressure: '120/80', oxygenLevel: 98 },
      image: '👩‍🚀',
      daysInSpace: 45
    },
    {
      id: 2,
      name: 'Dr. Marcus Williams',
      role: 'Flight Engineer',
      mission: 'Artemis III',
      status: 'EVA',
      health: { heartRate: 85, bloodPressure: '125/82', oxygenLevel: 97 },
      image: '👨‍🚀',
      daysInSpace: 45
    },
    {
      id: 3,
      name: 'Lt. Yuki Tanaka',
      role: 'Mission Specialist',
      mission: 'Artemis III',
      status: 'resting',
      health: { heartRate: 68, bloodPressure: '118/76', oxygenLevel: 99 },
      image: '👩‍🚀',
      daysInSpace: 42
    },
    {
      id: 4,
      name: 'Dr. Alex Petrov',
      role: 'Payload Commander',
      mission: 'ISS Expedition 72',
      status: 'active',
      health: { heartRate: 75, bloodPressure: '122/79', oxygenLevel: 98 },
      image: '👨‍🚀',
      daysInSpace: 120
    }
  ];

  selectedAstronaut: Astronaut | null = null;

  constructor() { }

  ngOnInit(): void {
    this.startHealthUpdates();
  }

  private startHealthUpdates(): void {
    interval(3000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.astronauts.forEach(astro => {
        astro.health.heartRate = Math.floor(65 + Math.random() * 25);
        astro.health.oxygenLevel = Math.floor(96 + Math.random() * 4);
      });
    });
  }

  selectAstronaut(astro: Astronaut): void {
    this.selectedAstronaut = astro;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'active': 'Activo',
      'resting': 'Descansando',
      'EVA': 'EVA (Extravehicular)'
    };
    return labels[status] || status;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}