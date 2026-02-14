import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DriverService {

    constructor(private http: HttpClient) { }

    getMyPublishedRides(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/trajets/my`);
    }

    getReceivedReservations(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/reservations/driver/received`);
    }
}
