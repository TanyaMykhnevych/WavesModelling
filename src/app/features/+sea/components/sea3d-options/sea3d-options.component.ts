import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ISettings3D } from '../../models/settings3D';
import { DEFAULT_3D_SETTINGS } from '../../constants/sea.constant';

@Component({
    selector: 'app-sea3d-options',
    templateUrl: './sea3d-options.component.html',
    styleUrls: ['./sea3d-options.component.css']
})
export class Sea3DOptionsComponent implements OnInit {
    @Output() public valueChanges: EventEmitter<ISettings3D> = new EventEmitter<ISettings3D>();

    public form: FormGroup;
    public submitted: boolean = false;
    private _subscriptions: Subscription[] = [];

    constructor(private _builder: FormBuilder) { }

    public ngOnInit(): void {
        this.form = this._builder.group({
            cameraRange: new FormControl(DEFAULT_3D_SETTINGS.cameraRange),
            lightRange: new FormControl(DEFAULT_3D_SETTINGS.lightRange),
        });

        const valueChangesSubscription = this.form.valueChanges.subscribe((value: ISettings3D) => {
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
