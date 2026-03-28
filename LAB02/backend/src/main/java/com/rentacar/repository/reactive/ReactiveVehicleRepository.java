package com.rentacar.repository.reactive;

import com.rentacar.model.Vehicle;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface ReactiveVehicleRepository extends ReactiveMongoRepository<Vehicle, String> {
    Flux<Vehicle> findByAvailableTrue();
}
