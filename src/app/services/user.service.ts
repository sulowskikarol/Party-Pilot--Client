import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {AxiosService} from "./axios.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private photoUrl: string = '';

  constructor(private axiosService: AxiosService, private authService: AuthService) {}

  async getUserData(userId: string): Promise<User | null> {
    try {
      const response = await this.axiosService.request(
        'GET',
        "/users/" + userId,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:',error);
      return null;
    }
  }

  async getProfilePhoto(fileName: string | undefined): Promise<string> {
    try {
      if (fileName) {
        this.photoUrl = await this.axiosService.getImage('/photos/', fileName);
      } else {
        this.photoUrl = 'assets/default_photo.png';
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
    return this.photoUrl;
  }
}
