package com.rentacar.controller;

import com.rentacar.dto.response.ClientResponse;
import com.rentacar.model.User;
import com.rentacar.service.ClientService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Put;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;

@Controller("/api/clients")
@Secured({"CLIENT"})
@ExecuteOn(TaskExecutors.IO)
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @Get("/me")
    public HttpResponse<ClientResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return HttpResponse.ok(clientService.getClientById(userId));
    }

    @Put("/me")
    public HttpResponse<ClientResponse> updateMyProfile(Authentication authentication,
                                                        @Body User updates) {
        String userId = authentication.getName();
        return HttpResponse.ok(clientService.updateClient(userId, updates));
    }
}
