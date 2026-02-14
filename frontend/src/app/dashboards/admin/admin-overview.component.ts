import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <h2 class="mb-4 fw-bold text-dark">
        <i class="bi bi-speedometer2 me-2" style="color: #08457a;"></i>
        Vue d'ensemble
      </h2>

      <!-- Statistics Cards -->
      <div class="row g-4 mb-5">
        <!-- Total Users -->
        <div class="col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100 stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="icon-box rounded-circle p-3" style="background-color: #e3f2fd;">
                  <i class="bi bi-people-fill fs-4" style="color: #08457a;"></i>
                </div>
                <span class="badge bg-primary">Total</span>
              </div>
              <h3 class="fw-bold mb-1">{{ stats?.totalUsers || 0 }}</h3>
              <p class="text-muted small mb-0">Utilisateurs</p>
              <div class="mt-3 small">
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted">Passagers:</span>
                  <span class="fw-semibold">{{ stats?.usersByRole?.PASSENGER || 0 }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted">Conducteurs:</span>
                  <span class="fw-semibold">{{ stats?.usersByRole?.DRIVER || 0 }}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-muted">Admins:</span>
                  <span class="fw-semibold">{{ stats?.usersByRole?.ADMIN || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Rides -->
        <div class="col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100 stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="icon-box rounded-circle p-3" style="background-color: #fff3e0;">
                  <i class="bi bi-car-front-fill fs-4 text-warning"></i>
                </div>
                <span class="badge bg-warning">Trajets</span>
              </div>
              <h3 class="fw-bold mb-1">{{ stats?.totalTrajets || 0 }}</h3>
              <p class="text-muted small mb-0">Trajets publiés</p>
            </div>
          </div>
        </div>

        <!-- Total Reservations -->
        <div class="col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100 stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="icon-box rounded-circle p-3" style="background-color: #e8f5e9;">
                  <i class="bi bi-ticket-perforated-fill fs-4 text-success"></i>
                </div>
                <span class="badge bg-success">Réservations</span>
              </div>
              <h3 class="fw-bold mb-1">{{ stats?.totalReservations || 0 }}</h3>
              <p class="text-muted small mb-0">Réservations totales</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-md-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100 stat-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="icon-box rounded-circle p-3" style="background-color: #fce4ec;">
                  <i class="bi bi-lightning-fill fs-4 text-danger"></i>
                </div>
                <span class="badge bg-danger">Actions</span>
              </div>
              <h3 class="fw-bold mb-1">Rapide</h3>
              <p class="text-muted small mb-3">Accès direct</p>
              <div class="d-grid gap-2">
                <a routerLink="/admin/users" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-people me-1"></i> Utilisateurs
                </a>
                <a routerLink="/admin/rides" class="btn btn-sm btn-outline-warning">
                  <i class="bi bi-car-front me-1"></i> Trajets
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div class="row g-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom py-3">
              <h5 class="mb-0 fw-bold">
                <i class="bi bi-clock-history me-2" style="color: #08457a;"></i>
                Activité récente
              </h5>
            </div>
            <div class="card-body">
              <div class="text-center py-5 text-muted">
                <i class="bi bi-graph-up display-4 opacity-25"></i>
                <p class="mt-3">Les statistiques détaillées seront affichées ici</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }
    .icon-box {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AdminOverviewComponent implements OnInit {
  stats: any = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getStatistics().subscribe({
      next: (data) => {
        console.log('📊 Admin Stats received:', data);
        console.log('📊 usersByRole:', data?.usersByRole);
        this.stats = data;
      },
      error: (err) => console.error('❌ Error loading stats', err)
    });
  }
}
