import { Routes } from '@angular/router';
import {DiscoverComponent} from "./components/discover/discover.component";
import {ObservedComponent} from "./components/observed/observed.component";
import {OrganiseComponent} from "./components/organise/organise.component";
import {ProfileComponent} from "./components/profile/profile.component";

export const routes: Routes = [
  { path: 'discover', component: DiscoverComponent },
  { path: 'observed', component: ObservedComponent },
  { path: 'organise', component: OrganiseComponent },
  { path: 'profile', component: ProfileComponent }
];
