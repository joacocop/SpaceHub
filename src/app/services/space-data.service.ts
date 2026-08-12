import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError, retry, switchMap } from 'rxjs/operators';
import { SpaceEvent, Satellite, ApiResponse } from '../models/space-event.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceDataService {
  private eventsSubject = new BehaviorSubject<SpaceEvent[]>([]);
  private satellitesSubject = new BehaviorSubject<Satellite[]>([]);

  public events$ = this.eventsSubject.asObservable();
  public satellites$ = this.satellitesSubject.asObservable();

  private mockEvents: SpaceEvent[] = [
    {
      id: 1,
      name: 'Artemis III Launch',
      type: 'launch',
      date: new Date('2026-09-15'),
      location: 'Kennedy Space Center',
      description: 'Misión tripulada a la Luna',
      status: 'scheduled'
    },
    {
      id: 2,
      name: 'Mars Sample Return',
      type: 'discovery',
      date: new Date('2026-07-20'),
      location: 'Mars',
      description: 'Retorno de muestras marcianas',
      status: 'completed'
    },
    {
      id: 3,
      name: 'ISS Resupply Mission',
      type: 'launch',
      date: new Date('2026-08-10'),
      location: 'Baikonur Cosmodrome',
      description: 'Suministros para la Estación Espacial',
      status: 'scheduled'
    }
  ];

  private mockSatellites: Satellite[] = [
    { id: 1, name: 'Hubble', orbit: 'LEO', altitude: 547, velocity: 7.59, active: true },
    { id: 2, name: 'James Webb', orbit: 'L2', altitude: 1500000, velocity: 0, active: true },
    { id: 3, name: 'GPS IIF-12', orbit: 'MEO', altitude: 20200, velocity: 3.87, active: true },
    { id: 4, name: 'Starlink-42', orbit: 'LEO', altitude: 550, velocity: 7.5, active: false }
  ];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.eventsSubject.next(this.mockEvents);
    this.satellitesSubject.next(this.mockSatellites);
  }

  getEvents(): Observable<SpaceEvent[]> {
    return of(this.mockEvents).pipe(
      delay(500),
      retry(2),
      catchError(this.handleError)
    );
  }

  getSatellites(): Observable<Satellite[]> {
    return of(this.mockSatellites).pipe(
      delay(300),
      map(satellites => satellites.filter(s => s.active)),
      catchError(this.handleError)
    );
  }

  getEventById(id: number): Observable<SpaceEvent | undefined> {
    return of(this.mockEvents.find(event => event.id === id)).pipe(
      delay(200),
      catchError(this.handleError)
    );
  }

  addEvent(event: SpaceEvent): Observable<ApiResponse<SpaceEvent>> {
    const newEvent = { ...event, id: this.mockEvents.length + 1 };
    this.mockEvents.push(newEvent);
    this.eventsSubject.next(this.mockEvents);

    return of({
      data: newEvent,
      timestamp: new Date(),
      success: true,
      message: 'Evento agregado exitosamente'
    }).pipe(delay(400));
  }

  updateEventStatus(id: number, status: SpaceEvent['status']): Observable<ApiResponse<SpaceEvent>> {
    const event = this.mockEvents.find(e => e.id === id);
    if (event) {
      event.status = status;
      this.eventsSubject.next(this.mockEvents);
      return of({
        data: event,
        timestamp: new Date(),
        success: true,
        message: `Estado actualizado a ${status}`
      }).pipe(delay(300));
    }
    return throwError(() => new Error('Evento no encontrado'));
  }

  searchEvents(query: string): Observable<SpaceEvent[]> {
    return this.events$.pipe(
      map(events => events.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.description.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en SpaceDataService:', error);
    return throwError(() => new Error('Error al obtener datos espaciales'));
  }
}