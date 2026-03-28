package com.rentacar.service;

import com.rentacar.dto.response.*;
import com.rentacar.exception.BusinessException;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.Admin;
import com.rentacar.model.Agent;
import com.rentacar.model.Client;
import com.rentacar.model.User;
import com.rentacar.model.enums.OrderStatus;
import com.rentacar.model.enums.UserRole;
import com.rentacar.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AgentRepository agentRepository;
    private final AdminRepository adminRepository;
    private final VehicleRepository vehicleRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final RentalOrderService rentalOrderService;
    private final VehicleService vehicleService;

    public AdminService(UserRepository userRepository, ClientRepository clientRepository,
                        AgentRepository agentRepository, AdminRepository adminRepository,
                        VehicleRepository vehicleRepository, RentalOrderRepository rentalOrderRepository,
                        RentalOrderService rentalOrderService, VehicleService vehicleService) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.agentRepository = agentRepository;
        this.adminRepository = adminRepository;
        this.vehicleRepository = vehicleRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.rentalOrderService = rentalOrderService;
        this.vehicleService = vehicleService;
    }

    public AdminResponse getAdminProfile(String adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));
        return toAdminResponse(admin);
    }

    public AdminResponse updateAdmin(String id, Admin updates) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));

        if (updates.getName() != null) admin.setName(updates.getName());
        admin.setUpdatedAt(LocalDateTime.now());

        admin = adminRepository.save(admin);
        return toAdminResponse(admin);
    }

    public AdminDashboardResponse getDashboard() {
        List<UserSummaryResponse> users = new ArrayList<>();

        // Query users by role to avoid cross-collection type issues
        userRepository.findByRole(UserRole.CLIENT).forEach(user -> {
            Client client = clientRepository.findById(user.getId()).orElse(null);
            users.add(UserSummaryResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(client != null ? client.getName() : "")
                    .role(UserRole.CLIENT.name())
                    .createdAt(user.getCreatedAt())
                    .build());
        });

        userRepository.findByRole(UserRole.AGENT).forEach(user -> {
            Agent agent = agentRepository.findById(user.getId()).orElse(null);
            users.add(UserSummaryResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(agent != null ? agent.getCompanyName() : "")
                    .role(UserRole.AGENT.name())
                    .createdAt(user.getCreatedAt())
                    .build());
        });

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
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        List<RentalOrderResponse> orders = rentalOrderService.getClientOrders(clientId);

        return AdminClientDetailResponse.builder()
                .client(toClientResponse(client))
                .orders(orders)
                .build();
    }

    public AdminAgentDetailResponse getAgentDetail(String agentId) {
        User user = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));
        if (user.getRole() != UserRole.AGENT) {
            throw new ResourceNotFoundException("Agente não encontrado");
        }
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));

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
                .agent(toAgentResponse(agent))
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

    private AdminResponse toAdminResponse(Admin admin) {
        return AdminResponse.builder()
                .id(admin.getId())
                .email(admin.getEmail())
                .name(admin.getName())
                .createdAt(admin.getCreatedAt())
                .build();
    }

    private ClientResponse toClientResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .email(client.getEmail())
                .name(client.getName())
                .rg(client.getRg())
                .cpf(client.getCpf())
                .address(client.getAddress())
                .profession(client.getProfession())
                .employers(client.getEmployers())
                .totalIncome(client.getTotalIncome())
                .createdAt(client.getCreatedAt())
                .build();
    }

    private AgentResponse toAgentResponse(Agent agent) {
        return AgentResponse.builder()
                .id(agent.getId())
                .email(agent.getEmail())
                .companyName(agent.getCompanyName())
                .cnpj(agent.getCnpj())
                .address(agent.getAddress())
                .phone(agent.getPhone())
                .createdAt(agent.getCreatedAt())
                .build();
    }
}
