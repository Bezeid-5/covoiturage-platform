import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService, Reservation } from '../../core/services/reservation.service';
import { RatingComponent } from '../../shared/rating/rating.component';
import { AuthService } from '../../core/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  showRatingModal: boolean = false;
  selectedReservation: any = null;
  currentUserId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadReservations();
    const user = this.authService.getUser();
    if (user) {
      this.currentUserId = user.userId;
    }
  }

  loadReservations(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Error loading reservations', err)
    });
  }

  openRating(res: any): void {
    this.selectedReservation = res;
    this.showRatingModal = true;
  }

  closeRating(): void {
    this.showRatingModal = false;
    this.selectedReservation = null;
  }

  onRated(rating: any): void {
    Swal.fire({
      icon: 'success',
      title: 'Merci !',
      text: 'Merci pour votre avis !',
      confirmButtonColor: '#08457a'
    });
    this.closeRating();
  }

  isRideFinished(dateStr: string): boolean {
    const rideDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return rideDate < today;
  }

  cancelReservation(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment annuler cette réservation ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.cancelReservation(id).subscribe({
          next: () => {
            Swal.fire('Annulée !', 'Votre réservation a été annulée.', 'success');
            this.loadReservations(); // Reload list
          },
          error: (err) => {
            console.error('Error cancelling reservation', err);
            Swal.fire('Erreur', 'Impossible d\'annuler la réservation.', 'error');
          }
        });
      }
    });
  }
}
