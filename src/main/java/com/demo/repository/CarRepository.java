package com.demo.repository;

import com.demo.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("SELECT c.brand FROM Car c WHERE c.brand ILIKE %:brand%")
    List<String> findCarNameByBrandContaining(@Param("brand") String brand);

    List<Car> findByBrandContainingIgnoreCase(String brand);

    // why use optional
    Optional<Car> findById(Long id); // This is provided by JpaRepository by default

    @Query("SELECT c FROM Car c WHERE " +
            "c.brand = ?1 OR " +
            "c.bodyType = ?2 OR " +
            "c.year BETWEEN ?3 AND ?4 " +  // Similar year range
            "ORDER BY c.price ASC")  // Sort by price
    List<Car> findSimilarCars(String brand, String bodyType, int minYear, int maxYear);
}
