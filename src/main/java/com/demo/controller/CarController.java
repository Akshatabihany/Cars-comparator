package com.demo.controller;

import com.demo.model.Car;
import com.demo.response.AddCarResponse;
import com.demo.response.CarDTO;
import com.demo.service.CarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public AddCarResponse addCar(@RequestBody Car car) {
        return carService.saveCar(car);
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/search")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam String brand) {
        List<CarDTO> cars = carService.findCarsByBrand(brand);
        return ResponseEntity.ok(cars);
    }


    @GetMapping("/{carId}")
    public ResponseEntity<Car> getCarById(@PathVariable Long carId) {
        Optional<Car> carDTOOptional = carService.getCarById(carId);
        return carDTOOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/similar/{carId}")
    public ResponseEntity<List<Car>> getSimilarCars(@PathVariable int carId) {
        return ResponseEntity.ok(carService.findSimilarCars(carId));
    }
}
