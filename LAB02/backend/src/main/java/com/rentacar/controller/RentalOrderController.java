package com.rentacar.controller;

import com.rentacar.dto.request.CreateRentalOrderRequest;
import com.rentacar.dto.request.FinancialAnalysisRequest;
import com.rentacar.dto.request.UpdateRentalOrderRequest;
import com.rentacar.dto.response.RentalOrderResponse;
import com.rentacar.service.RentalOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental-orders")
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    public RentalOrderController(RentalOrderService rentalOrderService) {
        this.rentalOrderService = rentalOrderService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<RentalOrderResponse> createOrder(Authentication authentication,
                                                           @Valid @RequestBody CreateRentalOrderRequest request) {
        String clientId = authentication.getName();
        RentalOrderResponse response = rentalOrderService.createOrder(clientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<RentalOrderResponse>> getMyOrders(Authentication authentication) {
        String clientId = authentication.getName();
        return ResponseEntity.ok(rentalOrderService.getClientOrders(clientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalOrderResponse> getOrder(@PathVariable String id) {
        return ResponseEntity.ok(rentalOrderService.getOrderById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalOrderResponse> updateOrder(@PathVariable String id,
                                                           Authentication authentication,
                                                           @Valid @RequestBody UpdateRentalOrderRequest request) {
        String userId = authentication.getName();
        return ResponseEntity.ok(rentalOrderService.updateOrder(id, userId, request));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<RentalOrderResponse> cancelOrder(@PathVariable String id,
                                                           Authentication authentication) {
        String clientId = authentication.getName();
        return ResponseEntity.ok(rentalOrderService.cancelOrder(id, clientId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<RentalOrderResponse>> getPendingOrders() {
        return ResponseEntity.ok(rentalOrderService.getPendingOrders());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<RentalOrderResponse>> getAllOrders() {
        return ResponseEntity.ok(rentalOrderService.getAllOrders());
    }

    @PatchMapping("/{id}/analyze")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<RentalOrderResponse> analyzeOrder(@PathVariable String id,
                                                            Authentication authentication,
                                                            @Valid @RequestBody FinancialAnalysisRequest request) {
        String agentId = authentication.getName();
        return ResponseEntity.ok(rentalOrderService.analyzeOrder(id, agentId, request));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<RentalOrderResponse> approveOrder(@PathVariable String id) {
        return ResponseEntity.ok(rentalOrderService.approveOrder(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<RentalOrderResponse> rejectOrder(@PathVariable String id) {
        return ResponseEntity.ok(rentalOrderService.rejectOrder(id));
    }
}
