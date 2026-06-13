package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Resgate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResgateRepository extends MongoRepository<Resgate, String> {
    List<Resgate> findByAlunoIdOrderByDataDesc(String alunoId);
    List<Resgate> findByEmpresaIdOrderByDataDesc(String empresaId);
}
