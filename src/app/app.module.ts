import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeaModule } from './features/+sea/sea.module';
import { HomeModule } from './features/+home/home.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './features/+dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginModule } from './features/+login';
import { ProjectModule } from './features/+project/project.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    DashboardModule,
    BrowserAnimationsModule,
    LayoutModule,
    SeaModule.forRoot(),
    HomeModule,
    LoginModule,
    ProjectModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

