package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.ReservationDto;
import com.covoiturage.backend.service.ReservationService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDto> bookRide(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(reservationService.bookRide(request.getTrajetId(), request.getSeats()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationDto>> getMyReservations() {
        return ResponseEntity.ok(reservationService.getMyReservations());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/driver/received")
    public ResponseEntity<List<ReservationDto>> getReservationsForMyRides() {
        return ResponseEntity.ok(reservationService.getReservationsForMyRides());
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingRequest {
        private Long trajetId;
        private Integer seats;
    }
}
