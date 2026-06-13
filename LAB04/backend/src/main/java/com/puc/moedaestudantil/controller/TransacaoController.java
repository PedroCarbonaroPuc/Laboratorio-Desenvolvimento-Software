package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.request.EnvioMoedasRequest;
import com.puc.moedaestudantil.dto.response.ExtratoResponse;
import com.puc.moedaestudantil.dto.response.TransacaoResponse;
import com.puc.moedaestudantil.security.SecurityUtils;
import com.puc.moedaestudantil.service.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private final TransacaoService service;

    public TransacaoController(TransacaoService service) {
        this.service = service;
    }

    @PostMapping("/envio")
    public ResponseEntity<TransacaoResponse> enviarMoedas(@Valid @RequestBody EnvioMoedasRequest request) {
        String professorId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.enviarMoedas(professorId, request));
    }

    @GetMapping("/extrato/aluno/{alunoId}")
    public ResponseEntity<ExtratoResponse> extratoAluno(@PathVariable String alunoId) {
        return ResponseEntity.ok(service.extratoAluno(alunoId));
    }

    @GetMapping("/extrato/professor/{professorId}")
    public ResponseEntity<ExtratoResponse> extratoProfessor(@PathVariable String professorId) {
        return ResponseEntity.ok(service.extratoProfessor(professorId));
    }
}
