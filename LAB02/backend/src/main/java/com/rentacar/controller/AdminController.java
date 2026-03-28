package com.rentacar.controller;

import com.rentacar.dto.response.*;
import com.rentacar.model.Admin;
import com.rentacar.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/me")
    public ResponseEntity<AdminResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(adminService.getAdminProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<AdminResponse> updateMyProfile(Authentication authentication,
                                                         @RequestBody Admin updates) {
        String userId = authentication.getName();
        return ResponseEntity.ok(adminService.updateAdmin(userId, updates));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<AdminClientDetailResponse> getClientDetail(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getClientDetail(id));
    }

    @GetMapping("/agents/{id}")
    public ResponseEntity<AdminAgentDetailResponse> getAgentDetail(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getAgentDetail(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
