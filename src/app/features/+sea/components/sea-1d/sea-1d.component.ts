import { Component, ViewChild, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ISea1D } from '../../models/sea';
import { DEFAULT_SEA, DEFAULT_SEA_1D_OPTIONS } from '../../constants/sea.constant';
import { Sea1DOperationsService } from '../../services/sea-1d-operations.service';


@Component({
    selector: 'app-sea-1d',
    templateUrl: './sea-1d.component.html',
    styleUrls: ['./sea-1d.component.scss']
})
export class Sea1DComponent implements OnInit, OnDestroy{
    @ViewChild('canvas1dsea') canvas1d: ElementRef;
    public context: CanvasRenderingContext2D;
    public canvasData: ImageData;
    public sea: ISea1D = DEFAULT_SEA;
    public timerId;
    public playPauseIcon: string = 'play_arrow';
    public options = DEFAULT_SEA_1D_OPTIONS;

    public constructor(
        private _seaOperationsService: Sea1DOperationsService
    ) { }

    public ngOnInit(): void {
        this._seaOperationsService.sea = this.sea;
        this._initSea();
        this._seaOperationsService.addOscillator(this.options.N / 2, 0.013, 1);
    }

    public ngOnDestroy(): void {
        this._stop();
    }

    public get context1d(): CanvasRenderingContext2D {
        return (<HTMLCanvasElement>this.canvas1d.nativeElement).getContext('2d');
    }

    public ngAfterViewInit(): void {
        this.draw();
    }

    public clear(): void {
        this._seaOperationsService.clearSea();
        this._initSea();
        this.context1d.clearRect(0, 0, this.options.N, this.options.N);
        this.draw();
    }

    public play(): void {
        if (this.timerId) {
            this._stop();
        } else {
            this.playPauseIcon = 'pause';
            this.timerId = setInterval(() => {
                this._seaOperationsService.step();
                this.draw();
            }, 50);
        }
    }

    public draw(): void {
        let y = this.sea.n / 2 | 0;

        this.context1d.clearRect(0, 0, this.sea.n, this.sea.n);
        this.context1d.strokeStyle = 'gray';
        this.context1d.lineWidth = 0.5;
        this.context1d.strokeRect(0, y, this.sea.n - 1, 0);
        this.context1d.strokeRect(y, 0, 0, this.sea.n - 1);

        this.context1d.lineWidth = 1;
        this.context1d.strokeStyle = 'red';
        this.context1d.beginPath();
        for (let x = 0; x < this.options.N; x++) {
            let h = this.sea.water[x].x;
            this.context1d.moveTo(x, y);
            this.context1d.lineTo(x, y + 30 * h);
        }
        this.context1d.stroke();
    }

    private _initSea(): void {
        this._seaOperationsService.initSea(this.options);
    }

    private _stop(): void {
        clearInterval(this.timerId);
        this.timerId = null;
        this.playPauseIcon = 'play_arrow';
    }
}
