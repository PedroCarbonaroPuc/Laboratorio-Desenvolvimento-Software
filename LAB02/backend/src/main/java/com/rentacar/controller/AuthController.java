package com.rentacar.controller;

import com.rentacar.dto.request.LoginRequest;
import com.rentacar.dto.request.RegisterAgentRequest;
import com.rentacar.dto.request.RegisterClientRequest;
import com.rentacar.dto.response.AuthResponse;
import com.rentacar.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/client")
    public ResponseEntity<AuthResponse> registerClient(@Valid @RequestBody RegisterClientRequest request) {
        AuthResponse response = authService.registerClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/agent")
    public ResponseEntity<AuthResponse> registerAgent(@Valid @RequestBody RegisterAgentRequest request) {
        AuthResponse response = authService.registerAgent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
