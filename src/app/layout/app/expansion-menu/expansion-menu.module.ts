import { NgModule } from '@angular/core';
import { ExpansionMenuComponent } from './expansion-menu.component';

const COMPONENTS = [ExpansionMenuComponent];

@NgModule({
  imports: [],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class ExpansionMenuModule { }
