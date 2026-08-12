import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { TrajectoryComponent } from './components/trajectory/trajectory.component';
import { AstronautsComponent } from './components/astronauts/astronauts.component';
import { ChatComponent } from './components/chat/chat.component';
import { LaunchHistoryComponent } from './components/launch-history/launch-history.component';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    MetricsComponent,
    TrajectoryComponent,
    AstronautsComponent,
    ChatComponent,
    LaunchHistoryComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }