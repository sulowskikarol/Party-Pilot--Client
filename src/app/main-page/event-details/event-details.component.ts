import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AxiosService} from "../../services/axios.service";
import {EventService} from "../../services/event.service";
import {EventDetails} from "../../models/event";

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    DatePipe,
    CommonModule
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  axiosService: AxiosService = inject(AxiosService);
  eventService: EventService = inject(EventService);

  eventDetails: EventDetails | null = null;
  userPhotos: {[key: string]: string} = {['default']: 'assets/default_banner.jpg'}
  bannerUrl: string | null = null;
  eventId: string | null = null;
  loading: boolean = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId) {
        this.loadEventDetails(this.eventId);
      }
    })
  }

  backToDiscover() {
    this.router.navigate(['/main/discover']);
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
      console.log(this.eventDetails)
    } catch(error) {
      console.error('Error loading event details', error);
    } finally {
      this.loading = false;
      this.loadProfilePhotos();
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
    } catch (error) {
      console.log('Error fetching banners: ', error);
    }
  }
}
