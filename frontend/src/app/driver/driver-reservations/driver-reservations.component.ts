import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriverService } from '../driver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-driver-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2 class="mb-4 fw-bold"><i class="bi bi-people me-2" style="color: #08457a;"></i> Réservations reçues</h2>

      <div class="row g-4" *ngIf="reservations.length > 0">
        <div class="col-lg-6" *ngFor="let res of reservations">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge rounded-pill" 
                      [ngClass]="{'text-bg-success': res.status === 'CONFIRMED', 
                                  'text-bg-warning': res.status === 'PENDING', 
                                  'text-bg-danger': res.status === 'CANCELLED'}">
                  <i class="bi" [ngClass]="{'bi-check-circle': res.status === 'CONFIRMED', 
                                            'bi-hourglass-split': res.status === 'PENDING', 
                                            'bi-x-circle': res.status === 'CANCELLED'}"></i>
                  {{ res.status === 'CONFIRMED' ? 'Confirmée' : res.status === 'PENDING' ? 'En attente' : 'Annulée' }}
                </span>
                <div class="text-end">
                  <h5 class="fw-bold mb-0" style="color: #08457a;">{{ res.price * res.seats }} MRU</h5>
                  <small class="text-muted">{{ res.seats }} place(s)</small>
                </div>
              </div>

              <h5 class="card-title d-flex align-items-center mb-3">
                <span class="fw-bold">{{ res.departureCity }}</span>
                <i class="bi bi-arrow-right mx-3 text-muted"></i>
                <span class="fw-bold">{{ res.arrivalCity }}</span>
              </h5>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <div class="d-flex align-items-center text-muted">
                    <i class="bi bi-calendar3 me-2" style="color: #08457a;"></i>
                    <span>{{ res.date }}</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center text-muted">
                    <i class="bi bi-clock me-2" style="color: #08457a;"></i>
                    <span>{{ res.time }}</span>
                  </div>
                </div>
                <div class="col-12 mt-2">
                  <div class="p-3 bg-light rounded-3">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-circle fs-4 me-2" style="color: #08457a;"></i>
                      <div>
                        <div class="fw-bold">{{ res.passengerName }}</div>
                        <small class="text-muted">Passager</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-5" *ngIf="reservations.length === 0">
        <i class="bi bi-people display-1 text-muted opacity-25"></i>
        <h4 class="mt-3 text-dark">Aucune réservation</h4>
        <p class="text-muted">Vous n'avez pas encore reçu de réservations sur vos trajets.</p>
      </div>
    </div>
  `
})
export class DriverReservationsComponent implements OnInit {
  reservations: any[] = [];

  constructor(private driverService: DriverService) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.driverService.getReceivedReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les réservations. Veuillez réessayer plus tard.',
          confirmButtonColor: '#08457a'
        });
      }
    });
  }
}
