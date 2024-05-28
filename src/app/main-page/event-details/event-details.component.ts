import {Component, inject} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AxiosService} from "../../services/axios.service";

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  axiosService: AxiosService = inject(AxiosService);
  eventDetails: any = null;
  bannerUrl: string | null = null;
  eventId: string | null = null;

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
    try {
      await this.axiosService.request(
        "GET",
        "/events/" + eventId,
        {}
      ).then((response) => {
          this.eventDetails = response.data;
          this.eventDetails.startTime = new Date(response.data.startTime);
        });
      if (this.eventDetails.bannerPath) {
        this.bannerUrl = await this.axiosService.getImage(
          '/banners/',
          this.eventDetails.bannerPath
        );
      } else {
        this.bannerUrl = 'assets/default_banner.jpg'
      }
    } catch (error) {
      console.error('Error fetching event details or banner: ', error)
    }
  }
}
