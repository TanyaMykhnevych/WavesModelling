import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ISea1D } from '../../models/sea';
import { DEFAULT_SEA, DEFAULT_SEA_1D_OPTIONS } from '../../constants/sea.constant';
import { Sea1DOperationsService } from '../../services/sea-1d-operations.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IOptions1D } from '../../models/options1D';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-sea-1d',
    templateUrl: './sea-1d.component.html',
    styleUrls: ['./sea-1d.component.scss']
})
export class Sea1DComponent implements OnInit, OnDestroy {
    @ViewChild('canvas1dsea') canvas1d: ElementRef;
    public context: CanvasRenderingContext2D;
    public canvasData: ImageData;
    public sea: ISea1D = DEFAULT_SEA;
    public timerId;
    public playPauseIcon: string = 'play_arrow';
    public options = DEFAULT_SEA_1D_OPTIONS;
    public form: FormGroup;
    private _valueChangesSubscription: Subscription;

    public constructor(
        private _seaOperationsService: Sea1DOperationsService,
        private _builder: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this._seaOperationsService.sea = this.sea;
        this._initSea();
        this._seaOperationsService.addOscillator(0, this.options.oscilOmega, 1);
        this._buildForm();
        this._createValueChangesSubscription();
    }

    public ngOnDestroy(): void {
        this._stop();
        if (this._valueChangesSubscription) {
            this._valueChangesSubscription.unsubscribe();
        }
    }

    public get context1d(): CanvasRenderingContext2D {
        return (<HTMLCanvasElement>this.canvas1d.nativeElement).getContext('2d');
    }

    public ngAfterViewInit(): void {
        this.draw();
    }

    public clear(): void {
        clearInterval(this.timerId);
        this.timerId = 0;
        this.playPauseIcon = 'play_arrow';
        this._seaOperationsService.clearSea();
        this._initSea();
        this._seaOperationsService.addOscillator(0, this.options.oscilOmega, 1);
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
        const V_SCALE = 30;
        let n05 = this.sea.n / 2 | 0;

        let ctx = this.context1d;
        ctx.clearRect(0, 0, this.sea.n, this.sea.n);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([1, 1]);

        ctx.beginPath();
        // Ox axis
        ctx.moveTo(0, n05); ctx.lineTo(this.sea.n, n05);
        // merge v. line
        ctx.moveTo(this.sea.n - this.options.merge, 0);
        ctx.lineTo(this.sea.n - this.options.merge, this.sea.n);
        // osc.ampl lines
        let osc = this.sea.oscillators[0];
        if (osc) {
            let h = n05 - osc.amplitude * V_SCALE;
            ctx.moveTo(0, h); ctx.lineTo(this.sea.n, h);
            h = n05 + osc.amplitude * V_SCALE;
            ctx.moveTo(0, h); ctx.lineTo(this.sea.n, h);
        }
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';

        for (let col = 0; col < this.options.n; col += 2) {
            let h = this.sea.water[col].x;
            ctx.beginPath();
            ctx.moveTo(col, n05);
            ctx.lineTo(col, n05 - V_SCALE * h);
            ctx.stroke();
        }
    }

    public getErrorMessage(): string {
        if (this.form.controls.n.hasError('invalidArgument') && this.form.controls.merge.hasError('invalidArgument')) {
            return 'N must be greater than Merge';
        } else {
            this.form.controls.n.setErrors(null);
            this.form.controls.merge.setErrors(null);
        }
    }

    private _initSea(): void {
        this._seaOperationsService.initSea(this.options);
    }

    private _stop(): void {
        clearInterval(this.timerId);
        this.timerId = null;
        this.playPauseIcon = 'play_arrow';
    }

    private _buildForm(): void {
        this.form = this._builder.group({
            n: new FormControl(this.options.n, [Validators.required]),
            km: new FormControl(this.options.km, [Validators.required]),
            merge: new FormControl(this.options.merge, [Validators.required]),
            w: new FormControl(this.options.w, [Validators.required]),
            oscilOmega: new FormControl(this.options.oscilOmega, [Validators.required]),
        });
    }

    private _createValueChangesSubscription(): void {
        this._valueChangesSubscription = this.form.valueChanges.subscribe((value: IOptions1D) => {
            if (value.n < value.merge) {
                this.form.controls.n.setErrors({ invalidArgument: true });
                this.form.controls.merge.setErrors({ invalidArgument: true });
                return;
            }

            this.options = value;
            this.clear();
            this._seaOperationsService.addOscillator(0, this.options.oscilOmega, 1);
        });

    }
}
