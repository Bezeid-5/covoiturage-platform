import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';

import { BackButtonComponent } from '../../shared/components/ui/back-button.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  template: `
    <div class="container mt-4">
      <app-back-button label="Retour au tableau de bord"></app-back-button>
      <h2 class="mb-4 fw-bold"><i class="bi bi-people me-2" style="color: #08457a;"></i> Gestion des utilisateurs</h2>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead style="background-color: #f8f9fa;">
                <tr>
                  <th class="px-4 py-3">ID</th>
                  <th class="py-3">Nom</th>
                  <th class="py-3">Email</th>
                  <th class="py-3">Rôle</th>
                  <th class="py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td class="px-4 py-3">#{{ user.id }}</td>
                  <td class="py-3">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-circle fs-4 me-2 text-muted"></i>
                      <span>{{ user.firstName }} {{ user.lastName }}</span>
                    </div>
                  </td>
                  <td class="py-3">{{ user.email }}</td>
                  <td class="py-3">
                    <span class="badge rounded-pill" 
                          [ngClass]="{'text-bg-primary': user.role === 'DRIVER', 
                                      'text-bg-success': user.role === 'PASSENGER', 
                                      'text-bg-danger': user.role === 'ADMIN'}">
                      {{ user.role === 'DRIVER' ? 'Conducteur' : user.role === 'PASSENGER' ? 'Passager' : 'Admin' }}
                    </span>
                  </td>
                  <td class="py-3 text-center">
                    <div class="btn-group btn-group-sm" role="group">
                      <button class="btn btn-outline-warning" (click)="openRoleModal(user)" title="Changer le rôle">
                        <i class="bi bi-arrow-left-right"></i>
                      </button>
                      <button class="btn btn-outline-danger" (click)="suspendUser(user.id)" title="Suspendre">
                        <i class="bi bi-ban"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Role Change Modal -->
      <div class="modal fade" [class.show]="showRoleModal" [style.display]="showRoleModal ? 'block' : 'none'" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Changer le rôle de {{ selectedUser?.firstName }}</h5>
              <button type="button" class="btn-close" (click)="closeRoleModal()"></button>
            </div>
            <div class="modal-body">
              <label class="form-label">Nouveau rôle</label>
              <select class="form-select" [(ngModel)]="newRole">
                <option value="PASSENGER">Passager</option>
                <option value="DRIVER">Conducteur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeRoleModal()">Annuler</button>
              <button type="button" class="btn" style="background-color: #08457a; color: white;" (click)="changeRole()">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade" [class.show]="showRoleModal" *ngIf="showRoleModal"></div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  showRoleModal = false;
  selectedUser: any = null;
  newRole: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  suspendUser(userId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment suspendre cet utilisateur ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, suspendre',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.suspendUser(userId).subscribe({
          next: () => {
            Swal.fire('Suspendu !', 'Utilisateur suspendu avec succès.', 'success');
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error suspending user:', err);
            Swal.fire('Erreur', 'Erreur lors de la suspension.', 'error');
          }
        });
      }
    });
  }

  openRoleModal(user: any): void {
    this.selectedUser = user;
    this.newRole = user.role;
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.selectedUser = null;
  }

  changeRole(): void {
    if (this.selectedUser && this.newRole) {
      this.adminService.changeUserRole(this.selectedUser.id, this.newRole).subscribe({
        next: () => {
          Swal.fire('Succès', 'Rôle modifié avec succès.', 'success');
          this.closeRoleModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error changing role:', err);
          Swal.fire('Erreur', 'Erreur lors du changement de rôle.', 'error');
        }
      });
    }
  }
}
