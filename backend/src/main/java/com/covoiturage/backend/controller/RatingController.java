package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.RatingDTO;
import com.covoiturage.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4100")
public class RatingController {
    
    private final RatingService ratingService;
    
    @PostMapping
    public ResponseEntity<RatingDTO> rateDriver(@RequestBody Map<String, Object> request) {
        Long driverId = Long.valueOf(request.get("driverId").toString());
        Long passengerId = Long.valueOf(request.get("passengerId").toString());
        Long trajetId = Long.valueOf(request.get("trajetId").toString());
        Integer score = Integer.valueOf(request.get("score").toString());
        String comment = request.get("comment") != null ? request.get("comment").toString() : null;
        
        RatingDTO rating = ratingService.rateDriver(driverId, passengerId, trajetId, score, comment);
        return ResponseEntity.ok(rating);
    }
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RatingDTO>> getDriverRatings(@PathVariable Long driverId) {
        List<RatingDTO> ratings = ratingService.getDriverRatings(driverId);
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/driver/{driverId}/stats")
    public ResponseEntity<Map<String, Object>> getDriverStats(@PathVariable Long driverId) {
        Map<String, Object> stats = ratingService.getDriverStats(driverId);
        return ResponseEntity.ok(stats);
    }
}
