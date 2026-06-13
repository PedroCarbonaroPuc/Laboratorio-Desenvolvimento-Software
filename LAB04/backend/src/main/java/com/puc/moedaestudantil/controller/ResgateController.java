package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.request.ResgateRequest;
import com.puc.moedaestudantil.dto.response.ResgateResponse;
import com.puc.moedaestudantil.security.SecurityUtils;
import com.puc.moedaestudantil.service.ResgateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resgates")
public class ResgateController {

    private final ResgateService service;

    public ResgateController(ResgateService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ResgateResponse> resgatar(@Valid @RequestBody ResgateRequest request) {
        String alunoId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.resgatar(alunoId, request));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<ResgateResponse>> listarPorAluno(@PathVariable String alunoId) {
        return ResponseEntity.ok(service.listarPorAluno(alunoId));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<ResgateResponse>> listarPorEmpresa(@PathVariable String empresaId) {
        return ResponseEntity.ok(service.listarPorEmpresa(empresaId));
    }
}
