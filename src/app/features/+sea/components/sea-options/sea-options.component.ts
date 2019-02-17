import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IOptions } from '../../models/options';
import { DEFAULT_SEA_2D_OPTIONS } from '../../constants/sea.constant';

@Component({
    selector: 'app-sea-options',
    templateUrl: './sea-options.component.html',
    styleUrls: ['./sea-options.component.css']
})
export class SeaOptionsComponent implements OnInit {
    @Input() public options: IOptions;
    @Output() public valueChanges: EventEmitter<IOptions> = new EventEmitter<IOptions>();

    public form: FormGroup;
    public submitted: boolean = false;
    private _subscriptions: Subscription[] = [];

    constructor(
        private _builder: FormBuilder,
    ) {
    }

    public ngOnInit(): void {
        this.form = this._builder.group({
            D: new FormControl(this.options.D, [Validators.required]),
            N: new FormControl(this.options.N),
            OMEGA: new FormControl(this.options.OMEGA),
            W: new FormControl(this.options.W),
            R: new FormControl(this.options.R),
        });

        const valueChangesSubscription = this.form.valueChanges.subscribe((value: IOptions) => {
            value.N = DEFAULT_SEA_2D_OPTIONS.N;
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
}
