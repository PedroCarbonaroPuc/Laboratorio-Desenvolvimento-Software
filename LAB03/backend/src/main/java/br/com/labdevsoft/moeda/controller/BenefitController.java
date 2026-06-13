package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.BenefitCreateRequest;
import br.com.labdevsoft.moeda.dto.BenefitResponse;
import br.com.labdevsoft.moeda.dto.BenefitUpdateRequest;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.BenefitService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/benefits")
public class BenefitController {

    private final BenefitService benefitService;
    private final AuthFacade authFacade;

    @GetMapping
    public ResponseEntity<List<BenefitResponse>> listPublicCatalog() {
        return ResponseEntity.ok(benefitService.listPublicCatalog());
    }

    @GetMapping("/{benefitId}")
    public ResponseEntity<BenefitResponse> findById(@PathVariable String benefitId) {
        return ResponseEntity.ok(benefitService.getById(benefitId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BenefitResponse>> listOwnBenefits() {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(benefitService.listByPartner(user.userId()));
    }

    @PostMapping
    public ResponseEntity<BenefitResponse> create(@Valid @RequestBody BenefitCreateRequest request) {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.status(HttpStatus.CREATED).body(benefitService.create(user.userId(), request));
    }

    @PutMapping("/{benefitId}")
    public ResponseEntity<BenefitResponse> update(
            @PathVariable String benefitId,
            @RequestBody BenefitUpdateRequest request) {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(benefitService.update(user.userId(), benefitId, request));
    }

    @DeleteMapping("/{benefitId}")
    public ResponseEntity<Void> delete(@PathVariable String benefitId) {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        benefitService.delete(user.userId(), benefitId);
        return ResponseEntity.noContent().build();
    }
}
