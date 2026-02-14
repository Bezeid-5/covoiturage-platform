import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-driver-overview',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 hover-card">
          <div class="card-body p-4 text-center">
            <div class="icon-box rounded-circle p-3 mx-auto mb-3" style="background-color: #f3e5f5; width: fit-content;">
              <i class="bi bi-chat-dots fs-3" style="color: #7b1fa2;"></i>
            </div>
            <h5 class="mb-2 fw-bold">Messages</h5>
            <p class="text-muted small mb-3">Gérez vos conversations</p>
            <button class="btn btn-outline-primary w-100" style="border-color: #7b1fa2; color: #7b1fa2;">
              Voir mes messages
            </button>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 hover-card">
            <div class="card-body p-4 text-center">
                <div class="icon-box rounded-circle p-3 mx-auto mb-3" style="background-color: #e3f2fd; width: fit-content;">
                    <i class="bi bi-list-ul fs-3" style="color: #08457a;"></i>
                </div>
                <h5 class="mb-2 fw-bold">Mes Trajets</h5>
                <p class="text-muted small mb-3">Gérez vos publications</p>
                <a routerLink="my-rides" class="btn w-100" style="background-color: #08457a; color: white;">
                    Consulter
                </a>
            </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 hover-card">
            <div class="card-body p-4 text-center">
                <div class="icon-box rounded-circle p-3 mx-auto mb-3" style="background-color: #fff3e0; width: fit-content;">
                    <i class="bi bi-people fs-3" style="color: #f57c00;"></i>
                </div>
                <h5 class="mb-2 fw-bold">Réservations</h5>
                <p class="text-muted small mb-3">Demandes reçues</p>
                <a routerLink="reservations" class="btn btn-outline-warning w-100 text-dark">
                    Gérer
                </a>
            </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .hover-card {
      transition: transform 0.2s;
    }
    .hover-card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class DriverOverviewComponent { }
