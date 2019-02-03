import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Handler } from '../../models/handlers.enum';

@Component({
    selector: 'app-sea-handler',
    templateUrl: './sea-handler.component.html',
    styleUrls: ['./sea-handler.component.css']
})
export class SeaHandlerComponent implements OnInit {
    public handlerEnum = Handler;
    @Input() public handler: Handler;
    @Output() public valueChanges: EventEmitter<Handler> = new EventEmitter<Handler>();

    public form: FormGroup;
    private _subscriptions: Subscription[] = [];

    constructor(
        private _builder: FormBuilder,
    ) {
    }

    public ngOnInit(): void {
        this.form = this._builder.group({
            handler: new FormControl(this.handler),
        });

        const valueChangesSubscription = this.form.valueChanges.subscribe((value: any) => {
            this.valueChanges.emit(value.handler);
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
