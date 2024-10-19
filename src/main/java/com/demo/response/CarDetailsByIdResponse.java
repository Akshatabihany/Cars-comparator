package com.demo.response;

import com.demo.model.CarImage;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDetailsByIdResponse {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private Double price;
    private String color;
    private String fuelType;
    private String transmission;
    private String engine;
    private CarImage images;
}
