package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Professor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfessorRepository extends MongoRepository<Professor, String> {
    boolean existsByCpf(String cpf);
    boolean existsByLogin(String login);
    Optional<Professor> findByLogin(String login);
}
