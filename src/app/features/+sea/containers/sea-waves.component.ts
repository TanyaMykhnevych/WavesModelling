import { Component, OnInit } from '@angular/core';
import { IOptions } from '../models/options';
import { DEFAULT_SEA_OPTIONS } from '../constants/sea.constant';

@Component({
    selector: 'app-sea-waves',
    templateUrl: './sea-waves.component.html',
    styleUrls: ['./sea-waves.component.css']
})
export class SeaWavesComponent implements OnInit {

    public options: IOptions = DEFAULT_SEA_OPTIONS;

    public constructor() { }

    public ngOnInit(): void {
    }

    public handleOptionsChanges(options: IOptions): void {
        this.options = options;
    }
}
