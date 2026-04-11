package com.rentacar.controller;

import com.rentacar.dto.request.CreateRentalOrderRequest;
import com.rentacar.dto.request.FinancialAnalysisRequest;
import com.rentacar.dto.request.UpdateRentalOrderRequest;
import com.rentacar.dto.response.RentalOrderResponse;
import com.rentacar.service.RentalOrderService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/rental-orders")
@Secured(SecurityRule.IS_AUTHENTICATED)
@ExecuteOn(TaskExecutors.IO)
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    public RentalOrderController(RentalOrderService rentalOrderService) {
        this.rentalOrderService = rentalOrderService;
    }

    @Post
    @Secured({"CLIENT"})
    public HttpResponse<RentalOrderResponse> createOrder(Authentication authentication,
                                                         @Valid @Body CreateRentalOrderRequest request) {
        String clientId = authentication.getName();
        RentalOrderResponse response = rentalOrderService.createOrder(clientId, request);
        return HttpResponse.status(HttpStatus.CREATED).body(response);
    }

    @Get("/my")
    @Secured({"CLIENT"})
    public HttpResponse<List<RentalOrderResponse>> getMyOrders(Authentication authentication) {
        String clientId = authentication.getName();
        return HttpResponse.ok(rentalOrderService.getClientOrders(clientId));
    }

    @Get("/{id}")
    public HttpResponse<RentalOrderResponse> getOrder(@PathVariable String id) {
        return HttpResponse.ok(rentalOrderService.getOrderById(id));
    }

    @Put("/{id}")
    public HttpResponse<RentalOrderResponse> updateOrder(@PathVariable String id,
                                                         Authentication authentication,
                                                         @Valid @Body UpdateRentalOrderRequest request) {
        String userId = authentication.getName();
        return HttpResponse.ok(rentalOrderService.updateOrder(id, userId, request));
    }

    @Patch("/{id}/cancel")
    @Secured({"CLIENT"})
    public HttpResponse<RentalOrderResponse> cancelOrder(@PathVariable String id,
                                                         Authentication authentication) {
        String clientId = authentication.getName();
        return HttpResponse.ok(rentalOrderService.cancelOrder(id, clientId));
    }

    @Get("/pending")
    @Secured({"AGENT"})
    public HttpResponse<List<RentalOrderResponse>> getPendingOrders() {
        return HttpResponse.ok(rentalOrderService.getPendingOrders());
    }

    @Get("/all")
    @Secured({"AGENT"})
    public HttpResponse<List<RentalOrderResponse>> getAllOrders() {
        return HttpResponse.ok(rentalOrderService.getAllOrders());
    }

    @Patch("/{id}/analyze")
    @Secured({"AGENT"})
    public HttpResponse<RentalOrderResponse> analyzeOrder(@PathVariable String id,
                                                          Authentication authentication,
                                                          @Valid @Body FinancialAnalysisRequest request) {
        String agentId = authentication.getName();
        return HttpResponse.ok(rentalOrderService.analyzeOrder(id, agentId, request));
    }

    @Patch("/{id}/approve")
    @Secured({"AGENT"})
    public HttpResponse<RentalOrderResponse> approveOrder(@PathVariable String id) {
        return HttpResponse.ok(rentalOrderService.approveOrder(id));
    }

    @Patch("/{id}/reject")
    @Secured({"AGENT"})
    public HttpResponse<RentalOrderResponse> rejectOrder(@PathVariable String id) {
        return HttpResponse.ok(rentalOrderService.rejectOrder(id));
    }
}
