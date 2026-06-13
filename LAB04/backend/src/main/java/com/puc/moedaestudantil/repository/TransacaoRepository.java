package com.puc.moedaestudantil.repository;

import com.puc.moedaestudantil.model.Transacao;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransacaoRepository extends MongoRepository<Transacao, String> {
    List<Transacao> findByOrigemIdOrDestinoIdOrderByDataDesc(String origemId, String destinoId);
}
