package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Aluno;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AlunoRepository extends MongoRepository<Aluno, String> {
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    boolean existsByLogin(String login);
    Optional<Aluno> findByLogin(String login);
}
