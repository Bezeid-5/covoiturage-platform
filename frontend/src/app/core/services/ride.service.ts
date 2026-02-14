import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Trajet {
    id?: number;
    departureCity: string;
    arrivalCity: string;
    date: string;
    time: string;
    price: number;
    totalSeats: number;
    availableSeats?: number;
    description?: string;
    driverName?: string;
    driverEmail?: string;
    driverId?: number;
}

@Injectable({
    providedIn: 'root'
})
export class RideService {
    private apiUrl = `${environment.apiUrl}/trajets`;

    constructor(private http: HttpClient) { }

    createRide(ride: Trajet): Observable<Trajet> {
        return this.http.post<Trajet>(this.apiUrl, ride);
    }

    searchRides(departure?: string, arrival?: string, date?: string): Observable<Trajet[]> {
        let params = new HttpParams();
        if (departure) params = params.set('departure', departure);
        if (arrival) params = params.set('arrival', arrival);
        if (date) params = params.set('date', date);

        return this.http.get<Trajet[]>(this.apiUrl, { params });
    }

    getRideById(id: number): Observable<Trajet> {
        return this.http.get<Trajet>(`${this.apiUrl}/${id}`);
    }

    deleteRide(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
