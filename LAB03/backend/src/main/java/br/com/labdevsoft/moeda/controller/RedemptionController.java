package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.RedeemBenefitRequest;
import br.com.labdevsoft.moeda.dto.RedemptionResponse;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.RedemptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/redemptions")
public class RedemptionController {

    private final RedemptionService redemptionService;
    private final AuthFacade authFacade;

    @PostMapping
    public ResponseEntity<RedemptionResponse> redeem(@Valid @RequestBody RedeemBenefitRequest request) {
        authFacade.requireRole(Role.STUDENT);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        RedemptionResponse response = redemptionService.redeem(user.userId(), request.benefitId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
