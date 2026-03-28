package com.rentacar.controller;

import com.rentacar.dto.request.CreateCreditContractRequest;
import com.rentacar.dto.response.CreditContractResponse;
import com.rentacar.service.CreditContractService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/credit-contracts")
public class CreditContractController {

    private final CreditContractService creditContractService;

    public CreditContractController(CreditContractService creditContractService) {
        this.creditContractService = creditContractService;
    }

    @PostMapping
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<CreditContractResponse> createContract(
            @Valid @RequestBody CreateCreditContractRequest request) {
        CreditContractResponse response = creditContractService.createContract(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CreditContractResponse> getContract(@PathVariable String id) {
        return ResponseEntity.ok(creditContractService.getContractById(id));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<CreditContractResponse> getContractByOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(creditContractService.getContractByOrderId(orderId));
    }
}
