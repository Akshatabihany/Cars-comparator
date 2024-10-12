package com.demo.service;

import com.demo.model.Car;
import com.demo.repository.CarRepository;
import com.demo.response.CarDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public Car saveCar(Car car) {
        return carRepository.save(car);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<CarDTO> findCarsByBrand(String brand) {
        List<Car> cars = carRepository.findByBrandContainingIgnoreCase(brand);
        return cars.stream()
                .map(car -> new CarDTO(car.getId(), car.getBrand(), car.getModel()))
                .collect(Collectors.toList());
    }

    public Optional<Car> getCarById(Long carId) {
        Optional<Car> carOptional = carRepository.findById(carId);
        return carOptional;
    }

    public List<Car> findSimilarCars(Long carId) {
        Car selectedCar = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));

        String brand = selectedCar.getBrand();
        String bodyType = selectedCar.getBodyType();
        int minYear = selectedCar.getYear() - 1; // Allow one year difference
        int maxYear = selectedCar.getYear() + 1;

        return carRepository.findSimilarCars(brand, bodyType, minYear, maxYear);
    }
}
