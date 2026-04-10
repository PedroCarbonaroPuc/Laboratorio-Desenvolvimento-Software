package com.rentacar.service;

import com.rentacar.dto.response.*;
import com.rentacar.exception.BusinessException;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.User;
import com.rentacar.model.enums.OrderStatus;
import com.rentacar.model.enums.UserRole;
import com.rentacar.repository.*;
import jakarta.inject.Singleton;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Singleton
public class AdminService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final RentalOrderService rentalOrderService;
    private final VehicleService vehicleService;

    public AdminService(UserRepository userRepository,
                        VehicleRepository vehicleRepository, RentalOrderRepository rentalOrderRepository,
                        RentalOrderService rentalOrderService, VehicleService vehicleService) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.rentalOrderService = rentalOrderService;
        this.vehicleService = vehicleService;
    }

    public AdminResponse getAdminProfile(String adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));
        return toAdminResponse(admin);
    }

    public AdminResponse updateAdmin(String id, User updates) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));

        if (updates.getName() != null) admin.setName(updates.getName());
        admin.setUpdatedAt(LocalDateTime.now());

        admin = userRepository.update(admin);
        return toAdminResponse(admin);
    }

    public AdminDashboardResponse getDashboard() {
        List<UserSummaryResponse> users = new ArrayList<>();

        userRepository.findByRole(UserRole.CLIENT).forEach(user ->
            users.add(UserSummaryResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName() != null ? user.getName() : "")
                    .role(UserRole.CLIENT.name())
                    .createdAt(user.getCreatedAt())
                    .build())
        );

        userRepository.findByRole(UserRole.AGENT).forEach(user ->
            users.add(UserSummaryResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getCompanyName() != null ? user.getCompanyName() : "")
                    .role(UserRole.AGENT.name())
                    .createdAt(user.getCreatedAt())
                    .build())
        );

        long activeOrders = rentalOrderRepository.findByStatus(OrderStatus.ACTIVE).size();

        return AdminDashboardResponse.builder()
                .totalClients(userRepository.countByRole(UserRole.CLIENT))
                .totalAgents(userRepository.countByRole(UserRole.AGENT))
                .totalVehicles(vehicleRepository.count())
                .totalOrders(rentalOrderRepository.count())
                .activeOrders(activeOrders)
                .users(users)
                .build();
    }

    public AdminClientDetailResponse getClientDetail(String clientId) {
        User user = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        if (user.getRole() != UserRole.CLIENT) {
            throw new ResourceNotFoundException("Cliente não encontrado");
        }

        List<RentalOrderResponse> orders = rentalOrderService.getClientOrders(clientId);

        return AdminClientDetailResponse.builder()
                .client(toClientResponse(user))
                .orders(orders)
                .build();
    }

    public AdminAgentDetailResponse getAgentDetail(String agentId) {
        User user = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));
        if (user.getRole() != UserRole.AGENT) {
            throw new ResourceNotFoundException("Agente não encontrado");
        }

        List<VehicleResponse> vehicles = vehicleRepository.findByOwnerId(agentId).stream()
                .map(v -> VehicleResponse.builder()
                        .id(v.getId())
                        .registrationNumber(v.getRegistrationNumber())
                        .year(v.getYear())
                        .brand(v.getBrand())
                        .model(v.getModel())
                        .licensePlate(v.getLicensePlate())
                        .ownerType(v.getOwnerType())
                        .ownerId(v.getOwnerId())
                        .dailyRate(v.getDailyRate())
                        .available(v.getAvailable())
                        .createdAt(v.getCreatedAt())
                        .build())
                .toList();

        List<RentalOrderResponse> orders = rentalOrderService.getAllOrders();

        return AdminAgentDetailResponse.builder()
                .agent(toAgentResponse(user))
                .vehicles(vehicles)
                .orders(orders)
                .build();
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (user.getRole() == UserRole.ADMIN) {
            throw new BusinessException("Não é permitido excluir um administrador");
        }

        userRepository.deleteById(userId);
    }

    private AdminResponse toAdminResponse(User admin) {
        return AdminResponse.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .name(admin.getName())
                .createdAt(admin.getCreatedAt())
                .build();
    }

    private ClientResponse toClientResponse(User user) {
        return ClientResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .rg(user.getRg())
                .cpf(user.getCpf())
                .address(user.getAddress())
                .profession(user.getProfession())
                .employers(user.getEmployers())
                .totalIncome(user.getTotalIncome())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private AgentResponse toAgentResponse(User user) {
        return AgentResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .companyName(user.getCompanyName())
                .cnpj(user.getCnpj())
                .address(user.getAddress())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
