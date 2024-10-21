package com.demo.service;

import com.demo.model.Car;
import com.demo.model.EngineDetails;
import com.demo.model.FuelEconomy;
import com.demo.model.PerformanceDetails;
import com.demo.repository.CarRepository;
import com.demo.response.AddCarResponse;
import com.demo.response.GetCarByBrandResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarService carService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveCar_successful() {
        Car car = Car.builder().id(1L).build();
        when(carRepository.save(car)).thenReturn(car);

        AddCarResponse response = carService.saveCar(car);

        assertTrue(response.isSuccess());
        assertEquals("Added car details to DB.", response.getMessage());
        verify(carRepository, times(1)).save(car);
    }

    @Test
    void saveCar_failure() {
        Car car = Car.builder().id(1L).build();

        doThrow(new RuntimeException("Database error")).when(carRepository).save(car);

        AddCarResponse response = carService.saveCar(car);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Failed to add car details to DB"));
        verify(carRepository, times(1)).save(car);
    }

    @Test
    void getAllCars_successful() {
        List<Car> cars = new ArrayList<>();
        cars.add(new Car());
        when(carRepository.findAll()).thenReturn(cars);

        List<Car> result = carService.getAllCars();

        assertFalse(result.isEmpty());
        verify(carRepository, times(1)).findAll();
    }

    @Test
    void getAllCars_failure() {
        doThrow(new RuntimeException("Database error")).when(carRepository).findAll();

        List<Car> result = carService.getAllCars();

        assertTrue(result.isEmpty());
        verify(carRepository, times(1)).findAll();
    }

    @Test
    void findCarsByBrand_successful() {
        List<Car> cars = new ArrayList<>();
        Car car = Car.builder().id(1L).brand("Toyota").build();
        cars.add(car);
        when(carRepository.findByBrandContainingIgnoreCase("Toyota")).thenReturn(cars);

        List<GetCarByBrandResponse> result = carService.findCarsByBrand("Toyota");

        assertEquals(1, result.size());
        assertEquals("Toyota", result.get(0).getBrand());
        verify(carRepository, times(1)).findByBrandContainingIgnoreCase("Toyota");
    }

    @Test
    void getCarById_successful() {
        Car car = Car.builder().id(1L).build();
        when(carRepository.findById(1L)).thenReturn(Optional.of(car));

        Optional<Car> result = carService.getCarById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(carRepository, times(1)).findById(1L);
    }

    @Test
    void findSimilarCars_successful() {
        Car targetCar = Car.builder()
                .id(1L)
                .engineDetails(EngineDetails.builder().horsepower(11).displacement(1).build())
                .fuelEconomy(FuelEconomy.builder().cityMileage(1.1).build())
                .performanceDetails(PerformanceDetails.builder().topSpeed(11).build())
                .price(300000)
                .build();

        Car similarCar = Car.builder()
                .id(2L)
                .engineDetails(EngineDetails.builder().horsepower(11).displacement(1).build())
                .fuelEconomy(FuelEconomy.builder().cityMileage(1.1).build())
                .performanceDetails(PerformanceDetails.builder().topSpeed(11).build())
                .price(310000)
                .build();

        List<Car> allCars = List.of(targetCar, similarCar);
        when(carRepository.findAll()).thenReturn(allCars);
        when(carRepository.getReferenceById(1L)).thenReturn(targetCar);

        List<Car> result = carService.findSimilarCars(1);

        assertEquals(1, result.size());
        assertEquals(2L, result.get(0).getId());
        verify(carRepository, times(1)).getReferenceById(1L);
        verify(carRepository, times(1)).findAll();
    }
}

