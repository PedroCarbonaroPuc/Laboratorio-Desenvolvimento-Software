package com.rentacar.repository;

import com.rentacar.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ClientRepository extends MongoRepository<Client, String> {

    Optional<Client> findByEmail(String email);

    Optional<Client> findByCpf(String cpf);

    boolean existsByCpf(String cpf);
}
