import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeaRoutingModule } from './routes/sea-routing.module';
import { Sea2DComponent } from './components/sea-2d/sea-2d.component';
import { SeaOperationsService } from './services/sea-operations.service';
import { SeaDrawService } from './services/sea-draw.service';
import { Sea2DWavesComponent } from './containers/sea-2d-waves/sea-2d-waves.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeaOptionsComponent } from './components/sea-options/sea-options.component';
import { SeaHandlerComponent } from './components/sea-handler/sea-handler.component';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { Sea1DWavesComponent } from './containers/sea-1d-waves/sea-1d-waves.component';
import { Sea3DWavesComponent } from './containers/sea-3d-waves/sea-3d-waves.component';
import { Sea1DComponent } from './components/sea-1d/sea-1d.component';
import { Sea1DOperationsService } from './services/sea-1d-operations.service';


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
        Sea2DComponent,
        Sea2DWavesComponent,
        SeaOptionsComponent,
        SeaHandlerComponent,
        Sea1DWavesComponent,
        Sea3DWavesComponent,
        Sea1DComponent,
    ],
})
export class SeaModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SeaModule,
            providers: [
                SeaOperationsService, SeaDrawService, Sea1DOperationsService
            ],
        };
    }
}
