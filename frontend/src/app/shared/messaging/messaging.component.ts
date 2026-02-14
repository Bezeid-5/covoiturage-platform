import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagingService } from './messaging.service';
import { AuthService } from '../../core/auth/auth.service';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="messaging-container card border-0 shadow-sm overflow-hidden" 
         [ngClass]="{'messaging-embedded': isEmbedded}"
         [style.height]="isEmbedded ? '100%' : '500px'">
      <div class="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center" *ngIf="!isEmbedded">
        <div class="d-flex align-items-center">
          <i class="bi bi-person-circle fs-4 me-2" style="color: #08457a;"></i>
          <h6 class="mb-0 fw-bold">{{ receiverName }}</h6>
        </div>
        <button type="button" class="btn-close" (click)="onClose()"></button>
      </div>

      <div class="card-body p-3 overflow-auto d-flex flex-column-reverse" #scrollMe style="background-color: #f0f2f5;">
        <div class="messages-list">
          <div *ngFor="let msg of messages" class="mb-2 d-flex" 
               [ngClass]="{'justify-content-end': msg.senderId === currentUserId, 'justify-content-start': msg.senderId !== currentUserId}">
            <div class="message-bubble p-2 px-3 rounded-4 shadow-xs" 
                 [ngStyle]="{
                   'background-color': msg.senderId === currentUserId ? '#08457a' : 'white',
                   'color': msg.senderId === currentUserId ? 'white' : 'black',
                   'max-width': '80%'
                 }">
              <div class="message-content">{{ msg.content }}</div>
              <div class="message-time text-end mt-1" style="font-size: 0.7rem;" 
                   [ngClass]="{'text-white-50': msg.senderId === currentUserId, 'text-muted': msg.senderId !== currentUserId}">
                {{ msg.timestamp | date:'HH:mm' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer bg-white border-top p-3">
        <form (ngSubmit)="sendMessage()" class="d-flex gap-2">
          <input type="text" [(ngModel)]="newMessage" name="newMessage" class="form-control rounded-pill border-0 bg-light px-3" 
                 placeholder="Tapez votre message..." autocomplete="off">
          <button type="submit" class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0" 
                  style="width: 40px; height: 40px; background-color: #08457a; border: none;"
                  [disabled]="!newMessage.trim()">
            <i class="bi bi-send-fill fs-5"></i>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .messaging-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      z-index: 1050;
      background-color: white;
    }
    .messaging-embedded {
      position: static !important;
      width: 100% !important;
      height: 100% !important;
      bottom: auto !important;
      right: auto !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
    }
    .message-bubble {
      word-wrap: break-word;
    }
    .shadow-xs {
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
  `]
})
export class MessagingComponent implements OnInit, OnDestroy {
  @Input() receiverId!: number;
  @Input() receiverName: string = 'Destinataire';
  @Input() onClose: () => void = () => { };
  @Input() isEmbedded: boolean = false;

  messages: any[] = [];
  newMessage: string = '';
  currentUserId!: number;
  private pollingSub?: Subscription;

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.currentUserId = user.userId;

    this.loadMessages();

    // Poll for new messages every 5 seconds
    this.pollingSub = interval(5000).pipe(
      switchMap(() => this.messagingService.getConversation(this.receiverId, this.currentUserId))
    ).subscribe(data => {
      this.messages = data;
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  loadMessages(): void {
    this.messagingService.getConversation(this.receiverId, this.currentUserId).subscribe(data => {
      this.messages = data;
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.messagingService.sendMessage(this.currentUserId, this.receiverId, this.newMessage).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.newMessage = '';
      }
    });
  }
}
