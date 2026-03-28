package com.rentacar.repository.reactive;

import com.rentacar.model.RentalOrder;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface ReactiveRentalOrderRepository extends ReactiveMongoRepository<RentalOrder, String> {
    Flux<RentalOrder> findByClientId(String clientId);
}
