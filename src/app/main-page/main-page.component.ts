import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AxiosService} from "../services/axios.service";
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";
import {UserService} from "../services/user.service";

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
  userService: UserService = inject(UserService);
  userDetails: User | null = null;
  photoUrl: string | null = null;

  constructor(private axiosService: AxiosService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadUserDetails();
  }

  async loadUserDetails(): Promise<void> {
    this.userDetails = await this.authService.getUserDetails();
    this.photoUrl = await this.userService.getProfilePhoto(this.userDetails?.profilePhotoPath);
  }
  onLogout(): void {
    this.axiosService.setAuthToken(null);
    this.router.navigate(['/auth/login']);
  }
}
