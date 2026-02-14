import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriverService } from '../driver.service';

import { RideService } from '../../core/services/ride.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-rides',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold"><i class="bi bi-list-ul me-2" style="color: #08457a;"></i> Mes trajets publiés</h2>
        <a routerLink="/rides/publish" class="btn rounded-pill" style="background-color: #08457a; color: white;">
          <i class="bi bi-plus-lg me-1"></i> Publier un nouveau trajet
        </a>
      </div>

      <div class="row g-4" *ngIf="rides.length > 0">
        <div class="col-md-6 col-lg-4" *ngFor="let ride of rides">
          <div class="card h-100 shadow-sm border-0 hover-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge rounded-pill px-3 py-2" style="background-color: #e3f2fd; color: #08457a;">
                  {{ ride.date | date:'d MMM' }} • {{ ride.time }}
                </span>
                <h4 class="mb-0 fw-bold" style="color: #08457a;">{{ ride.price }} MRU</h4>
              </div>

              <h5 class="card-title mb-3 d-flex align-items-center">
                <span class="text-truncate" style="max-width: 45%;">{{ ride.departureCity }}</span>
                <i class="bi bi-arrow-right mx-2 text-muted"></i>
                <span class="text-truncate" style="max-width: 45%;">{{ ride.arrivalCity }}</span>
              </h5>

              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted">Places disponibles</small>
                  <small class="fw-bold">{{ ride.availableSeats }} / {{ ride.totalSeats }}</small>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" [style.width.%]="(ride.availableSeats / ride.totalSeats) * 100" 
                       [ngClass]="{'bg-success': ride.availableSeats > 0, 'bg-danger': ride.availableSeats === 0}"></div>
                </div>
              </div>

              <div class="d-flex gap-2 mt-3 pt-3 border-top">
                <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="openRideDetails(ride)">
                  <i class="bi bi-eye me-1"></i> Voir
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteRide(ride.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-5" *ngIf="rides.length === 0">
        <i class="bi bi-car-front display-1 text-muted opacity-25"></i>
        <h4 class="mt-3 text-dark">Aucun trajet publié</h4>
        <p class="text-muted mb-4">Vous n'avez pas encore publié de trajet.</p>
        <a routerLink="/rides/publish" class="btn" style="background-color: #08457a; color: white;">
          Publier mon premier trajet
        </a>
      </div>

      <!-- Detail Modal Overlay -->
      <div class="modal fade" [class.show]="selectedRide" [style.display]="selectedRide ? 'block' : 'none'" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header border-0 bg-light rounded-top-4">
              <h5 class="modal-title fw-bold" style="color: #08457a;">
                <i class="bi bi-info-circle me-2"></i> Détails du trajet
              </h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body p-4" *ngIf="selectedRide">
              <div class="row mb-4 align-items-center text-center">
                  <div class="col-5">
                      <h4 class="fw-bold text-primary">{{ selectedRide.departureCity }}</h4>
                  </div>
                  <div class="col-2">
                      <i class="bi bi-arrow-right fs-4 text-muted"></i>
                  </div>
                  <div class="col-5">
                      <h4 class="fw-bold text-primary">{{ selectedRide.arrivalCity }}</h4>
                  </div>
              </div>

              <div class="row g-3">
                  <div class="col-md-6">
                      <div class="p-3 bg-light rounded-3">
                          <small class="text-muted d-block">Départ</small>
                          <div class="fw-bold"><i class="bi bi-calendar3 me-2"></i> {{ selectedRide.date | date:'fullDate' }}</div>
                          <div class="fw-bold"><i class="bi bi-clock me-2"></i> {{ selectedRide.time }}</div>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="p-3 bg-light rounded-3">
                          <small class="text-muted d-block">Info</small>
                          <div class="fw-bold"><i class="bi bi-cash me-2"></i> {{ selectedRide.price }} MRU / place</div>
                          <div class="fw-bold"><i class="bi bi-people me-2"></i> {{ selectedRide.availableSeats }} / {{ selectedRide.totalSeats }} places</div>
                      </div>
                  </div>
                  <div class="col-12" *ngIf="selectedRide.description">
                      <div class="p-3 bg-light rounded-3">
                          <small class="text-muted d-block">Description</small>
                          <p class="mb-0 fst-italic">"{{ selectedRide.description }}"</p>
                      </div>
                  </div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card { transition: transform 0.2s; }
    .hover-card:hover { transform: translateY(-5px); }
  `]
})
export class MyRidesComponent implements OnInit {
  rides: any[] = [];
  selectedRide: any = null;

  constructor(
    private driverService: DriverService,
    private rideService: RideService
  ) { }

  ngOnInit(): void {
    this.loadMyRides();
  }

  loadMyRides(): void {
    this.driverService.getMyPublishedRides().subscribe({
      next: (data) => {
        this.rides = data;
      },
      error: (err) => {
        console.error('Error loading rides:', err);
      }
    });
  }

  deleteRide(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rideService.deleteRide(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'Votre trajet a été supprimé.',
              'success'
            );
            this.loadMyRides(); // Refresh list
          },
          error: (err) => {
            console.error('Error deleting ride:', err);
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          }
        });
      }
    });
  }

  openRideDetails(ride: any): void {
    this.selectedRide = ride;
  }

  closeModal(): void {
    this.selectedRide = null;
  }
}
