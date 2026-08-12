import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Satellite {
  name: string;
  angle: number;
  speed: number;
  radius: number;
  color: string;
}

@Component({
  selector: 'app-trajectory',
  templateUrl: './trajectory.component.html',
  styleUrls: ['./trajectory.component.css']
})
export class TrajectoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('orbitCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private destroy$ = new Subject<void>();

  satellites: Satellite[] = [
    { name: 'ISS', angle: 0, speed: 0.02, radius: 100, color: '#00d4ff' },
    { name: 'Hubble', angle: Math.PI / 2, speed: 0.015, radius: 150, color: '#7b2cbf' },
    { name: 'Starlink', angle: Math.PI, speed: 0.025, radius: 200, color: '#00ff88' },
    { name: 'GPS', angle: Math.PI * 1.5, speed: 0.01, radius: 250, color: '#ffaa00' }
  ];

  selectedSatellite: Satellite | null = null;
  isAnimating = true;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.startAnimation();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 600;
    canvas.height = 600;
    this.ctx = canvas.getContext('2d')!;
  }

  private startAnimation(): void {
    interval(16).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.isAnimating) {
        this.update();
        this.draw();
      }
    });
  }

  private update(): void {
    this.satellites.forEach(sat => {
      sat.angle += sat.speed;
      if (sat.angle >= Math.PI * 2) {
        sat.angle -= Math.PI * 2;
      }
    });
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.ctx.fillStyle = 'rgba(12, 12, 29, 0.3)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tierra
    const earthGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
    earthGradient.addColorStop(0, '#1a73e8');
    earthGradient.addColorStop(1, '#0d47a1');
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    this.ctx.fillStyle = earthGradient;
    this.ctx.fill();

    // Órbitas y satélites
    this.satellites.forEach(sat => {
      // Órbita
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, sat.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `${sat.color}40`;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Satélite
      const x = centerX + Math.cos(sat.angle) * sat.radius;
      const y = centerY + Math.sin(sat.angle) * sat.radius;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, Math.PI * 2);
      this.ctx.fillStyle = sat.color;
      this.ctx.fill();

      // Brillo
      this.ctx.shadowColor = sat.color;
      this.ctx.shadowBlur = 15;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Nombre
      this.ctx.fillStyle = sat.color;
      this.ctx.font = '12px Arial';
      this.ctx.fillText(sat.name, x + 10, y - 10);
    });
  }

  selectSatellite(sat: Satellite): void {
    this.selectedSatellite = sat;
  }

  toggleAnimation(): void {
    this.isAnimating = !this.isAnimating;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}