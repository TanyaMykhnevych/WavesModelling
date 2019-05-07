import { Component, OnInit } from '@angular/core';
import { Handler } from '../../models/handlers.enum';
import { DEFAULT_SEA_2D_OPTIONS, DEFAULT_SEA } from '../../constants/sea.constant';
import { ISea } from '../../models/sea';
import { IProject } from 'src/app/features/+project/models/project';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sea-2d-waves-shared',
    templateUrl: './sea-2d-waves-shared.component.html',
    styleUrls: ['./sea-2d-waves-shared.component.scss']
})
export class Sea2DWavesSharedComponent implements OnInit {
    public handler: Handler = Handler.Oscil;
    public sea: ISea = DEFAULT_SEA;
    public project: IProject = {
        options: DEFAULT_SEA_2D_OPTIONS,
        sea: DEFAULT_SEA
    };

    public constructor(private _route: ActivatedRoute) { }

    public ngOnInit(): void {
        this.project = this._route.snapshot.data.project ? this._route.snapshot.data.project : this.project;
        this.sea = this.project ? this.project.sea : DEFAULT_SEA;
    }
}
