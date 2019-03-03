import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeaRoutingModule } from './routes/sea-routing.module';
import { Sea2DComponent } from './components/sea-2d/sea-2d.component';
import { Sea2DOperationsService } from './services/sea-2d-operations.service';
import { SeaDrawService } from './services/sea-draw.service';
import { Sea2DWavesComponent } from './containers/sea-2d-waves/sea-2d-waves.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeaOptionsComponent } from './components/sea-options/sea-options.component';
import { SeaHandlerComponent } from './components/sea-handler/sea-handler.component';
import { CoreModule } from 'src/app/core/core.module';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { Sea1DWavesComponent } from './containers/sea-1d-waves/sea-1d-waves.component';
import { Sea1DComponent } from './components/sea-1d/sea-1d.component';
import { Sea1DOperationsService } from './services/sea-1d-operations.service';
import { Sea3DOptionsComponent } from './components/sea3d-options/sea3d-options.component';
import { Sea3DOperationsService } from './services/sea-3d-operations.service';
import { OptionsTipComponent } from './components/options-tip/options-tip.component';


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
        Sea1DComponent,
        Sea3DOptionsComponent,
        OptionsTipComponent,
    ],
})
export class SeaModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SeaModule,
            providers: [
                Sea2DOperationsService, SeaDrawService, Sea1DOperationsService, Sea3DOperationsService
            ],
        };
    }
}
