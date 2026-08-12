import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, interval, timer } from 'rxjs';
import { map, takeUntil, switchMap, shareReplay } from 'rxjs/operators';

export interface RealTimeData {
  type: string;
  value: number;
  timestamp: Date;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private connectionStatus$ = new Subject<boolean>();

  public isConnected$ = this.connectionStatus$.asObservable();

  constructor() {
    this.simulateConnection();
  }

  private simulateConnection(): void {
    setTimeout(() => {
      this.connectionStatus$.next(true);
    }, 1000);
  }

  getSolarData(): Observable<RealTimeData> {
    return interval(2000).pipe(
      takeUntil(this.destroy$),
      map(() => ({
        type: 'solar_irradiance',
        value: Math.random() * 1000 + 500,
        timestamp: new Date(),
        source: 'SDO Satellite'
      })),
      shareReplay(1)
    );
  }

  getAuroraData(): Observable<RealTimeData> {
    return interval(3000).pipe(
      takeUntil(this.destroy$),
      map(() => ({
        type: 'aurora_intensity',
        value: Math.random() * 10,
        timestamp: new Date(),
        source: 'NOAA Observatory'
      })),
      shareReplay(1)
    );
  }

  getISSPosition(): Observable<{ latitude: number; longitude: number; altitude: number }> {
    return interval(5000).pipe(
      takeUntil(this.destroy$),
      map(() => ({
        latitude: (Math.random() * 180) - 90,
        longitude: (Math.random() * 360) - 180,
        altitude: 408 + (Math.random() * 2)
      })),
      shareReplay(1)
    );
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.connectionStatus$.next(false);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}