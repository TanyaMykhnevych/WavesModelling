import { Component, OnInit } from '@angular/core';
import { IOptions } from '../../models/options';
import { Handler } from '../../models/handlers.enum';
import { DEFAULT_SEA_2D_OPTIONS } from '../../constants/sea.constant';

@Component({
    selector: 'app-sea-3d-waves',
    templateUrl: './sea-3d-waves.component.html',
    styleUrls: ['./sea-3d-waves.component.css']
})
export class Sea3DWavesComponent implements OnInit {

    public options: IOptions = DEFAULT_SEA_2D_OPTIONS;
    public handler: Handler = Handler.Oscil;

    public constructor() { }

    public ngOnInit(): void {
    }

    public handleOptionsChanges(options: IOptions): void {
        this.options = options;
    }

    public handleHandlerChanges(handler: Handler): void {
        this.handler = handler;
    }
}
