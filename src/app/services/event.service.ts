import { Injectable } from '@angular/core';
import {AxiosService} from "./axios.service";
import {EventDetails} from "../models/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private axiosService: AxiosService) { }

  async loadEventDetails(eventId: string): Promise<EventDetails | null> {
    try {
      const response = await this.axiosService.request(
        "GET",
        "/events/" + eventId,
        {}
      );
      const eventDetails = response.data;
      if (eventDetails && eventDetails.comments) {
        eventDetails.comments = eventDetails.comments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt[0], comment.createdAt[1] - 1, comment.createdAt[2], comment.createdAt[3], comment.createdAt[4])
        }));
      }
      eventDetails.startTime = new Date(eventDetails.startTime[0], eventDetails.startTime[1] - 1, eventDetails.startTime[2], eventDetails.startTime[3], eventDetails.startTime[4]);
      eventDetails.endTime = new Date(eventDetails.endTime[0], eventDetails.endTime[1] - 1, eventDetails.endTime[2], eventDetails.endTime[3], eventDetails.endTime[4]);
      return eventDetails;
    } catch (error) {
      console.error('Error fetching event details: ', error)
      return null;
    }
  }
}
