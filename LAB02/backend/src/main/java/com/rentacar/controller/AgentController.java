package com.rentacar.controller;

import com.rentacar.dto.response.AgentResponse;
import com.rentacar.model.Agent;
import com.rentacar.service.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<AgentResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(agentService.getAgentById(userId));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<AgentResponse> updateMyProfile(Authentication authentication,
                                                         @RequestBody Agent updates) {
        String userId = authentication.getName();
        return ResponseEntity.ok(agentService.updateAgent(userId, updates));
    }
}
