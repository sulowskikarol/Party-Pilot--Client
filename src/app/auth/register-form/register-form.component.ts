import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <section>
      <h1>Dołącz do Party Pilot!</h1>
      <form [formGroup]="registerForm" (submit)="submitLogin()">
        <input id="email" type="text" formControlName="email" placeholder="Adres Email">

        <input id="password" type="password" formControlName="password" placeholder="Hasło">

        <input id="c_password" type="password" formControlName="c_password" placeholder="Powtórz hasło">
        <button type="submit" class="login-button">Zarejestruj</button>
      </form>
      <h4>Jesteś już użytkownikiem Party Pilot? <a routerLink="/auth/login">Zaloguj się</a></h4>
      <h4><a routerLink="/main/discover">Przejście dla personelu :)</a></h4>
    </section>
  `,
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    c_password: new FormControl('')
  });

  constructor(private router: Router) {
  }
  submitLogin() {
/*    this.service.functionInService(
      this.registerForm.value.email ?? '',
      this.registerForm.value.password ?? '',
      this.registerForm.value.c_password ?? ''
    );*/
    console.log('Zarejestrowano');
    this.router.navigate(['/main/discover']);
  }
}
