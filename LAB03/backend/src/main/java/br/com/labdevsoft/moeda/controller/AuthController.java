package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.AuthResponse;
import br.com.labdevsoft.moeda.dto.CurrentUserResponse;
import br.com.labdevsoft.moeda.dto.LoginRequest;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthFacade authFacade;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        authService.logout(authorizationHeader);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> me() {
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(authService.currentUser(user));
    }
}
