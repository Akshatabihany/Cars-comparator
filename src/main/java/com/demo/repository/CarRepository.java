package com.demo.repository;

import com.demo.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    @Query("SELECT c.brand FROM Car c WHERE c.brand ILIKE %:brand%")
    List<String> findCarNameByBrandContaining(@Param("brand") String brand);
}
