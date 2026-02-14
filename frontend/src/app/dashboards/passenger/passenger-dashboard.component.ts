import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-passenger-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex w-100 p-0 m-0">
      <!-- Sidebar -->
      <div class="sidebar d-none d-md-block bg-white border-end flex-shrink-0" style="width: 280px; height: calc(100vh - 70px); position: sticky; top: 70px; overflow-y: auto; z-index: 100;">
        <div class="p-4">
          <h5 class="fw-bold mb-4" style="color: #08457a;">
            <i class="bi bi-person-circle me-2"></i> Passager
          </h5>
          <div class="list-group list-group-flush">
            <a routerLink="/passenger" routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-grid-fill me-2"></i> Vue d'ensemble
            </a>
            <a routerLink="/passenger/search" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-search me-2"></i> Rechercher trajets
            </a>
            <a routerLink="/passenger/reservations" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-ticket-perforated me-2"></i> Mes réservations
            </a>
            <a routerLink="/passenger/messages" routerLinkActive="active" 
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
export class PassengerDashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Check if user is actually a passenger
    const role = this.authService.getUserRole();
    if (role !== 'PASSENGER') {
      this.authService.redirectToDashboard();
    }
  }
}
