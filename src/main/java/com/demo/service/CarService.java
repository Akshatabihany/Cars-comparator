package com.demo.service;

import com.demo.model.Car;
import com.demo.repository.CarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<String> searchCarNames(String brand) {
        log.info("searchingggg : "+ brand);
        List<String> aa = carRepository.findCarNameByBrandContaining(brand);
        log.info("HERE : "+ aa);
        return aa;
    }
}
