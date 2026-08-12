import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MissionService, Mission } from '../../services/mission.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  missions: Mission[] = [];
  selectedMission: Mission | null = null;
  showModal = false;
  isEditing = false;

  formData: Omit<Mission, 'id'> = {
    name: '',
    destination: '',
    launchDate: new Date(),
    status: 'programada',
    crew: 0,
    description: ''
  };

  statuses = ['programada', 'en_curso', 'completada', 'cancelada'];

  constructor(private missionService: MissionService) { }

  ngOnInit(): void {
    this.missionService.missions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(missions => {
        this.missions = missions;
      });
  }

  openModal(mission?: Mission): void {
    if (mission) {
      this.isEditing = true;
      this.selectedMission = mission;
      this.formData = { ...mission };
    } else {
      this.isEditing = false;
      this.selectedMission = null;
      this.formData = {
        name: '',
        destination: '',
        launchDate: new Date(),
        status: 'programada',
        crew: 0,
        description: ''
      };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedMission = null;
  }

  saveMission(): void {
    if (this.isEditing && this.selectedMission) {
      this.missionService.updateMission(this.selectedMission.id, this.formData);
    } else {
      this.missionService.addMission(this.formData);
    }
    this.closeModal();
  }

  deleteMission(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta misión?')) {
      this.missionService.deleteMission(id);
    }
  }

  selectMission(mission: Mission): void {
    this.selectedMission = mission;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'programada': 'Programada',
      'en_curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return labels[status] || status;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}