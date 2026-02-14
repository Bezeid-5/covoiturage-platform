package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Reservation;
import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByPassenger(User passenger);
    List<Reservation> findByTrajet(Trajet trajet);
}
