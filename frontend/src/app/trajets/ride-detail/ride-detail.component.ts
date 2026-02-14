import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RideService, Trajet } from '../../core/services/ride.service';
import { AuthService } from '../../core/auth/auth.service';
import { ReservationService } from '../../core/services/reservation.service';
import { MessagingComponent } from '../../shared/messaging/messaging.component';
import { BackButtonComponent } from '../../shared/components/ui/back-button.component';
import { RatingService } from '../../shared/rating/rating.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ride-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MessagingComponent, BackButtonComponent],
  templateUrl: './ride-detail.component.html',
  styleUrl: './ride-detail.component.scss'
})
export class RideDetailComponent implements OnInit {
  ride: Trajet | undefined;
  isDriver: boolean = false;
  showChat: boolean = false;
  currentUserId: number | null = null;
  averageRating: number = 0;
  totalRatings: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rideService: RideService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private ratingService: RatingService
  ) { }

  bookRide(): void {
    if (this.ride && this.ride.id) {
      Swal.fire({
        title: 'Réserver ce trajet',
        text: 'Combien de places souhaitez-vous réserver ?',
        input: 'number',
        inputAttributes: {
          min: '1',
          max: this.ride.availableSeats!.toString(),
          step: '1'
        },
        inputValue: 1,
        showCancelButton: true,
        confirmButtonText: 'Réserver',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33',
        inputValidator: (value) => {
          if (!value || Number(value) < 1) {
            return 'Vous devez réserver au moins une place !';
          }
          if (Number(value) > this.ride!.availableSeats!) {
            return 'Pas assez de places disponibles !';
          }
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const seats = Number(result.value);
          this.reservationService.bookRide({ trajetId: this.ride!.id!, seats: seats }).subscribe({
            next: () => {
              Swal.fire({
                title: 'Succès !',
                text: 'Votre réservation a été confirmée.',
                icon: 'success',
                confirmButtonColor: '#08457a'
              }).then(() => {
                this.router.navigate(['/passenger/reservations']);
              });
            },
            error: (err) => {
              console.error('Error booking ride', err);
              Swal.fire('Erreur', 'La réservation a échoué.', 'error');
            }
          });
        }
      });
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const user = this.authService.getUser();
    if (user) {
      this.currentUserId = user.userId;
    }

    if (id) {
      this.rideService.getRideById(id).subscribe({
        next: (data) => {
          this.ride = data;
          if (user && this.ride?.driverEmail) {
            this.isDriver = (user.sub === this.ride.driverEmail);
          } else {
            this.isDriver = false;
          }

          if (this.ride?.driverId) {
            this.loadDriverStats(this.ride.driverId);
          }
        },
        error: (err) => console.error('Error loading ride', err)
      });
    }
  }

  loadDriverStats(driverId: number): void {
    this.ratingService.getDriverStats(driverId).subscribe({
      next: (stats) => {
        this.averageRating = stats.averageRating || 0;
        this.totalRatings = stats.totalRatings || 0;
      },
      error: (err) => console.error('Error loading stats', err)
    });
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  closeChat = (): void => {
    this.showChat = false;
  }

  deleteRide(): void {
    if (this.ride && this.ride.id) {
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Voulez-vous vraiment supprimer ce trajet ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rideService.deleteRide(this.ride!.id!).subscribe({
            next: () => {
              Swal.fire(
                'Supprimé !',
                'Le trajet a été supprimé.',
                'success'
              );
              this.router.navigate(['/rides']);
            },
            error: (err) => {
              console.error('Error deleting ride', err);
              Swal.fire('Erreur', 'Impossible de supprimer le trajet.', 'error');
            }
          });
        }
      });
    }
  }
}
