import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AxiosService} from "../../services/axios.service";
import {AuthService} from "../../services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  template: `
    <div class="wrapper">
      <section>
        <h1>Dołącz do Party Pilot!</h1>
        <form [formGroup]="registerForm" (submit)="onSubmitRegister()">
          <input id="firstName" type="text" formControlName="firstName" placeholder="Imie">
          <input id="lastName" type="text" formControlName="lastName" placeholder="Nazwisko">
          <input id="phoneNumber" type="text" formControlName="phoneNumber" placeholder="Numer telefonu">
          <input id="email" type="text" formControlName="email" placeholder="Adres Email">
          <input id="password" type="password" formControlName="password" placeholder="Hasło">
          <p *ngIf="error">{{ error }}</p>
          <button type="submit" class="login-button">Zarejestruj</button>
        </form>
        <h4>Masz już konto? <a routerLink="/auth/login">Zaloguj się</a></h4>
      </section>
    </div>
  `,
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  authService: AuthService = inject(AuthService);
  axiosService: AxiosService = inject(AxiosService);
  router: Router = inject(Router);

  error: string | null = null;
  registerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phoneNumber: new FormControl(''),
    password: new FormControl('')
  });

  onSubmitRegister() {
    this.axiosService.request(
      "POST",
      "/register",
      this.registerForm.getRawValue()
    ).then((response) => {
      this.axiosService.setAuthToken(response.data.token);
      this.authService.setUserId(response.data.id);
      this.router.navigate(["/main/discover"]);
    }).catch((response) => {
      this.error = response.response.data.message;
    });
  }
}
