package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.BalanceAndStatementResponse;
import br.com.labdevsoft.moeda.dto.CoinTransferRequest;
import br.com.labdevsoft.moeda.dto.ProfessorProfileResponse;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.ProfessorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/professors")
public class ProfessorController {

    private final ProfessorService professorService;
    private final AuthFacade authFacade;

    @GetMapping("/me")
    public ResponseEntity<ProfessorProfileResponse> me() {
        authFacade.requireRole(Role.PROFESSOR);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(professorService.getOwnProfile(user.userId()));
    }

    @GetMapping("/me/statement")
    public ResponseEntity<BalanceAndStatementResponse> statement() {
        authFacade.requireRole(Role.PROFESSOR);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(professorService.getOwnStatement(user.userId()));
    }

    @PostMapping("/me/transfer")
    public ResponseEntity<Void> transfer(@Valid @RequestBody CoinTransferRequest request) {
        authFacade.requireRole(Role.PROFESSOR);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        professorService.transferCoins(user.userId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
