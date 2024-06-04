import {Injectable} from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    axios.defaults.baseURL = "http://localhost:8080"
    axios.defaults.headers.post["Content-Type"] = "application/json"
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null): void {
    if (token != null) {
      window.localStorage.setItem("auth_token", token);
    }
    else {
      window.localStorage.removeItem("auth_token");
    }
  }

  request(method: string, url: string, data: any): Promise<any> {
    let headers = {};

    if (this.getAuthToken() != null) {
      headers = {"Authorization": "Bearer " + this.getAuthToken()};
    }

    if (data instanceof FormData) {
      headers = { ...headers, "Content-Type": "multipart/form-data"};
    }

    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers
    });
  }

  async getImage(url: string, filename: string): Promise<string> {
    const response = await axios.get(url + filename, {
      responseType: 'blob',
      headers: {'Authorization': 'Bearer ' + this.getAuthToken()}
    });
    return URL.createObjectURL(response.data);
  }
}
