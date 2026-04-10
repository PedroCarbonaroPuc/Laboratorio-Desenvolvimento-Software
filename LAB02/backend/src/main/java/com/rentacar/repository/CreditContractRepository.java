package com.rentacar.repository;

import com.rentacar.model.CreditContract;
import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@MongoRepository
public interface CreditContractRepository extends CrudRepository<CreditContract, String> {

    Optional<CreditContract> findByRentalOrderId(String rentalOrderId);
}
