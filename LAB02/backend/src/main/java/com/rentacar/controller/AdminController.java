package com.rentacar.controller;

import com.rentacar.dto.response.*;
import com.rentacar.model.User;
import com.rentacar.service.AdminService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;

@Controller("/api/admin")
@Secured({"ADMIN"})
@ExecuteOn(TaskExecutors.IO)
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Get("/me")
    public HttpResponse<AdminResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return HttpResponse.ok(adminService.getAdminProfile(userId));
    }

    @Put("/me")
    public HttpResponse<AdminResponse> updateMyProfile(Authentication authentication,
                                                       @Body User updates) {
        String userId = authentication.getName();
        return HttpResponse.ok(adminService.updateAdmin(userId, updates));
    }

    @Get("/dashboard")
    public HttpResponse<AdminDashboardResponse> getDashboard() {
        return HttpResponse.ok(adminService.getDashboard());
    }

    @Get("/clients/{id}")
    public HttpResponse<AdminClientDetailResponse> getClientDetail(@PathVariable String id) {
        return HttpResponse.ok(adminService.getClientDetail(id));
    }

    @Get("/agents/{id}")
    public HttpResponse<AdminAgentDetailResponse> getAgentDetail(@PathVariable String id) {
        return HttpResponse.ok(adminService.getAgentDetail(id));
    }

    @Delete("/users/{id}")
    public HttpResponse<Void> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return HttpResponse.noContent();
    }
}
