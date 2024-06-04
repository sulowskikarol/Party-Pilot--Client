import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AxiosService} from "../../services/axios.service";
import {EventService} from "../../services/event.service";
import {EventDetails} from "../../models/event";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Registration} from "../../models/registration";
import {MatDialog} from "@angular/material/dialog";
import {JoinRequestsDialogComponent} from "../join-request-dialog/join-request-dialog.component";
import {MatButton} from "@angular/material/button";
import {User} from "../../models/user";

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule,
    FormsModule,
    RouterLink,
    MatButton
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  axiosService: AxiosService = inject(AxiosService);
  authService: AuthService = inject(AuthService);
  eventService: EventService = inject(EventService);
  dialog: MatDialog = inject(MatDialog);

  eventDetails: EventDetails | null = null;
  organizerDetails: any;
  userPhotos: {[key: string]: string} = {['default']: 'assets/default_photo.png'}
  bannerUrl: string | null = null;
  eventId: string | null = null;
  loading: boolean = true;
  commentContent: any;
  userAuthorization: { registered: boolean, organizer: boolean, approved: boolean } = {registered: false, approved: false, organizer: false};
  confirmedRegistrations: Registration[] = [];
  registrations: Registration[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId) {
        this.loadEventDetails(this.eventId);
      }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JoinRequestsDialogComponent, {
      width: '500px',
      data: { registrations: this.registrations, userPhotos: this.userPhotos },
    });
  }

  async loadEventDetails(eventId: string) {
    this.loading = true;
    try {
      this.eventDetails = await this.eventService.loadEventDetails(eventId);
      if (this.eventDetails?.bannerPath) {
        this.bannerUrl = await this.axiosService.getImage(
          '/banners/',
          this.eventDetails.bannerPath
        );
      } else {
        this.bannerUrl = 'assets/default_banner.jpg'
      }

      const organizerResponse = await this.axiosService.request(
        "GET",
        "/users/" + this.eventDetails?.userId,
        {}
      )
      this.organizerDetails = organizerResponse.data;
    } catch(error) {
      console.error('Error loading event details', error);
    } finally {
      await this.loadUserPermissions();
      await this.loadRegistrations();
      await this.loadProfilePhotos();
      this.loading = false;
    }
  }

  async loadProfilePhotos() {
    try {
      if (this.eventDetails?.comments) {
        for (const comment of this.eventDetails.comments) {
          if (comment.userPhoto && !this.userPhotos[comment.userPhoto]) {
            this.userPhotos[comment.userPhoto] = await this.axiosService.getImage('/photos/', comment.userPhoto);
          } else if (!comment.userPhoto) {
            comment.userPhoto = 'default';
          }
        }
      }
      if (this.registrations) {
        for (const registration of this.registrations) {
          if (registration.userPhotoPath && !this.userPhotos[registration.userPhotoPath]) {
            this.userPhotos[registration.userPhotoPath] = await this.axiosService.getImage('/photos/', registration.userPhotoPath);
          } else if (!registration.userPhotoPath) {
            registration.userPhotoPath = 'default';
          }
        }
      }
      if (this.confirmedRegistrations) {
        for (const registration of this.confirmedRegistrations) {
          if (registration.userPhotoPath && !this.userPhotos[registration.userPhotoPath]) {
            this.userPhotos[registration.userPhotoPath] = await this.axiosService.getImage('/photos/', registration.userPhotoPath);
          } else if (!registration.userPhotoPath) {
            registration.userPhotoPath = 'default';
          }
        }
      }
      if (this.organizerDetails.profilePhotoPath && !this.userPhotos[this.organizerDetails.profilePhotoPath]) {
        this.userPhotos[this.organizerDetails.profilePhotoPath] = await this.axiosService.getImage('/photos/', this.organizerDetails.profilePhotoPath);
      } else if (!this.organizerDetails.profilePhotoPath) {
        this.organizerDetails.profilePhotoPath = 'default';
      }
    } catch (error) {
      console.log('Error fetching profile photos: ', error);
    }
  }

  async loadUserPermissions() {
    try {
      const response = await this.axiosService.request(
        "GET",
        "/registrations/" + this.eventId + "/check-authorization",
        {}
      )
      this.userAuthorization = response.data;
      if (this.userAuthorization.organizer) {
        this.userAuthorization.registered = true;
        this.userAuthorization.approved = true;
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  }

  async loadRegistrations() {
    try {
      const response = await this.axiosService.request(
        "GET",
        "/registrations/" + this.eventId + "/confirmed",
        {}
      )
      this.confirmedRegistrations = response.data;

      if (this.userAuthorization.organizer) {
        const response = await this.axiosService.request(
          "GET",
          "/registrations/" + this.eventId,
          {}
        )
        this.registrations = response.data;
      }
    } catch (error) {
      console.error('Error fetching event registrations:', error);
    }
  }

  addComment() {
    if (this.commentContent) {
      const currentDate = new Date();
      const newComment = {
        commentContent: this.commentContent,
        user_id: this.authService.getUserId(),
        event_id: this.eventId,
        createdAt: [
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate(),
          currentDate.getHours(),
          currentDate.getMinutes()
        ]
      }
      this.axiosService.request(
        "POST",
        "/comments",
        newComment
      ).then (() => {
        window.location.reload();
      });
    } else {
      console.error('Comment can not be empty');
    }
  }

  deleteComment(id: string) {
    this.axiosService.request(
      "DELETE",
      "/comments/" + id,
      {}
    ).then (() => {
      window.location.reload();
    });
  }

  registerOnEvent() {
    try {
      this.axiosService.request(
        "POST",
        "/registrations",
        { eventId: this.eventId }
      ).then (() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error during registering user on event:', error);
    }
  }

  cancelRegistration() {
    try {
      this.axiosService.request(
        "DELETE",
        "registrations/" + this.eventId,
        {}
      ).then (() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error during canceling user registration on event:', error)
    }
  }

  cancelEvent() {
    try {
      this.axiosService.request(
        "DELETE",
        "/events/" + this.eventId,
        {}
      ).then(() => {
        this.router.navigate(["/main/discover"]);
      })
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
}
