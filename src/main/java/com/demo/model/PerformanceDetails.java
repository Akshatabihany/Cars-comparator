package com.demo.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class PerformanceDetails {
    private double topSpeed;  // In km/h or mph
    private double zeroToHundredTime;  // 0-100 km/h time in seconds
}

