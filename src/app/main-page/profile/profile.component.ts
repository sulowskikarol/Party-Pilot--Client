import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AxiosService} from "../../services/axios.service";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  userService: UserService = inject(UserService);
  axiosService: AxiosService = inject(AxiosService);

  userId: string | null = null;
  user: User | null = null;

  photoUrl: string | ArrayBuffer | null = null;
  selectedPhoto: File | null = null;
  photoError: string | null = null;

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumber: new FormControl(''),
    profilePhotoPath: new FormControl('')
  })

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
          this.userId = params.get('id');
          if (this.userId) {
              this.getUserData(this.userId);
          }
      })
  }

  async getUserData(userId: string): Promise<void> {
    this.user = await this.userService.getUserData(userId);
    this.photoUrl = await this.userService.getProfilePhoto(this.user?.profilePhotoPath)
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const maxSize = 25 * 1024 * 1024; // 25MB

      if (!file.type.startsWith('image/')) {
        this.photoError = 'Wybrany plik musi być obrazem';
        this.selectedPhoto = null;
      } else if (file.size > maxSize) {
        this.photoError = 'Przesłane zdjęcie nie może być większe niż 25MB';
        this.selectedPhoto = null;
      } else {
        this.selectedPhoto = file;
        this.profileForm.patchValue({
          profilePhotoPath: file.name
        });
        this.photoError = null;

        const reader = new FileReader();
        reader.onload = () => {
          this.photoUrl = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      if (!this.selectedPhoto) {
        this.profileForm.patchValue({
          profilePhotoPath: this.user?.profilePhotoPath
        })
      }

      const requestData = {
        firstName: this.profileForm.get('firstName')?.value,
        lastName: this.profileForm.get('lastName')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value,
        profilePhotoPath : this.profileForm.get('profilePhotoPath')?.value
      }

      const formData = new FormData();
      formData.append('user', JSON.stringify(requestData));
      if (this.selectedPhoto) {
        formData.append('file', this.selectedPhoto);
      }

      this.axiosService.request(
        "PUT",
        "/users/" + this.userId,
        formData
      ).then(response => {
        window.location.reload();
      })
    } else {
      console.error("Form is invalid");
    }
  }
}
