import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="d-flex" style="min-height: 90vh;">
      <!-- Sidebar -->
      <div class="d-none d-md-block bg-white border-end" style="width: 280px; min-height: 100%;">
        <div class="p-4">
          <h5 class="fw-bold mb-4" style="color: #08457a;">
            <i class="bi bi-shield-lock-fill me-2"></i> Administration
          </h5>
          <div class="list-group list-group-flush">
            <a routerLink="/admin/dashboard" routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: true}"
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-speedometer2 me-2"></i> Vue d'ensemble
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-people me-2"></i> Utilisateurs
            </a>
            <a routerLink="/admin/rides" routerLinkActive="active" 
               class="list-group-item list-group-item-action border-0 rounded-3 mb-2 px-3 py-2">
              <i class="bi bi-car-front me-2"></i> Tous les trajets
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-grow-1 bg-light">
        <div class="p-4">
          <h2 class="mb-4 fw-bold text-dark">Tableau de bord</h2>
          
          <div class="row g-4">
            <!-- Stats Cards, could be added here later -->
            
            <div class="col-md-6">
              <div class="card border-0 shadow-sm h-100 hover-card">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center mb-4">
                    <div class="icon-box rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" 
                         style="background-color: #e3f2fd; width: 60px; height: 60px;">
                      <i class="bi bi-people fs-3" style="color: #08457a;"></i>
                    </div>
                    <div>
                      <h5 class="mb-1 fw-bold">Utilisateurs</h5>
                      <p class="text-muted small mb-0">Gestion des comptes</p>
                    </div>
                  </div>
                  <a routerLink="/admin/users" class="btn w-100 py-2 fw-medium" 
                     style="background-color: #08457a; color: white;">
                    Gérer les utilisateurs
                  </a>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card border-0 shadow-sm h-100 hover-card">
                <div class="card-body p-4">
                  <div class="d-flex align-items-center mb-4">
                    <div class="icon-box rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" 
                         style="background-color: #fff3e0; width: 60px; height: 60px;">
                      <i class="bi bi-shield-check fs-3 text-warning"></i>
                    </div>
                    <div>
                      <h5 class="mb-1 fw-bold">Modération</h5>
                      <p class="text-muted small mb-0">Validation des trajets</p>
                    </div>
                  </div>
                  <a routerLink="/admin/rides" class="btn btn-outline-warning w-100 py-2 fw-medium">
                    Accéder à la modération
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-group-item {
      color: #6c757d;
      transition: all 0.2s;
    }
    .list-group-item:hover {
      background-color: #f8f9fa;
      color: #08457a;
    }
    .list-group-item.active {
      background-color: #e3f2fd;
      color: #08457a;
      font-weight: 600;
    }
    .hover-card {
      transition: transform 0.2s box-shadow 0.2s;
    }
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ADMIN') {
      this.authService.redirectToDashboard();
    }
  }
}
