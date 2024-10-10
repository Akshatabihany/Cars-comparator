package com.demo.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDTO {
    private Long id; // Assuming you have a Long ID for your car
    private String brand;
    private String model; // Include any other fields you need

    // Getters and Setters
}
