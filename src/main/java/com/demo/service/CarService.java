package com.demo.service;

import com.demo.controller.CarController;
import com.demo.model.Car;
import com.demo.repository.CarRepository;
import com.demo.response.CarDTO;
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

    private int NUMBER_OF_SIMILAR_CARS =10;

    @Autowired
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }


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

//    public List<Car> findSimilarCars(Long carId) {
//        Car selectedCar = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));
//
//        String brand = selectedCar.getBrand();
//        String bodyType = selectedCar.getBodyType();
//        int minYear = selectedCar.getYear() - 1; // Allow one year difference
//        int maxYear = selectedCar.getYear() + 1;
//
//        return carRepository.findSimilarCars(brand, bodyType, minYear, maxYear);
//    }

    public List<Car> findSimilarCars(int targetCarId) {
        log.info("targetCarId : " + targetCarId);

        List<Car> allCars = carRepository.findAll();
        log.info("allCars : " + allCars);
        List<Pair<Car, Double>> similarityScores = new ArrayList<>();

        Car targetCar = carRepository.getReferenceById((long) targetCarId);
        log.info("targetCar : " + targetCar);

        double[] targetFeatureVector = createFeatureVector(targetCar);

        for (Car car : allCars) {
            if (!car.getId().equals(targetCar.getId())) {
                double[] carFeatureVector = createFeatureVector(car);
                double similarity = cosineSimilarity(targetFeatureVector, carFeatureVector);
                //similarityScores.add(new Pair<>(car, similarity));
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
