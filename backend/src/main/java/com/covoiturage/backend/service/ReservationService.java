package com.covoiturage.backend.service;

import com.covoiturage.backend.dto.ReservationDto;
import com.covoiturage.backend.entity.Reservation;
import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.enums.ReservationStatus;
import com.covoiturage.backend.repository.ReservationRepository;
import com.covoiturage.backend.repository.TrajetRepository;
import com.covoiturage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TrajetRepository trajetRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReservationDto bookRide(Long trajetId, Integer seats) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User passenger = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet not found"));

        if (trajet.getAvailableSeats() < seats) {
            throw new RuntimeException("Not enough seats available");
        }

        // Logic to prevent booking own ride or double booking could go here

        trajet.setAvailableSeats(trajet.getAvailableSeats() - seats);
        trajetRepository.save(trajet);

        Reservation reservation = Reservation.builder()
                .passenger(passenger)
                .trajet(trajet)
                .seats(seats)
                .status(ReservationStatus.CONFIRMED) // Auto-confirm for now
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return mapToDto(saved);
    }

    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        // Check if user is the passenger
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!reservation.getPassenger().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
             throw new RuntimeException("Already cancelled");
        }

        Trajet trajet = reservation.getTrajet();
        trajet.setAvailableSeats(trajet.getAvailableSeats() + reservation.getSeats());
        trajetRepository.save(trajet);

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    public List<ReservationDto> getMyReservations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User passenger = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return reservationRepository.findByPassenger(passenger).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<ReservationDto> getReservationsForMyRides() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<Trajet> myTrajets = trajetRepository.findByDriver(driver);
        
        return reservationRepository.findAll().stream()
                .filter(res -> myTrajets.contains(res.getTrajet()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReservationDto mapToDto(Reservation reservation) {
        Trajet trajet = reservation.getTrajet();
        User driver = trajet.getDriver();
        User passenger = reservation.getPassenger();

        return ReservationDto.builder()
                .id(reservation.getId())
                .trajetId(trajet.getId())
                .departureCity(trajet.getDepartureCity())
                .arrivalCity(trajet.getArrivalCity())
                .date(trajet.getDate())
                .time(trajet.getTime())
                .price(trajet.getPrice())
                .seats(reservation.getSeats())
                .status(reservation.getStatus())
                .driverName(driver.getFirstName() + " " + driver.getLastName())
                .passengerName(passenger.getFirstName() + " " + passenger.getLastName())
                .build();
    }
}
