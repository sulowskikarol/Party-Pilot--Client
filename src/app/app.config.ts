import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {JoinRequestsDialogComponent} from "./main-page/join-request-dialog/join-request-dialog.component";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
