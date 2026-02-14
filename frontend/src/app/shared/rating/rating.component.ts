import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from './rating.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow-sm p-4">
      <h5 class="fw-bold mb-3 d-flex align-items-center">
        <i class="bi bi-star-fill me-2 text-warning"></i> Évaluer le conducteur
      </h5>
      
      <p class="text-muted small mb-4">Votre avis aide la communauté RimUber à rester sûre et fiable.</p>

      <div class="rating-stars d-flex justify-content-center gap-2 mb-4">
        <i *ngFor="let s of [1,2,3,4,5]" 
           class="bi fs-1 cursor-pointer"
           [ngClass]="s <= score ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
           (click)="score = s"></i>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Commentaire (optionnel)</label>
        <textarea [(ngModel)]="comment" class="form-control rounded-3" rows="3" 
                  placeholder="Comment s'est passé le trajet ?"></textarea>
      </div>

      <div class="d-grid">
        <button class="btn btn-primary py-2 fw-bold" 
                style="background-color: #08457a; border: none;"
                [disabled]="score === 0 || loading"
                (click)="submitRating()">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
          Soumettre l'avis
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer { cursor: pointer; }
    .rating-stars i:hover { transform: scale(1.1); transition: transform 0.2s; }
  `]
})
export class RatingComponent {
  @Input() driverId!: number;
  @Input() passengerId!: number;
  @Input() trajetId!: number;
  @Output() rated = new EventEmitter<any>();

  score: number = 0;
  comment: string = '';
  loading: boolean = false;

  constructor(private ratingService: RatingService) { }

  submitRating(): void {
    this.loading = true;
    this.ratingService.rateDriver(this.driverId, this.passengerId, this.trajetId, this.score, this.comment).subscribe({
      next: (res) => {
        this.loading = false;
        this.rated.emit(res);
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Erreur', 'Erreur lors de la soumission de l\'avis.', 'error');
        console.error(err);
      }
    });
  }
}
