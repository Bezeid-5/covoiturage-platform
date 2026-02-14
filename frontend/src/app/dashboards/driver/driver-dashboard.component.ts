import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex w-100 p-0 m-0">
      <!-- Sidebar -->
      <div class="sidebar d-none d-md-block bg-white border-end flex-shrink-0" style="width: 280px; height: calc(100vh - 70px); position: sticky; top: 70px; overflow-y: auto; z-index: 100;">
        <div class="p-4">
          <h5 class="fw-bold mb-4" style="color: #08457a;">
            <i class="bi bi-speedometer2 me-2"></i> Tableau de bord
          </h5>
          <div class="list-group list-group-flush">
            <a routerLink="/driver" routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-grid-fill me-2"></i> Vue d'ensemble
            </a>
            <a routerLink="/driver/publish" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-plus-circle-fill me-2"></i> Publier un trajet
            </a>
            <a routerLink="/driver/my-rides" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-list-ul me-2"></i> Mes trajets
            </a>
            <a routerLink="/driver/reservations" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-people-fill me-2"></i> Réservations
            </a>
            <a routerLink="/driver/messages" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-chat-dots-fill me-2"></i> Messages
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-grow-1 bg-light" style="min-height: calc(100vh - 70px); overflow-x: hidden;">
        <div class="p-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-group-item {
      color: #555;
      font-weight: 500;
      transition: all 0.2s;
    }
    .list-group-item:hover {
      background-color: #f8f9fa;
      color: #08457a;
      transform: translateX(5px);
    }
    .list-group-item.active {
      background-color: #e3f2fd;
      color: #08457a;
      font-weight: 600;
      border-left: 4px solid #08457a;
    }
  `]
})
export class DriverDashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'DRIVER') {
      this.authService.redirectToDashboard();
    }
  }
}

