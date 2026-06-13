package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Instituicao;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InstituicaoRepository extends MongoRepository<Instituicao, String> {
    boolean existsByNome(String nome);
}
