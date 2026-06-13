package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.model.Instituicao;
import com.puc.moedaestudantil.service.InstituicaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoService service;

    public InstituicaoController(InstituicaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Instituicao>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instituicao> buscar(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }
}
