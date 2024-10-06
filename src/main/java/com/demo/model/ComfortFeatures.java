package com.demo.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable

public class ComfortFeatures {
    private boolean hasSunroof;
    private boolean hasHeatedSeats;
    private boolean hasVentilatedSeats;
    private boolean hasAutomaticClimateControl;
}

