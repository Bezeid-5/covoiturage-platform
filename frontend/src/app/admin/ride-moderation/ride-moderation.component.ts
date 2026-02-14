import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';

import { BackButtonComponent } from '../../shared/components/ui/back-button.component';

@Component({
  selector: 'app-ride-moderation',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="container mt-4">
      <app-back-button label="Retour au tableau de bord"></app-back-button>
      <h2 class="mb-4 fw-bold"><i class="bi bi-car-front me-2" style="color: #08457a;"></i> Modération des trajets</h2>

      <div class="row g-4" *ngIf="rides.length > 0">
        <div class="col-lg-6" *ngFor="let ride of rides">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge rounded-pill px-3 py-2" style="background-color: #e3f2fd; color: #08457a;">
                  {{ ride.date }} • {{ ride.time }}
                </span>
                <h4 class="mb-0 fw-bold" style="color: #08457a;">{{ ride.price }} MRU</h4>
              </div>

              <h5 class="card-title d-flex align-items-center mb-3">
                <span class="fw-bold">{{ ride.departureCity }}</span>
                <i class="bi bi-arrow-right mx-3 text-muted"></i>
                <span class="fw-bold">{{ ride.arrivalCity }}</span>
              </h5>

              <div class="mb-3">
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-person-circle me-2" style="color: #08457a;"></i>
                  <span class="fw-bold">{{ ride.driverName }}</span>
                </div>
                <div class="d-flex align-items-center text-muted">
                  <i class="bi bi-envelope me-2"></i>
                  <span>{{ ride.driverEmail }}</span>
                </div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <div class="p-2 bg-light rounded text-center">
                    <div class="text-muted small">Places totales</div>
                    <div class="fw-bold">{{ ride.totalSeats }}</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 bg-light rounded text-center">
                    <div class="text-muted small">Disponibles</div>
                    <div class="fw-bold text-success">{{ ride.availableSeats }}</div>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2 pt-3 border-top">
                <button class="btn btn-danger flex-grow-1" (click)="deleteRide(ride.id)">
                  <i class="bi bi-trash me-1"></i> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center py-5" *ngIf="rides.length === 0">
        <i class="bi bi-car-front display-1 text-muted opacity-25"></i>
        <h4 class="mt-3 text-dark">Aucun trajet</h4>
        <p class="text-muted">Aucun trajet à modérer pour le moment.</p>
      </div>
    </div>
  `
})
export class RideModerationComponent implements OnInit {
  rides: any[] = [];

  constructor(
    private http: HttpClient,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.http.get<any[]>(`${environment.apiUrl}/trajets`).subscribe({
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
      text: "Voulez-vous vraiment supprimer ce trajet ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteRide(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'Le trajet a été supprimé.',
              'success'
            );
            this.loadRides();
          },
          error: (err) => {
            console.error('Error deleting ride:', err);
            Swal.fire(
              'Erreur',
              'Erreur lors de la suppression.',
              'error'
            );
          }
        });
      }
    });
  }
}
