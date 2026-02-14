import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/admin/users`);
    }

    suspendUser(userId: number): Observable<any> {
        return this.http.put(`${environment.apiUrl}/admin/users/${userId}/suspend`, {});
    }

    changeUserRole(userId: number, newRole: string): Observable<any> {
        return this.http.put(`${environment.apiUrl}/admin/users/${userId}/role`, { role: newRole });
    }

    deleteRide(rideId: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/admin/trajets/${rideId}`);
    }

    getStats(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/admin/stats`);
    }
}
