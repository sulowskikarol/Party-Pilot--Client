import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AxiosService} from "../../services/axios.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
  ],
  template: `
    <div class="wrapper">
      <section>
        <h1>Zaloguj się na swoje konto</h1>
        <form [formGroup]="loginForm" (submit)="onSubmitLogin()">
          <input id="email" type="text" formControlName="email" placeholder="Adres Email">
          <input id="password" type="password" formControlName="password" placeholder="Hasło">
          <p *ngIf="error">{{ error }}</p>
          <button type="submit" class="login-button">Zaloguj</button>
        </form>
        <h4>Nie masz konta? <a routerLink="/auth/register">Zarejestruj się</a></h4>
      </section>
    </div>
  `,
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  axiosService: AxiosService = inject(AxiosService)
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  error: string | null = null;
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });


  onSubmitLogin(): void {
    this.axiosService.request(
      "POST",
      "/login",
          this.loginForm.value
    ).then((response) => {
      this.axiosService.setAuthToken(response.data.token);
      this.authService.setUserId(response.data.id);
      this.router.navigate(["/main/discover"]);
    }).catch((response) => {
      this.error = response.response.data.message;
    });
  }
}
