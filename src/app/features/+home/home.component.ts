import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public title = 'Waves Modelling';

  constructor(
    public router: Router
  ) { }

  public goToSea(): void {
    this.router.navigate(['/dashboard/routes']);
  }
}
