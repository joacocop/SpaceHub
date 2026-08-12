import { Component, OnInit } from '@angular/core';

interface SpaceData {
  id: number;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  lastUpdate: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  spaceData: SpaceData[] = [
    { id: 1, name: 'ISS Tracker', type: 'Satellite', status: 'active', lastUpdate: new Date() },
    { id: 2, name: 'Mars Rover Data', type: 'Mission', status: 'active', lastUpdate: new Date() },
    { id: 3, name: 'Hubble Telescope', type: 'Telescope', status: 'pending', lastUpdate: new Date() },
    { id: 4, name: 'SpaceX Launches', type: 'Launch', status: 'active', lastUpdate: new Date() }
  ];

  selectedData: SpaceData | null = null;

  constructor() { }

  ngOnInit(): void {
    console.log('Dashboard inicializado con', this.spaceData.length, 'elementos');
  }

  selectData(data: SpaceData): void {
    this.selectedData = data;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}