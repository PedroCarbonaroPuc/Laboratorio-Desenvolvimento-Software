package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.PartnerRegistrationRequest;
import br.com.labdevsoft.moeda.dto.PartnerResponse;
import br.com.labdevsoft.moeda.dto.PartnerUpdateRequest;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.PartnerService;
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
@RequestMapping("/api/partners")
public class PartnerController {

    private final PartnerService partnerService;
    private final AuthFacade authFacade;

    @PostMapping("/register")
    public ResponseEntity<PartnerResponse> register(@Valid @RequestBody PartnerRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(partnerService.register(request));
    }

    @GetMapping
    public ResponseEntity<List<PartnerResponse>> listAll() {
        return ResponseEntity.ok(partnerService.listAll());
    }

    @GetMapping("/{partnerId}")
    public ResponseEntity<PartnerResponse> findById(@PathVariable String partnerId) {
        return ResponseEntity.ok(partnerService.getById(partnerId));
    }

    @GetMapping("/me")
    public ResponseEntity<PartnerResponse> currentPartnerProfile() {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(partnerService.getById(user.userId()));
    }

    @PutMapping("/me")
    public ResponseEntity<PartnerResponse> updateOwnData(@RequestBody PartnerUpdateRequest request) {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(partnerService.update(user.userId(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteOwnAccount() {
        authFacade.requireRole(Role.PARTNER);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        partnerService.delete(user.userId());
        return ResponseEntity.noContent().build();
    }
}
