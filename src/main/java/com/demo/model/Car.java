package com.demo.model;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Car {

    @Id
    private Long id;

    private String brand;
    private String model;
    private String variant;
    private int year;
    private double price;

    @Embedded
    private EngineDetails engineDetails;

    @Embedded
    private PerformanceDetails performanceDetails;

    @Embedded
    private FuelEconomy fuelEconomy;

    @Embedded
    private Dimensions dimensions;

    @Embedded
    private SafetyFeatures safetyFeatures;

    @Embedded
    private TechnologyFeatures technologyFeatures;

    @Embedded
    private ComfortFeatures comfortFeatures;

    @Embedded
    private WarrantyDetails warrantyDetails;

    private String bodyType;
    private String exteriorColor;
    private String interiorColor;

    @Embedded
    private CarImage images;
}
