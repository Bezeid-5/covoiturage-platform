import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    constructor(private http: HttpClient) { }

    sendMessage(senderId: number, receiverId: number, content: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/messages`, {
            senderId,
            receiverId,
            content
        });
    }

    getConversation(userId: number, currentUserId: number): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/messages/conversation/${userId}`, {
            params: { currentUserId: currentUserId.toString() }
        });
    }

    getUnreadMessages(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/messages/unread/${userId}`);
    }

    getUserConversations(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/messages/conversations`, {
            params: { userId: userId.toString() }
        });
    }

    markAsRead(messageId: number): Observable<any> {
        return this.http.put(`${environment.apiUrl}/messages/${messageId}/read`, {});
    }
}
