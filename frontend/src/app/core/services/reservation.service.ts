import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Reservation {
    id?: number;
    trajetId: number;
    departureCity: string;
    arrivalCity: string;
    date: string;
    time: string;
    price: number;
    seats: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    driverName?: string;
    passengerName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private apiUrl = `${environment.apiUrl}/reservations`;

    constructor(private http: HttpClient) { }

    bookRide(bookingRequest: { trajetId: number, seats: number }): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, bookingRequest);
    }

    getMyReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(`${this.apiUrl}/my`);
    }

    cancelReservation(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, {});
    }
}
