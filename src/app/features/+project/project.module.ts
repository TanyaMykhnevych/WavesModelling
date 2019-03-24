import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutModule } from 'src/app/layout/app/layout.module';
import { CoreModule } from 'src/app/core/core.module';
import { ProjectRoutingModule } from './routes/project-routing.module';
import { ProjectService } from './services/project.service';
import { ProjectsViewComponent } from './containers/projects-view/projects-view.component';
import { ProjectActionsComponent } from './components/project-actions/project-actions.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectSearchFormComponent } from './components/project-search-form/project-search-form.component';


@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        ProjectRoutingModule,
        CoreModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [
        ProjectsViewComponent,
        ProjectActionsComponent,
        ProjectListComponent,
        ProjectSearchFormComponent,
    ],
    entryComponents: [
    ],
})
export class ProjectModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ProjectModule,
            providers: [ProjectService],
        };
    }
}
