package com.demo.controller;

import com.demo.model.Car;
import com.demo.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public Car addCar(@RequestBody Car car) {
        return carService.saveCar(car);
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchCars(@RequestParam("brand") String brand) {
        List<String> carNames = carService.searchCarNames(brand);
        return new ResponseEntity<>(carNames, HttpStatus.OK);
    }

}
