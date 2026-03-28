package com.rentacar.repository;

import com.rentacar.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {

    List<Vehicle> findByAvailableTrue();

    Optional<Vehicle> findByLicensePlate(String licensePlate);

    boolean existsByLicensePlate(String licensePlate);

    List<Vehicle> findByBrandIgnoreCase(String brand);

    List<Vehicle> findByAvailableTrueAndBrandIgnoreCase(String brand);

    List<Vehicle> findByOwnerId(String ownerId);
}
