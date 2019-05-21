import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardViewComponent } from './containers/dashboard-view/dashboard-view.component';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { TopMenuComponent } from './components/top-menu/top-menu.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    DashboardRoutingModule,
    CoreModule,
    RouterModule,
  ],
  exports: [
    TopMenuComponent,
  ],
  declarations: [DashboardViewComponent, TopMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
