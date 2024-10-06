package com.demo.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable

public class FuelEconomy {
    private double cityMileage;  // In km/l or mpg
    private double highwayMileage;  // In km/l or mpg
    private double fuelTankCapacity;  // In liters
}

