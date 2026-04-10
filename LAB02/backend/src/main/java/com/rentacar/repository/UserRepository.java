package com.rentacar.repository;

import com.rentacar.model.User;
import com.rentacar.model.enums.UserRole;
import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

@MongoRepository
public interface UserRepository extends CrudRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    long countByRole(UserRole role);

    Optional<User> findByCpf(String cpf);

    boolean existsByCpf(String cpf);

    Optional<User> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);

    List<User> findAll();
}
