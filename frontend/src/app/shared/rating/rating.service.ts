import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RatingService {

    constructor(private http: HttpClient) { }

    rateDriver(driverId: number, passengerId: number, trajetId: number, score: number, comment: string): Observable<any> {
        return this.http.post(`${environment.apiUrl}/ratings`, {
            driverId,
            passengerId,
            trajetId,
            score,
            comment
        });
    }

    getDriverRatings(driverId: number): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/ratings/driver/${driverId}`);
    }

    getDriverStats(driverId: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/ratings/driver/${driverId}/stats`);
    }
}
