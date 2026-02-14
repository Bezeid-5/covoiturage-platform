import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RideService, Trajet } from '../../core/services/ride.service';
import { Router } from '@angular/router';

import { BackButtonComponent } from '../../shared/components/ui/back-button.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publish-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publish-ride.component.html',
  styleUrl: './publish-ride.component.scss'
})
export class PublishRideComponent {
  publishForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rideService: RideService,
    private router: Router
  ) {
    this.publishForm = this.fb.group({
      departureCity: ['', Validators.required],
      arrivalCity: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      totalSeats: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.publishForm.valid) {
      const rideData: Trajet = this.publishForm.value;
      // Combine date and time if needed by backend or keep separate. 
      // Backend expects: date (LocalDate), time (LocalTime). Angular inputs return strings which usually work fine with JSON serialization.

      this.rideService.createRide(rideData).subscribe({
        next: (newRide) => {
          console.log('Ride published', newRide);
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Votre trajet a été publié avec succès',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/driver/my-rides']);
          });
        },
        error: (err) => {
          console.error('Error publishing ride', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de publier le trajet. Veuillez réessayer.',
          });
        }
      });
    }
  }
}
