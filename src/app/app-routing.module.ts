import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { TrajectoryComponent } from './components/trajectory/trajectory.component';
import { AstronautsComponent } from './components/astronauts/astronauts.component';
import { ChatComponent } from './components/chat/chat.component';
import { LaunchHistoryComponent } from './components/launch-history/launch-history.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'trajectory', component: TrajectoryComponent },
  { path: 'astronauts', component: AstronautsComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'launch-history', component: LaunchHistoryComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }