package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.EmpresaParceira;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EmpresaParceiraRepository extends MongoRepository<EmpresaParceira, String> {
    boolean existsByCnpj(String cnpj);
    boolean existsByEmail(String email);
    boolean existsByLogin(String login);
    Optional<EmpresaParceira> findByLogin(String login);
}
