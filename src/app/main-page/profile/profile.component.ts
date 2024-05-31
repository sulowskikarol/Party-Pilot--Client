import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AxiosService} from "../../services/axios.service";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  axiosService: AxiosService = inject(AxiosService);

  userIdFromPath: string | null = null;
  photoUrl: string | ArrayBuffer | null = null;
  selectedPhoto: File | null = null;
  photoError: string | null = null;
  canEdit: boolean = false;

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    profilePhotoPath: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  })

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
          this.userIdFromPath = params.get('id');
          if (this.userIdFromPath) {
              this.getUserData(this.userIdFromPath);
          }
          this.canEdit = this.authService.getUserId() === this.userIdFromPath;
          if (!this.canEdit) {
            this.profileForm.disable();
          } else {
            this.profileForm.enable();
          }
      })
  }

  async getUserData(userId: string): Promise<void> {
    const user = await this.userService.getUserData(userId);
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profilePhotoPath: user.profilePhotoPath,
        email: user.email,
      })
      this.photoUrl = await this.userService.getProfilePhoto(user.profilePhotoPath)
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const maxSize = 4 * 1024 * 1024; // 4MB

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
        "/users/" + this.userIdFromPath,
        formData
      ).then(response => {
        window.location.reload();
      })
    } else {
      console.error("Form is invalid");
    }
  }

  onCancel() {
    window.location.reload();
  }
}
