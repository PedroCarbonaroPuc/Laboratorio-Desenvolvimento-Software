package com.rentacar.controller;

import com.rentacar.dto.request.LoginRequest;
import com.rentacar.dto.request.RegisterAgentRequest;
import com.rentacar.dto.request.RegisterClientRequest;
import com.rentacar.dto.response.AuthResponse;
import com.rentacar.service.AuthService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

@Controller("/api/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
@ExecuteOn(TaskExecutors.IO)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Post("/register/client")
    public HttpResponse<AuthResponse> registerClient(@Valid @Body RegisterClientRequest request) {
        AuthResponse response = authService.registerClient(request);
        return HttpResponse.status(HttpStatus.CREATED).body(response);
    }

    @Post("/register/agent")
    public HttpResponse<AuthResponse> registerAgent(@Valid @Body RegisterAgentRequest request) {
        AuthResponse response = authService.registerAgent(request);
        return HttpResponse.status(HttpStatus.CREATED).body(response);
    }

    @Post("/login")
    public HttpResponse<AuthResponse> login(@Valid @Body LoginRequest request) {
        AuthResponse response = authService.login(request);
        return HttpResponse.ok(response);
    }
}
