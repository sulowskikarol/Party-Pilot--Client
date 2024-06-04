import {inject, Injectable} from '@angular/core';
import {User} from "../models/user";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AxiosService} from "./axios.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  axiosService: AxiosService = inject(AxiosService);
  router: Router = inject(Router);

  // private userDetailsSource = new BehaviorSubject<any>(null);
  // userDetails = this.userDetailsSource.asObservable();

  isAuthenticated(): boolean {
    if (this.axiosService.getAuthToken() != null) {
      return true;
    } else {
      this.router.navigate(["/auth/login"]);
      return false;
    }
  }

  setUserId(userId: string): void {
    window.localStorage.setItem("userid", userId);
  }

  getUserId() {
    return window.localStorage.getItem("userid");
  }

  async getUserDetails(): Promise<User | null> {
    try {
      const response = await this.axiosService.request(
        'GET',
        "/users/" + this.getUserId(),
        {}
      );
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response && axiosError.response.status === 403) {
        this.clearUserDetails();
        this.router.navigate(['/auth/login']);
      }
      return null;
    }
  }

  clearUserDetails(): void {
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("userid");
  }
}

export const isAuthenticatedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthService).isAuthenticated();
}
