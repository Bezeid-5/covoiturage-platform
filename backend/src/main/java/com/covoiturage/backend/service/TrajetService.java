package com.covoiturage.backend.service;

import com.covoiturage.backend.dto.TrajetDto;
import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.repository.TrajetRepository;
import com.covoiturage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrajetService {

    private final TrajetRepository trajetRepository;
    private final UserRepository userRepository;

    public TrajetDto createTrajet(TrajetDto trajetDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Trajet trajet = Trajet.builder()
                .departureCity(trajetDto.getDepartureCity())
                .arrivalCity(trajetDto.getArrivalCity())
                .date(trajetDto.getDate())
                .time(trajetDto.getTime())
                .price(trajetDto.getPrice())
                .totalSeats(trajetDto.getTotalSeats())
                .availableSeats(trajetDto.getTotalSeats())
                .description(trajetDto.getDescription())
                .driver(driver)
                .build();

        Trajet savedTrajet = trajetRepository.save(trajet);
        return mapToDto(savedTrajet);
    }

    public List<TrajetDto> searchTrajets(String departure, String arrival, LocalDate date) {
        List<Trajet> trajets;
        if (date != null) {
            trajets = trajetRepository.findByDepartureCityAndArrivalCityAndDate(departure, arrival, date);
        } else {
            trajets = trajetRepository.findByDepartureCityAndArrivalCity(departure, arrival);
        }
        return trajets.stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    public List<TrajetDto> getAllTrajets() {
        return trajetRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public TrajetDto getTrajetById(Long id) {
        Trajet trajet = trajetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet not found"));
        return mapToDto(trajet);
    }

    public void deleteTrajet(Long id) {
        // Add check if current user is owner or admin
        trajetRepository.deleteById(id);
    }
    
    public List<TrajetDto> getMyPublishedRides() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<Trajet> trajets = trajetRepository.findByDriver(driver);
        return trajets.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private TrajetDto mapToDto(Trajet trajet) {
        return TrajetDto.builder()
                .id(trajet.getId())
                .departureCity(trajet.getDepartureCity())
                .arrivalCity(trajet.getArrivalCity())
                .date(trajet.getDate())
                .time(trajet.getTime())
                .price(trajet.getPrice())
                .totalSeats(trajet.getTotalSeats())
                .availableSeats(trajet.getAvailableSeats())
                .description(trajet.getDescription())
                .driverName(trajet.getDriver().getFirstName() + " " + trajet.getDriver().getLastName())
                .driverEmail(trajet.getDriver().getEmail())
                .driverId(trajet.getDriver().getId())
                .build();
    }
}
