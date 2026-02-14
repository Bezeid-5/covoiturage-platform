package com.covoiturage.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrajetDto {
    private Long id;
    private String departureCity;
    private String arrivalCity;
    private LocalDate date;
    private LocalTime time;
    private BigDecimal price;
    private Integer totalSeats;
    private Integer availableSeats;
    private String description;
    private String driverName;
    private String driverEmail;
    private Long driverId;
}
