package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.exception.ResourceNotFoundException;
import com.puc.moedaestudantil.model.Instituicao;
import com.puc.moedaestudantil.repository.InstituicaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstituicaoService {

    private final InstituicaoRepository repository;

    public InstituicaoService(InstituicaoRepository repository) {
        this.repository = repository;
    }

    public List<Instituicao> listar() {
        return repository.findAll();
    }

    public Instituicao buscarPorId(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instituição não encontrada: " + id));
    }

    public String nomeOuVazio(String id) {
        if (id == null) {
            return "";
        }
        return repository.findById(id).map(Instituicao::getNome).orElse("");
    }
}
