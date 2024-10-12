package com.demo.controller;

import com.demo.model.Car;
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
    public Car addCar(@RequestBody Car car) {
        return carService.saveCar(car);
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/search")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam String brand) {
        List<CarDTO> cars = carService.findCarsByBrand(brand);
        log.info("carscarscars : "+ cars);
        return ResponseEntity.ok(cars);
    }


    // API to fetch car details by ID
    @GetMapping("/{carId}")
    public ResponseEntity<Car> getCarById(@PathVariable Long carId) {
        log.info("carID from controller" + carId);
        Optional<Car> carDTOOptional = carService.getCarById(carId);
log.info("carDTOOptional reponse : "+ carDTOOptional);
        return carDTOOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/similar/{id}")
    public ResponseEntity<List<Car>> getSimilarCars(@PathVariable int id) {
        return ResponseEntity.ok(carService.findSimilarCars(id));
    }

//    @GetMapping("/{id}/similar")
//    public List<Car> getSimilarCars(@PathVariable Long id) {
//        log.info("get similar caars controller:" +id );
//        return carService.findSimilarCars(id);
//    }
}
