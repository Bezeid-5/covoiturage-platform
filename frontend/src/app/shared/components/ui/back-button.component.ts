import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
    selector: 'app-back-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button (click)="goBack()" class="btn btn-link text-decoration-none p-0 d-flex align-items-center mb-3 back-btn">
      <div class="icon-circle me-2">
        <i class="bi bi-arrow-left"></i>
      </div>
      <span class="fw-bold">{{ label }}</span>
    </button>
  `,
    styles: [`
    .back-btn {
      color: #08457a;
      transition: all 0.2s;
    }
    .back-btn:hover {
      color: #052c4f;
      transform: translateX(-5px);
    }
    .icon-circle {
      width: 32px;
      height: 32px;
      background-color: #e3f2fd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #08457a;
    }
  `]
})
export class BackButtonComponent {
    @Input() label: string = 'Retour';

    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }
}
