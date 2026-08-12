import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketService, RealTimeData } from '../../services/websocket.service';
import { SpaceDataService } from '../../services/space-data.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  solarData: RealTimeData | null = null;
  auroraData: RealTimeData | null = null;
  issPosition = { latitude: 0, longitude: 0, altitude: 0 };
  isConnected = false;

  metricsHistory: RealTimeData[] = [];

  constructor(
    private websocketService: WebSocketService,
    private spaceDataService: SpaceDataService
  ) { }

  ngOnInit(): void {
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.websocketService.isConnected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(connected => {
        this.isConnected = connected;
      });

    this.websocketService.getSolarData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.solarData = data;
        this.addToHistory(data);
      });

    this.websocketService.getAuroraData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.auroraData = data;
      });

    this.websocketService.getISSPosition()
      .pipe(takeUntil(this.destroy$))
      .subscribe(position => {
        this.issPosition = position;
      });
  }

  private addToHistory(data: RealTimeData): void {
    this.metricsHistory.unshift(data);
    if (this.metricsHistory.length > 10) {
      this.metricsHistory.pop();
    }
  }

  formatValue(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  }

  getStatusColor(): string {
    return this.isConnected ? '#00ff88' : '#ff4444';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.websocketService.disconnect();
  }
}