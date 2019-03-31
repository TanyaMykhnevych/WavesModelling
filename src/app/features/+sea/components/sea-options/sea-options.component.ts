import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IOptions } from '../../models/options';

@Component({
    selector: 'app-sea-options',
    templateUrl: './sea-options.component.html',
    styleUrls: ['./sea-options.component.css']
})
export class SeaOptionsComponent implements OnInit {
    @Input() public set options(options: IOptions) {
        this._options = options;
    }

    public get options(): IOptions {
        return this._options;
    }

    @Output() public valueChanges: EventEmitter<IOptions> = new EventEmitter<IOptions>();

    public form: FormGroup;
    public submitted: boolean = false;
    private _subscriptions: Subscription[] = [];
    private _options: IOptions;

    constructor(
        private _builder: FormBuilder,
    ) {
    }

    public ngOnInit(): void {
        this.form = this._builder.group({
            d: new FormControl(this._options.d, [Validators.required]),
            n: new FormControl({ value: this._options.n, disabled: false }),
            omega: new FormControl(this._options.omega),
            w: new FormControl(this._options.w),
            r: new FormControl(this._options.r),
        });

        const valueChangesSubscription = this.form.valueChanges.subscribe((value: IOptions) => {
            if (value.n % value.d !== 0) {
                this.form.controls.n.setErrors({ notMultiple: true });
                this.form.controls.d.setErrors({ notMultiple: true });
                return;
            }
            this.valueChanges.emit(value);
        });

        this._subscriptions.push(valueChangesSubscription);
    }

    public ngOnDestroy(): void {
        this._subscriptions
            .filter(subcription => !!subcription)
            .forEach(subscription => {
                subscription.unsubscribe();
            });
    }

    public getErrorMessage(): string {
        if (this.form.controls.D.hasError('notMultiple') && this.form.controls.N.hasError('notMultiple')) {
            return 'N % D must be 0';
        } else {
            this.form.controls.D.setErrors(null);
            this.form.controls.N.setErrors(null);
        }
    }
}
