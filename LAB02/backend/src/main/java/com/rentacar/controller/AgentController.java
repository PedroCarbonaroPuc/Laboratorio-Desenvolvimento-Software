package com.rentacar.controller;

import com.rentacar.dto.response.AgentResponse;
import com.rentacar.model.User;
import com.rentacar.service.AgentService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Put;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;

@Controller("/api/agents")
@Secured({"AGENT"})
@ExecuteOn(TaskExecutors.IO)
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @Get("/me")
    public HttpResponse<AgentResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return HttpResponse.ok(agentService.getAgentById(userId));
    }

    @Put("/me")
    public HttpResponse<AgentResponse> updateMyProfile(Authentication authentication,
                                                       @Body User updates) {
        String userId = authentication.getName();
        return HttpResponse.ok(agentService.updateAgent(userId, updates));
    }
}
