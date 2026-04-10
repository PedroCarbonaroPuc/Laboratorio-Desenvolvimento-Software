package com.rentacar.repository;

import com.rentacar.model.Vehicle;
import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

@MongoRepository
public interface VehicleRepository extends CrudRepository<Vehicle, String> {

    List<Vehicle> findByAvailableTrue();

    Optional<Vehicle> findByLicensePlate(String licensePlate);

    boolean existsByLicensePlate(String licensePlate);

    List<Vehicle> findByBrandIgnoreCase(String brand);

    List<Vehicle> findByOwnerId(String ownerId);

    List<Vehicle> findAll();
}
