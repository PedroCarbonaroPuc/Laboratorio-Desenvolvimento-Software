package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Vantagem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VantagemRepository extends MongoRepository<Vantagem, String> {
    List<Vantagem> findByEmpresaId(String empresaId);
}
