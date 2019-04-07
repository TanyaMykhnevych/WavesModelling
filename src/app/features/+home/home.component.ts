import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    public router: Router,
    private _authService: AuthService,
  ) { }

  public goToSea(): void {
    this.router.navigate(['/dashboard/routes']);
  }

  public get isAuthenticated(): boolean {
    return this._authService.isAuthenticated();
  }
}
