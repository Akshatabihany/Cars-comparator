package com.demo.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable

public class SafetyFeatures {
    private List<String> safetyFeatures;  // List of safety features
    private int airbagsCount;
}
