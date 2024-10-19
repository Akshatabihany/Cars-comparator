package com.demo.service;

import com.demo.model.Car;
import com.demo.repository.CarRepository;
import com.demo.response.AddCarResponse;
import com.demo.response.GetCarByBrandResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CarService {

    private static final int NUMBER_OF_SIMILAR_CARS = 10;

    @Autowired
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public AddCarResponse saveCar(Car car) {
        try {
            carRepository.save(car);
            return AddCarResponse.builder()
                    .success(true)
                    .message("Added car details to DB.")
                    .build();
        } catch (Exception e) {
            String errorMessage = String.format("Failed to add car details to DB of car Id: %d, exception occurred: %s", car.getId(), e);
            log.info(errorMessage);
            return AddCarResponse.builder()
                    .success(false)
                    .message(errorMessage)
                    .build();
        }
    }

    public List<Car> getAllCars() {
        try {
            List<Car> getCarsResponse = carRepository.findAll();
            return getCarsResponse;
        } catch (Exception e) {
            String errorMessage = String.format("Failed to get all cars from DB, exception occurred: %s", e);
            log.info(errorMessage);
            return new ArrayList<>();
        }
    }

    public List<GetCarByBrandResponse> findCarsByBrand(String brand) {
        try {
            List<Car> cars = carRepository.findByBrandContainingIgnoreCase(brand);
            return cars.stream()
                    .map(car -> new GetCarByBrandResponse(car.getId(), car.getBrand(), car.getModel()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            String errorMessage = String.format("Failed to get cars by brand name, exception occurred: %s", e);
            log.info(errorMessage);
            return new ArrayList<>();
        }
    }

    public Optional<Car> getCarById(Long carId) {
        try {
            Optional<Car> car = carRepository.findById(carId);
            return car;
        } catch (Exception e) {
            String errorMessage = String.format("Failed to get car by id, exception occurred: %s", e);
            log.info(errorMessage);
            return Optional.ofNullable(Car.builder().build());
        }
    }

    public List<Car> findSimilarCars(int targetCarId) {
        List<Car> allCars = getAllCars();
        List<Pair<Car, Double>> similarityScores = new ArrayList<>();
        Car targetCar;
        try {
            targetCar = carRepository.getReferenceById((long) targetCarId);
        } catch (Exception e) {
            String errorMessage = String.format("Failed to get car by id, exception occurred: %s", e);
            log.info(errorMessage);
            return null;
        }
        double[] targetFeatureVector = createFeatureVector(targetCar);

        for (Car car : allCars) {
            if (!car.getId().equals(targetCar.getId())) {
                double[] carFeatureVector = createFeatureVector(car);
                double similarity = cosineSimilarity(targetFeatureVector, carFeatureVector);
                similarityScores.add(Pair.of(car, similarity));
            }
        }

        similarityScores.sort((a, b) -> Double.compare(b.getSecond(), a.getSecond()));

        return similarityScores.stream()
                .map(Pair::getFirst)
                .limit(NUMBER_OF_SIMILAR_CARS)
                .collect(Collectors.toList());
    }

    private double[] createFeatureVector(Car car) {
        return new double[]{
                car.getPrice(),
                car.getEngineDetails().getHorsepower(),
                car.getEngineDetails().getDisplacement(),
                car.getFuelEconomy().getCityMileage(),
                car.getPerformanceDetails().getTopSpeed()
        };
    }

    private double cosineSimilarity(double[] vectorA, double[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
