import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AxiosService} from "../axios.service";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
    <main>
      <section class="content">
        <img src="../../assets/logo.png">
      </section>
      <section class="form">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrl: './auth.component.css'
})
export class AuthComponent {
}
