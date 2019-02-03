import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-expansion-menu',
    templateUrl: './expansion-menu.component.html',
    styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent implements OnInit {

    @Input()
    public title: string = '';

    @Input()
    public opened: boolean = false;

    constructor() { }

    public ngOnInit(): void { }

    public toggle(): void {
        this.opened = !this.opened;
    }

}
