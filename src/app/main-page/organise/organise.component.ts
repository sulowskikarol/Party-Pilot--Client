import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {AxiosService} from "../../services/axios.service";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-organise',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './organise.component.html',
  styleUrl: './organise.component.css'
})
export class OrganiseComponent {
  axiosService: AxiosService = inject(AxiosService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  eventForm = new FormGroup({
    event_name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    start_date: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
    start_time: new FormControl('19:00', Validators.required),
    end_date: new FormControl(new Date().toISOString().split('T')[0], Validators.required),
    end_time: new FormControl('23:59', Validators.required),
    location: new FormControl('', Validators.required),
    banner_path: new FormControl(''),
  }, {validators: [this.startDateTimeValidator, this.endDateTimeValidator.bind(this)]});

  selectedFile: File | null = null;
  bannerError: string | null = null;

  startDateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('start_date')?.value;
    const startTime = control.get('start_time')?.value;
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const currentDateTime = new Date();

    if (startDateTime <= currentDateTime) {
      return { startDateTimeInvalid: true};
    }
    return null;
  }

  endDateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('start_date')?.value;
    const startTime = control.get('start_time')?.value;
    const endDate = control.get('end_date')?.value;
    const endTime = control.get('end_time')?.value;
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const currentDateTime = new Date();

    if (endDateTime <= startDateTime || endDateTime < currentDateTime) {
      return { endDateTimeInvalid: true };
    }
    return null;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const maxSize = 25 * 1024 * 1024; // 25MB

      if (!file.type.startsWith('image/')) {
        this.bannerError = 'Wybrany plik musi być obrazem';
        this.selectedFile = null;
      } else if (file.size > maxSize) {
        this.bannerError = 'Przesłane zdjęcie nie może być większe niż 25MB';
        this.selectedFile = null;
      } else {
        this.selectedFile = file;
        this.eventForm.patchValue({
          banner_path: file.name
        });
        this.bannerError = null;
      }
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const startDate = this.eventForm.get('start_date')?.value;
      const startTime = this.eventForm.get('start_time')?.value;
      const endDate = this.eventForm.get('end_date')?.value;
      const endTime = this.eventForm.get('end_time')?.value;

      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      const startTimeArray = [
        startDateTime.getFullYear(),
        startDateTime.getMonth() + 1,
        startDateTime.getDate(),
        startDateTime.getHours(),
        startDateTime.getMinutes()
      ];

      const endTimeArray = [
        endDateTime.getFullYear(),
        endDateTime.getMonth() + 1,
        endDateTime.getDate(),
        endDateTime.getHours(),
        endDateTime.getMinutes()
      ];

      const bannerPath = this.eventForm.get('banner_path')?.value;


      const requestData = {
        eventName: this.eventForm.get('event_name')?.value,
        description: this.eventForm.get('description')?.value,
        startTime: startTimeArray,
        endTime: endTimeArray,
        location: this.eventForm.get('location')?.value,
        bannerPath: this.eventForm.get('banner_path')?.value || null,
        userId: this.authService.getUserId()
      };

      const formData = new FormData();
      formData.append('event', JSON.stringify(requestData));
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.axiosService.request(
        "POST",
        "/events",
        formData
      ).then(response => {
        this.router.navigate([`/main/event/${response.data.id}`]);
      });
    } else {
      console.log('Form is invalid')
    }
  }
}
