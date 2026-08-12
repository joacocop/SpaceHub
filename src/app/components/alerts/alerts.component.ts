import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  alerts: Alert[] = [];
  unreadCount = 0;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.alerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.alerts = this.alertService.getAlerts();
        this.unreadCount = this.alertService.getUnreadCount();
      });

    this.alerts = this.alertService.getAlerts();
    this.unreadCount = this.alertService.getUnreadCount();
  }

  markAsRead(id: number): void {
    this.alertService.markAsRead(id);
    this.unreadCount = this.alertService.getUnreadCount();
  }

  markAllAsRead(): void {
    this.alertService.markAllAsRead();
    this.unreadCount = 0;
  }

  deleteAlert(id: number): void {
    this.alertService.deleteAlert(id);
    this.alerts = this.alertService.getAlerts();
    this.unreadCount = this.alertService.getUnreadCount();
  }

  clearAll(): void {
    this.alertService.clearAll();
    this.alerts = [];
    this.unreadCount = 0;
  }

  getAlertIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'info': 'ℹ️',
      'warning': '⚠️',
      'critical': '🚨',
      'success': '✅'
    };
    return icons[type] || '📢';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}