import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  features = [
    {
      title: 'Datos en Tiempo Real',
      description: 'Accede a datos espaciales actualizados constantemente',
      icon: '🛰️'
    },
    {
      title: 'Análisis con RxJS',
      description: 'Procesamiento reactivo de flujos de datos complejos',
      icon: '📊'
    },
    {
      title: 'TypeScript Seguro',
      description: 'Código tipado y mantenible con Angular',
      icon: '🛡️'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('SpaceHub Home inicializado');
  }
}