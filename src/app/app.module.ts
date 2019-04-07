import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeaModule } from './features/+sea/sea.module';
import { HomeModule } from './features/+home/home.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DashboardModule } from './features/+dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginModule } from './features/+login';
import { ProjectModule } from './features/+project/project.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
    LoginModule.forRoot(),
    ProjectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: ((http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json')),
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

