package com.rentacar.controller;

import com.rentacar.dto.response.ClientResponse;
import com.rentacar.model.Client;
import com.rentacar.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(clientService.getClientById(userId));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> updateMyProfile(Authentication authentication,
                                                          @RequestBody Client updates) {
        String userId = authentication.getName();
        return ResponseEntity.ok(clientService.updateClient(userId, updates));
    }
}
