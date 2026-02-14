package com.covoiturage.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long id;
    private Long driverId;
    private String driverName;
    private Long passengerId;
    private String passengerName;
    private Long trajetId;
    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
}
