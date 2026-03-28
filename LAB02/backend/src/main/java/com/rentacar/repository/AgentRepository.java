package com.rentacar.repository;

import com.rentacar.model.Agent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AgentRepository extends MongoRepository<Agent, String> {

    Optional<Agent> findByEmail(String email);

    Optional<Agent> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);
}
