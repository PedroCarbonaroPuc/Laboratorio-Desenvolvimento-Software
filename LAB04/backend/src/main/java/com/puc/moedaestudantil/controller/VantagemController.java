package com.puc.moedaestudantil.controller;

import com.puc.moedaestudantil.dto.request.VantagemRequest;
import com.puc.moedaestudantil.dto.response.VantagemResponse;
import com.puc.moedaestudantil.security.SecurityUtils;
import com.puc.moedaestudantil.service.VantagemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    private final VantagemService service;

    public VantagemController(VantagemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<VantagemResponse> criar(@Valid @RequestBody VantagemRequest request) {
        String empresaId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(empresaId, request));
    }

    @GetMapping
    public ResponseEntity<List<VantagemResponse>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<VantagemResponse>> listarPorEmpresa(@PathVariable String empresaId) {
        return ResponseEntity.ok(service.listarPorEmpresa(empresaId));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<VantagemResponse>> listarMinhas() {
        String empresaId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(service.listarPorEmpresa(empresaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemResponse> buscar(@PathVariable String id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VantagemResponse> atualizar(@PathVariable String id,
                                                      @Valid @RequestBody VantagemRequest request) {
        String empresaId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(service.atualizar(empresaId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
