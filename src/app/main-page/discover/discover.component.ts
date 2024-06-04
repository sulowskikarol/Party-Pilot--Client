import {Component, inject} from '@angular/core';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AxiosService} from "../../services/axios.service";

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink,
    DatePipe,
    NgIf
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent {

  axiosService: AxiosService = inject(AxiosService);
  eventsFromDb: any[] = [];
  banners: { [key: string]: string } = {};
  loading: boolean = true;

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    this.loading = true;
    try {
      const response = await this.axiosService.request(
        "GET",
        "/events/current",
        {}
      )
      this.eventsFromDb = response.data.map((ev: any) => {
        return {
          ...ev,
          startTime: new Date(ev.startTime[0], ev.startTime[1] - 1, ev.startTime[2], ev.startTime[3], ev.startTime[4])
        };
      });
    } catch (error) {
      console.error('Error fetching events: ', error);
    } finally {
      await this.loadBanners();
      this.loading = false;
    }
  }

  async loadBanners() {
    try {
      for (const event of this.eventsFromDb) {
        if (event.bannerPath) {
          this.banners[event.id] = await this.axiosService.getImage('/banners/', event.bannerPath);
        } else {
          this.banners[event.id] = 'assets/default_banner.jpg'
        }
      }
    } catch (error) {
      console.log('Error fetching banners: ', error);
    }
  }
}
