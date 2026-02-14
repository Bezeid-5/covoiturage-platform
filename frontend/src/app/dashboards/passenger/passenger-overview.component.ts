import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-passenger-overview',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 hover-card">
          <div class="card-body p-4 text-center">
            <div class="icon-box rounded-circle p-3 mx-auto mb-3" style="background-color: #e3f2fd; width: fit-content;">
              <i class="bi bi-search fs-3" style="color: #08457a;"></i>
            </div>
            <h5 class="mb-2 fw-bold">Rechercher</h5>
            <p class="text-muted small mb-3">Trouvez votre prochain trajet</p>
            <a routerLink="search" class="btn w-100" style="background-color: #08457a; color: white;">
              Rechercher un trajet
            </a>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 hover-card">
            <div class="card-body p-4 text-center">
                <div class="icon-box rounded-circle p-3 mx-auto mb-3" style="background-color: #fff3e0; width: fit-content;">
                    <i class="bi bi-ticket-perforated fs-3" style="color: #f57c00;"></i>
                </div>
                <h5 class="mb-2 fw-bold">Mes Réservations</h5>
                <p class="text-muted small mb-3">Consultez vos voyages</p>
                <a routerLink="reservations" class="btn btn-outline-warning w-100 text-dark">
                    Voir mes réservations
                </a>
            </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100 hover-card">
            <div class="card-body p-4 text-center">
                <div class="icon-box rounded-circle p-3 mx-auto mb-3" style="background-color: #f3e5f5; width: fit-content;">
                    <i class="bi bi-chat-dots fs-3" style="color: #7b1fa2;"></i>
                </div>
                <h5 class="mb-2 fw-bold">Messages</h5>
                <p class="text-muted small mb-3">Discutez avec les conducteurs</p>
                <button class="btn btn-outline-primary w-100" style="border-color: #7b1fa2; color: #7b1fa2;">
                    Mes conversations
                </button>
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
export class PassengerOverviewComponent { }
