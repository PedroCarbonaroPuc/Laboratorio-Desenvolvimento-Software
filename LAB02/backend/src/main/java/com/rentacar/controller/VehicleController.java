package com.rentacar.controller;

import com.rentacar.dto.request.CreateVehicleRequest;
import com.rentacar.dto.response.VehicleResponse;
import com.rentacar.service.VehicleService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/api/vehicles")
@Secured(SecurityRule.IS_AUTHENTICATED)
@ExecuteOn(TaskExecutors.IO)
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @Get
    public HttpResponse<List<VehicleResponse>> getVehicles(
            @QueryValue(defaultValue = "false") boolean all) {
        if (all) {
            return HttpResponse.ok(vehicleService.getAllVehicles());
        }
        return HttpResponse.ok(vehicleService.getAvailableVehicles());
    }

    @Get("/{id}")
    public HttpResponse<VehicleResponse> getVehicle(@PathVariable String id) {
        return HttpResponse.ok(vehicleService.getVehicleById(id));
    }

    @Post
    @Secured({"AGENT"})
    public HttpResponse<VehicleResponse> createVehicle(@Valid @Body CreateVehicleRequest request) {
        VehicleResponse response = vehicleService.createVehicle(request);
        return HttpResponse.status(HttpStatus.CREATED).body(response);
    }

    @Put("/{id}")
    @Secured({"AGENT"})
    public HttpResponse<VehicleResponse> updateVehicle(@PathVariable String id,
                                                       @Valid @Body CreateVehicleRequest request) {
        return HttpResponse.ok(vehicleService.updateVehicle(id, request));
    }

    @Delete("/{id}")
    @Secured({"AGENT"})
    public HttpResponse<Void> deleteVehicle(@PathVariable String id) {
        vehicleService.deleteVehicle(id);
        return HttpResponse.noContent();
    }
}
