package com.demo.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class EngineDetails {
    private String engineType;
    private int horsepower;
    private int torque;
    private double displacement;  // In liters
    private String transmissionType;
    private int numberOfGears;
}
