package com.rentacar.repository;

import com.rentacar.model.CreditContract;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CreditContractRepository extends MongoRepository<CreditContract, String> {

    Optional<CreditContract> findByRentalOrderId(String rentalOrderId);
}
