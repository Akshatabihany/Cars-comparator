package com.demo.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable

public class Dimensions {
    private double length;  // In mm
    private double width;   // In mm
    private double height;  // In mm
}
