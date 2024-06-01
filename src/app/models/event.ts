import {Comment} from "./comment";

export interface EventDetails {
  id: string,
  userId: string,
  eventName: string,
  startTime: Date,
  endTime: Date,
  description: string,
  location: string,
  bannerPath: string,
  comments: Comment[]
}
