import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RideService, Trajet } from '../../core/services/ride.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.scss'
})
export class RideListComponent implements OnInit {
  rides: Trajet[] = [];
  searchForm: FormGroup;

  constructor(private rideService: RideService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      departure: [''],
      arrival: [''],
      date: ['']
    });
  }

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.rideService.searchRides().subscribe({
      next: (data) => this.rides = data,
      error: (err) => console.error('Error loading rides', err)
    });
  }

  onSearch(): void {
    const { departure, arrival, date } = this.searchForm.value;
    this.rideService.searchRides(departure, arrival, date).subscribe({
      next: (data) => this.rides = data,
      error: (err) => console.error('Error searching rides', err)
    });
  }
}
