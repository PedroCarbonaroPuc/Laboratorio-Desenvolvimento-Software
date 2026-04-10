package com.rentacar.controller;

import com.rentacar.dto.request.CreateCreditContractRequest;
import com.rentacar.dto.response.CreditContractResponse;
import com.rentacar.service.CreditContractService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

@Controller("/api/credit-contracts")
@Secured(SecurityRule.IS_AUTHENTICATED)
public class CreditContractController {

    private final CreditContractService creditContractService;

    public CreditContractController(CreditContractService creditContractService) {
        this.creditContractService = creditContractService;
    }

    @Post
    @Secured({"AGENT"})
    public HttpResponse<CreditContractResponse> createContract(
            @Valid @Body CreateCreditContractRequest request) {
        CreditContractResponse response = creditContractService.createContract(request);
        return HttpResponse.status(HttpStatus.CREATED).body(response);
    }

    @Get("/{id}")
    public HttpResponse<CreditContractResponse> getContract(@PathVariable String id) {
        return HttpResponse.ok(creditContractService.getContractById(id));
    }

    @Get("/order/{orderId}")
    public HttpResponse<CreditContractResponse> getContractByOrder(@PathVariable String orderId) {
        return HttpResponse.ok(creditContractService.getContractByOrderId(orderId));
    }
}
