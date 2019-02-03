import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeaRoutingModule } from './routes/sea-routing.module';
import { SeaComponent } from './components/sea/sea.component';
import { SeaOperationsService } from './services/sea-operations.service';
import { SeaDrawService } from './services/sea-draw.service';
import { SeaWavesComponent } from './containers/sea-waves.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeaOptionsComponent } from './components/sea-options/sea-options.component';
import { SeaHandlerComponent } from './components/sea-handler/sea-handler.component';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from 'src/app/layout/app/layout.module';


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        SeaRoutingModule,
        CoreModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        SeaComponent,
        SeaWavesComponent,
        SeaOptionsComponent,
        SeaHandlerComponent,
    ],
})
export class SeaModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SeaModule,
            providers: [
                SeaOperationsService, SeaDrawService
            ],
        };
    }
}
