import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagingComponent } from './messaging.component';
import { MessagingService } from './messaging.service';
import { AuthService } from '../../core/auth/auth.service';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-messaging-page',
  standalone: true,
  imports: [CommonModule, MessagingComponent],
  template: `
    <div class="container-fluid py-4 h-100">
      <div class="row h-100">
        <!-- Conversation List -->
        <div class="col-md-4 col-lg-3 border-end h-100 overflow-auto bg-white rounded-start list-group-flush p-0">
          <div class="p-3 border-bottom bg-light">
            <h5 class="mb-0 fw-bold" style="color: #08457a;">Messages</h5>
          </div>
          <div class="list-group list-group-flush">
            <button *ngFor="let conv of conversations" 
                    class="list-group-item list-group-item-action py-3 border-bottom-0"
                    [class.active-chat]="selectedUser?.id === conv.id"
                    (click)="selectConversation(conv)">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div class="position-relative">
                    <i class="bi bi-person-circle fs-3 me-3 text-secondary"></i>
                    <span *ngIf="conv.unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {{ conv.unreadCount }}
                    </span>
                  </div>
                  <div>
                    <h6 class="mb-1 text-dark fw-bold">{{ conv.firstName }} {{ conv.lastName }}</h6>
                    <small class="text-muted text-truncate d-block" style="max-width: 150px;">
                      {{ conv.lastMessage }}
                    </small>
                  </div>
                </div>
                <small class="text-muted" style="font-size: 0.75rem;">
                  {{ conv.lastMessageTime | date:'shortTime' }}
                </small>
              </div>
            </button>
            
            <div *ngIf="conversations.length === 0" class="text-center p-5 text-muted">
              <i class="bi bi-chat-square-text display-6 mb-3"></i>
              <p>Aucune conversation</p>
            </div>
          </div>
        </div>

        <!-- Chat Window -->
        <div class="col-md-8 col-lg-9 h-100 p-0 bg-light rounded-end position-relative">
          <div *ngIf="selectedUser" class="h-100 d-flex flex-column">
             <!-- Using component in 'embedded' mode via CSS classes or inputs could be better, 
                  but here we wrap it or modify it. 
                  Actually, MessagingComponent is designed as a fixed widget. 
                  We might need to adjust it to be static. -->
             <app-messaging 
                [receiverId]="selectedUser.id" 
                [receiverName]="selectedUser.firstName + ' ' + selectedUser.lastName"
                [isEmbedded]="true"
                class="h-100 d-block">
             </app-messaging>
          </div>
          
          <div *ngIf="!selectedUser" class="h-100 d-flex align-items-center justify-content-center text-muted">
            <div class="text-center">
              <i class="bi bi-chat-dots display-1 opacity-25" style="color: #08457a;"></i>
              <h4 class="mt-3">Sélectionnez une conversation</h4>
              <p>pour commencer à discuter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: calc(100vh - 100px); }
    .active-chat { background-color: #e3f2fd !important; border-left: 4px solid #08457a; }
  `]
})
export class MessagingPageComponent implements OnInit, OnDestroy {
  conversations: any[] = [];
  selectedUser: any = null;
  pollingSub?: Subscription;
  currentUserId!: number;

  constructor(
    private messagingService: MessagingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.currentUserId = user.userId;
      this.loadConversations();

      // Poll conversations list
      this.pollingSub = interval(5000).pipe(
        switchMap(() => this.messagingService.getUserConversations(this.currentUserId))
      ).subscribe(data => {
        this.conversations = data;
        // Update unread count or last message dynamically
      });
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }

  loadConversations(): void {
    this.messagingService.getUserConversations(this.currentUserId).subscribe({
      next: (data) => this.conversations = data,
      error: (err) => console.error('Error loading conversations', err)
    });
  }

  selectConversation(user: any): void {
    this.selectedUser = user;
  }
}
