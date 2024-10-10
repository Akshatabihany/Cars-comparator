package com.demo.service;

import com.demo.model.Car;
import com.demo.repository.CarRepository;
import com.demo.response.CarDTO;
import com.demo.response.CarDetailsByIdResponse;
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
        log.info("Saveddd");
        return carRepository.save(car);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<CarDTO> findCarsByBrand(String brand) {
                log.info("searchingggg : "+ brand);
        List<Car> cars = carRepository.findByBrandContainingIgnoreCase(brand);
        log.info("CARSS : "+ cars);
        return cars.stream()
                .map(car -> new CarDTO(car.getId(), car.getBrand(), car.getModel()))
                .collect(Collectors.toList());
    }


//    public List<String> searchCarNames(String brand) {
//        log.info("searchingggg : "+ brand);
//        List<String> aa = carRepository.findCarNameByBrandContaining(brand);
//        log.info("HERE : "+ aa);
//        return aa;
//    }

    public Optional<Car> getCarById(Long carId) {
        log.info("carID from service" + carId);

        Optional<Car> carOptional = carRepository.findById(carId);

        return carOptional;
    }

    public List<Car> findSimilarCars(Long carId) {
        log.info("car service  ::");
        Car selectedCar = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));

        String brand = selectedCar.getBrand();
        String bodyType = selectedCar.getBodyType();
        int minYear = selectedCar.getYear() - 1; // Allow one year difference
        int maxYear = selectedCar.getYear() + 1;

        // Fetch similar cars based on brand, body type, and year
        return carRepository.findSimilarCars(brand, bodyType, minYear, maxYear);
    }
}
