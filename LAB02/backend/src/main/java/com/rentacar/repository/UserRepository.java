package com.rentacar.repository;

import com.rentacar.model.User;
import com.rentacar.model.enums.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    long countByRole(UserRole role);
}
