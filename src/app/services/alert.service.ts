import { Injectable, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Alert {
  id: number;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private alertSubject = new Subject<Alert>();
  private alerts: Alert[] = [];
  private alertIdCounter = 0;

  public alerts$ = this.alertSubject.asObservable();

  private alertTemplates = [
    { type: 'info' as const, title: 'Telemetría', message: 'Datos de telemetría recibidos correctamente' },
    { type: 'warning' as const, title: 'Temperatura', message: 'Temperatura exterior por encima del umbral' },
    { type: 'critical' as const, title: 'Falla Detectada', message: 'Anomalía en el sistema de navegación' },
    { type: 'success' as const, title: 'Órbita Estable', message: 'Inyección de órbita completada exitosamente' },
    { type: 'info' as const, title: 'Comunicaciones', message: 'Señal con Houston restablecida' },
    { type: 'warning' as const, title: 'Combustible', message: 'Nivel de combustible al 25%' },
    { type: 'critical' as const, title: 'Presión', message: 'Caída de presión en cápsula detectada' },
    { type: 'success' as const, title: 'EVA Completada', message: 'Actividad extravehicular finalizada con éxito' },
    { type: 'info' as const, title: 'Carga', message: 'Payload desplegado correctamente' },
    { type: 'warning' as const, title: 'Radiación', message: 'Niveles de radiación elevados detectados' }
  ];

  constructor() {
    this.startRandomAlerts();
  }

  private startRandomAlerts(): void {
    interval(5000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      const template = this.alertTemplates[Math.floor(Math.random() * this.alertTemplates.length)];
      this.addAlert(template.type, template.title, template.message);
    });
  }

  addAlert(type: Alert['type'], title: string, message: string): void {
    const alert: Alert = {
      id: ++this.alertIdCounter,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    this.alerts.unshift(alert);
    this.alertSubject.next(alert);

    if (this.alerts.length > 50) {
      this.alerts.pop();
    }
  }

  getAlerts(): Alert[] {
    return this.alerts;
  }

  markAsRead(id: number): void {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.read = true;
    }
  }

  markAllAsRead(): void {
    this.alerts.forEach(a => a.read = true);
  }

  deleteAlert(id: number): void {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }

  clearAll(): void {
    this.alerts = [];
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.read).length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}