import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {Registration} from "../../models/registration";
import {NgClass, NgForOf} from "@angular/common";
import {AxiosService} from "../../services/axios.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-join-request-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgForOf, NgClass, RouterLink],
  template: `
    <h1 mat-dialog-title>Prośby o dołączenie do wydarzenia</h1>
    <div mat-dialog-content>
      <ul class="list-unstyled">
        <li class="d-flex align-items-center justify-content-between mb-2" *ngFor="let registration of data.registrations">
          <div class="d-flex align-items-center">
            <button mat-button [routerLink]="['/main/profile', registration.userId]" class="d-flex align-items-center p-0 border-0 bg-transparent">
              <img [src]="data.userPhotos[registration.userPhotoPath]" class="img-fluid rounded-circle registration-photo me-2">
              <span>{{ registration.userFirstName }} {{ registration.userLastName }}</span>
            </button>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-success me-2" [ngClass]="{ 'active': registration.status === 'CONFIRMED' }" (click)="approveRequest(registration)">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn btn-outline-danger" [ngClass]="{ 'active': registration.status === 'CANCELED' }" (click)="rejectRequest(registration)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Zamknij</button>
    </div>

  `,
  styleUrl: './join-request-dialog.component.css'
})
export class JoinRequestsDialogComponent {
  private axiosService: AxiosService = inject(AxiosService);
  constructor(
    public dialogRef: MatDialogRef<JoinRequestsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { registrations: Registration[], userPhotos: {[key: string]: string} }
  ) {}

  onNoClick() {
    window.location.reload();
    this.dialogRef.close();
  }

  approveRequest(registration: Registration) {
    this.axiosService.request(
      "PUT",
      "/registrations/" + registration.id + "/confirm",
      {}
    ).then(() => {
      registration.status = "CONFIRMED";
    }).catch((error) => {
      console.error('Error changing registration status:', error);
    });
  }

  rejectRequest(registration: Registration) {
    this.axiosService.request(
      "PUT",
      "/registrations/" + registration.id + "/cancel",
      {}
    ).then(() => {
      registration.status = "CANCELED";
    }).catch((error) => {
      console.error('Error changing registration status:', error);
    });
  }
}
