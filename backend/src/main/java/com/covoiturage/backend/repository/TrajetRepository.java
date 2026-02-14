package com.covoiturage.backend.repository;

import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrajetRepository extends JpaRepository<Trajet, Long> {
    List<Trajet> findByDepartureCityAndArrivalCityAndDate(String departureCity, String arrivalCity, LocalDate date);
    List<Trajet> findByDepartureCityAndArrivalCity(String departureCity, String arrivalCity);
    List<Trajet> findByDriver(User driver);
}
