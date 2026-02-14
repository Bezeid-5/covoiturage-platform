package com.covoiturage.backend.dto;

import com.covoiturage.backend.enums.ReservationStatus;
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
public class ReservationDto {
    private Long id;
    private Long trajetId;
    private String departureCity;
    private String arrivalCity;
    private LocalDate date;
    private LocalTime time;
    private BigDecimal price;
    private Integer seats;
    private ReservationStatus status;
    private String driverName;
    private String passengerName;
}
