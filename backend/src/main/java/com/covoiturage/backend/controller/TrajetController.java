package com.covoiturage.backend.controller;

import com.covoiturage.backend.dto.TrajetDto;
import com.covoiturage.backend.service.TrajetService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trajets")
@RequiredArgsConstructor
public class TrajetController {

    private final TrajetService trajetService;

    @PostMapping
    public ResponseEntity<TrajetDto> createTrajet(@RequestBody TrajetDto trajetDto) {
        return ResponseEntity.ok(trajetService.createTrajet(trajetDto));
    }

    @GetMapping
    public ResponseEntity<List<TrajetDto>> searchTrajets(
            @RequestParam(required = false) String departure,
            @RequestParam(required = false) String arrival,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (departure == null && arrival == null && date == null) {
            return ResponseEntity.ok(trajetService.getAllTrajets());
        }
        return ResponseEntity.ok(trajetService.searchTrajets(departure, arrival, date));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrajetDto> getTrajetById(@PathVariable Long id) {
        return ResponseEntity.ok(trajetService.getTrajetById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrajet(@PathVariable Long id) {
        trajetService.deleteTrajet(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<TrajetDto>> getMyPublishedRides() {
        return ResponseEntity.ok(trajetService.getMyPublishedRides());
    }
}
