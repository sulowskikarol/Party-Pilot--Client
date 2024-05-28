import {Component, inject} from '@angular/core';
import {DatePipe, NgForOf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AxiosService} from "../../services/axios.service";
import {resolve} from "@angular/compiler-cli";

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink,
    DatePipe
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent {

  axiosService: AxiosService = inject(AxiosService);
  eventsFromDb: any[] = [];
  banners: { [key: string]: string } = {};

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    try {
      await this.axiosService.request(
        "GET",
        "/events",
        {}
      ).then(response => {
        this.eventsFromDb = response.data;
        this.loadBanners();
      })
    } catch (error) {
      console.error('Error fetching events: ', error);
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
