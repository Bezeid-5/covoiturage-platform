package com.covoiturage.backend.service;

import com.covoiturage.backend.dto.RatingDTO;
import com.covoiturage.backend.entity.Rating;
import com.covoiturage.backend.entity.Trajet;
import com.covoiturage.backend.entity.User;
import com.covoiturage.backend.repository.RatingRepository;
import com.covoiturage.backend.repository.TrajetRepository;
import com.covoiturage.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {
    
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final TrajetRepository trajetRepository;
    
    @Transactional
    public RatingDTO rateDriver(Long driverId, Long passengerId, Long trajetId, Integer score, String comment) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet not found"));
        
        Rating rating = new Rating();
        rating.setDriver(driver);
        rating.setPassenger(passenger);
        rating.setTrajet(trajet);
        rating.setScore(score);
        rating.setComment(comment);
        
        Rating saved = ratingRepository.save(rating);
        return convertToDTO(saved);
    }
    
    public List<RatingDTO> getDriverRatings(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        List<Rating> ratings = ratingRepository.findByDriver(driver);
        return ratings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    public Map<String, Object> getDriverStats(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        Double average = ratingRepository.getAverageRatingForDriver(driver);
        Long count = ratingRepository.countByDriver(driver);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", average != null ? average : 0.0);
        stats.put("totalRatings", count);
        
        return stats;
    }
    
    private RatingDTO convertToDTO(Rating rating) {
        RatingDTO dto = new RatingDTO();
        dto.setId(rating.getId());
        dto.setDriverId(rating.getDriver().getId());
        dto.setDriverName(rating.getDriver().getFirstName() + " " + rating.getDriver().getLastName());
        dto.setPassengerId(rating.getPassenger().getId());
        dto.setPassengerName(rating.getPassenger().getFirstName() + " " + rating.getPassenger().getLastName());
        dto.setTrajetId(rating.getTrajet().getId());
        dto.setScore(rating.getScore());
        dto.setComment(rating.getComment());
        dto.setCreatedAt(rating.getCreatedAt());
        return dto;
    }
}
