package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.InstitutionResponse;
import br.com.labdevsoft.moeda.service.InstitutionService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/institutions")
public class InstitutionController {

    private final InstitutionService institutionService;

    @GetMapping
    public ResponseEntity<List<InstitutionResponse>> listAll() {
        return ResponseEntity.ok(institutionService.listAll());
    }
}
