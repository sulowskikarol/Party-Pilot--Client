import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <section>
      <h1>Zaloguj się na swoje konto</h1>
      <form [formGroup]="loginForm">
        <input id="email" type="text" formControlName="email" placeholder="Adres Email">
        <input id="password" type="password" formControlName="password" placeholder="Hasło">
        <button type="submit" class="login-button">Zaloguj</button>
      </form>
      <h4>Nie masz konta? <a routerLink="/auth/register">Zarejestruj się</a></h4>
    </section>
  `,
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
}
