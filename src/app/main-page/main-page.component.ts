import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AxiosService} from "../axios.service";
import {AuthService} from "../auth/auth.service";
import {UserInterface} from "../user";

@Component({
  selector: 'app-main-page',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        RouterOutlet
    ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  authService: AuthService = inject(AuthService);
  userDetails: UserInterface | null = null;
  constructor(private axiosService: AxiosService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  async loadUserDetails(): Promise<void> {
    this.userDetails = await this.authService.getUserDetails();
  }
  onLogout(): void {
    this.axiosService.setAuthToken(null);
    this.router.navigate(['/auth/login']);
  }
}
