import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeaRoutingModule } from './routes/sea-routing.module';
import { SeaComponent } from './components/sea/sea.component';
import { SeaOperationsService } from './services/sea-operations.service';
import { SeaDrawService } from './services/sea-draw.service';
import { SeaWavesComponent } from './containers/sea-waves.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeaOptionsComponent } from './components/sea-options/sea-options.component';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatFormFieldModule,
} from '@angular/material';

import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { ObserversModule } from '@angular/cdk/observers';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        SeaRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatStepperModule,
        ScrollDispatchModule,
        MatFormFieldModule,
        ObserversModule,
        NoopAnimationsModule,
    ],
    declarations: [
        SeaComponent,
        SeaWavesComponent,
        SeaOptionsComponent,
    ],
    providers: [],
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
