package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.DashboardSummaryResponse;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthFacade authFacade;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> summary() {
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(dashboardService.summary(user));
    }
}
