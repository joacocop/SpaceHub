import { Component, OnInit } from '@angular/core';

interface Launch {
  id: number;
  name: string;
  date: Date;
  rocket: string;
  destination: string;
  status: 'exitoso' | 'fallido' | 'cancelado' | 'programado';
  crew: number;
  payload: string;
}

@Component({
  selector: 'app-launch-history',
  templateUrl: './launch-history.component.html',
  styleUrls: ['./launch-history.component.css']
})
export class LaunchHistoryComponent implements OnInit {
  launches: Launch[] = [
    { id: 1, name: 'Artemis II', date: new Date('2026-03-15'), rocket: 'SLS Block 1', destination: 'Órbita Lunar', status: 'exitoso', crew: 4, payload: 'Orion MPCV' },
    { id: 2, name: 'Crew-9', date: new Date('2026-02-20'), rocket: 'Falcon 9', destination: 'ISS', status: 'exitoso', crew: 4, payload: 'Crew Dragon' },
    { id: 3, name: 'Starship-12', date: new Date('2026-01-10'), rocket: 'Starship', destination: 'Órbita Terrestre', status: 'fallido', crew: 0, payload: 'Carga de prueba' },
    { id: 4, name: 'Vulcan-Centaur', date: new Date('2025-12-05'), rocket: 'Vulcan', destination: 'Luna', status: 'exitoso', crew: 0, payload: 'Peregrine Lander' },
    { id: 5, name: 'Axiom-4', date: new Date('2026-04-01'), rocket: 'Falcon 9', destination: 'ISS', status: 'programado', crew: 4, payload: 'Crew Dragon' },
    { id: 6, name: 'Mars-2026', date: new Date('2026-09-15'), rocket: 'Starship', destination: 'Marte', status: 'programado', crew: 0, payload: 'Rover' },
    { id: 7, name: 'Boeing OFT-3', date: new Date('2025-11-20'), rocket: 'Atlas V', destination: 'ISS', status: 'exitoso', crew: 2, payload: 'Starliner' },
    { id: 8, name: 'Falcon Heavy-7', date: new Date('2025-10-15'), rocket: 'Falcon Heavy', destination: 'GEO', status: 'exitoso', crew: 0, payload: 'Satélite comms' },
    { id: 9, name: 'Soyuz MS-25', date: new Date('2026-03-01'), rocket: 'Soyuz-2.1a', destination: 'ISS', status: 'cancelado', crew: 3, payload: 'Soyuz MS' },
    { id: 10, name: 'New Glenn-2', date: new Date('2026-06-20'), rocket: 'New Glenn', destination: 'GTO', status: 'programado', crew: 0, payload: 'BSI-3000' }
  ];

  filteredLaunches: Launch[] = [];
  searchTerm = '';
  filterYear = '';
  filterStatus = '';

  years = ['2025', '2026'];
  statuses = ['exitoso', 'fallido', 'cancelado', 'programado'];

  constructor() { }

  ngOnInit(): void {
    this.filteredLaunches = [...this.launches];
  }

  applyFilters(): void {
    this.filteredLaunches = this.launches.filter(launch => {
      const matchesSearch = launch.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           launch.rocket.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           launch.destination.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesYear = !this.filterYear || launch.date.getFullYear().toString() === this.filterYear;
      const matchesStatus = !this.filterStatus || launch.status === this.filterStatus;

      return matchesSearch && matchesYear && matchesStatus;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterYear(): void {
    this.applyFilters();
  }

  onFilterStatus(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterYear = '';
    this.filterStatus = '';
    this.filteredLaunches = [...this.launches];
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}