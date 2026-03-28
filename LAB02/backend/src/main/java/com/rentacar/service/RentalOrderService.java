package com.rentacar.service;

import com.rentacar.dto.request.CreateRentalOrderRequest;
import com.rentacar.dto.request.FinancialAnalysisRequest;
import com.rentacar.dto.request.UpdateRentalOrderRequest;
import com.rentacar.dto.response.RentalOrderResponse;
import com.rentacar.exception.BusinessException;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.Client;
import com.rentacar.model.FinancialAnalysis;
import com.rentacar.model.RentalOrder;
import com.rentacar.model.Vehicle;
import com.rentacar.model.enums.OrderStatus;
import com.rentacar.repository.RentalOrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RentalOrderService {

    private final RentalOrderRepository rentalOrderRepository;
    private final VehicleService vehicleService;
    private final ClientService clientService;

    public RentalOrderService(RentalOrderRepository rentalOrderRepository,
                              VehicleService vehicleService,
                              ClientService clientService) {
        this.rentalOrderRepository = rentalOrderRepository;
        this.vehicleService = vehicleService;
        this.clientService = clientService;
    }

    public RentalOrderResponse createOrder(String clientId, CreateRentalOrderRequest request) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new BusinessException("Data de término deve ser posterior à data de início");
        }

        Vehicle vehicle = vehicleService.getVehicleEntity(request.getVehicleId());
        if (!vehicle.getAvailable()) {
            throw new BusinessException("Veículo não está disponível para aluguel");
        }

        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PENDING, OrderStatus.UNDER_ANALYSIS, OrderStatus.APPROVED, OrderStatus.ACTIVE);
        List<RentalOrder> conflicting = rentalOrderRepository
                .findByVehicleIdAndStatusIn(request.getVehicleId(), activeStatuses);
        if (!conflicting.isEmpty()) {
            throw new BusinessException("Veículo já possui pedido ativo");
        }

        RentalOrder order = RentalOrder.builder()
                .clientId(clientId)
                .vehicleId(request.getVehicleId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        order.calculateTotalAmount(vehicle.getDailyRate());
        vehicleService.setVehicleAvailability(vehicle.getId(), false);

        order = rentalOrderRepository.save(order);
        return toResponse(order);
    }

    public List<RentalOrderResponse> getClientOrders(String clientId) {
        return rentalOrderRepository.findByClientId(clientId).stream()
                .map(this::toResponse)
                .toList();
    }

    public RentalOrderResponse getOrderById(String orderId) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));
        return toResponse(order);
    }

    public RentalOrderResponse updateOrder(String orderId, String userId, UpdateRentalOrderRequest request) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Apenas pedidos pendentes podem ser modificados");
        }

        if (request.getVehicleId() != null && !request.getVehicleId().equals(order.getVehicleId())) {
            vehicleService.setVehicleAvailability(order.getVehicleId(), true);
            Vehicle newVehicle = vehicleService.getVehicleEntity(request.getVehicleId());
            if (!newVehicle.getAvailable()) {
                vehicleService.setVehicleAvailability(order.getVehicleId(), false);
                throw new BusinessException("Novo veículo não está disponível");
            }
            vehicleService.setVehicleAvailability(newVehicle.getId(), false);
            order.setVehicleId(request.getVehicleId());
        }

        if (request.getStartDate() != null) order.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) order.setEndDate(request.getEndDate());

        if (order.getEndDate() != null && order.getStartDate() != null
                && !order.getEndDate().isAfter(order.getStartDate())) {
            throw new BusinessException("Data de término deve ser posterior à data de início");
        }

        Vehicle vehicle = vehicleService.getVehicleEntity(order.getVehicleId());
        order.calculateTotalAmount(vehicle.getDailyRate());
        order.setUpdatedAt(LocalDateTime.now());

        order = rentalOrderRepository.save(order);
        return toResponse(order);
    }

    public RentalOrderResponse cancelOrder(String orderId, String clientId) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (!order.getClientId().equals(clientId)) {
            throw new BusinessException("Você não tem permissão para cancelar este pedido");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.UNDER_ANALYSIS) {
            throw new BusinessException("Apenas pedidos pendentes ou em análise podem ser cancelados");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        vehicleService.setVehicleAvailability(order.getVehicleId(), true);

        order = rentalOrderRepository.save(order);
        return toResponse(order);
    }

    public List<RentalOrderResponse> getPendingOrders() {
        return rentalOrderRepository.findByStatus(OrderStatus.PENDING).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RentalOrderResponse> getAllOrders() {
        return rentalOrderRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public RentalOrderResponse analyzeOrder(String orderId, String agentId, FinancialAnalysisRequest request) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Apenas pedidos pendentes podem ser analisados");
        }

        FinancialAnalysis analysis = FinancialAnalysis.builder()
                .agentId(agentId)
                .approved(request.getApproved())
                .notes(request.getNotes())
                .analyzedAt(LocalDateTime.now())
                .build();

        order.setFinancialAnalysis(analysis);

        if (request.getApproved()) {
            order.setStatus(OrderStatus.UNDER_ANALYSIS);
        } else {
            order.setStatus(OrderStatus.REJECTED);
            vehicleService.setVehicleAvailability(order.getVehicleId(), true);
        }

        order.setUpdatedAt(LocalDateTime.now());
        order = rentalOrderRepository.save(order);
        return toResponse(order);
    }

    public RentalOrderResponse approveOrder(String orderId) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (order.getStatus() != OrderStatus.UNDER_ANALYSIS) {
            throw new BusinessException("Apenas pedidos em análise podem ser aprovados");
        }

        if (order.getFinancialAnalysis() == null || !order.getFinancialAnalysis().getApproved()) {
            throw new BusinessException("Pedido precisa de análise financeira positiva para ser aprovado");
        }

        order.setStatus(OrderStatus.APPROVED);
        order.setUpdatedAt(LocalDateTime.now());

        order = rentalOrderRepository.save(order);
        return toResponse(order);
    }

    public RentalOrderResponse rejectOrder(String orderId) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.UNDER_ANALYSIS) {
            throw new BusinessException("Apenas pedidos pendentes ou em análise podem ser rejeitados");
        }

        order.setStatus(OrderStatus.REJECTED);
        order.setUpdatedAt(LocalDateTime.now());
        vehicleService.setVehicleAvailability(order.getVehicleId(), true);

        order = rentalOrderRepository.save(order);
        return toResponse(order);
    }

    private RentalOrderResponse toResponse(RentalOrder order) {
        String clientName = "";
        String vehicleDescription = "";

        try {
            Client client = clientService.getClientEntity(order.getClientId());
            clientName = client.getName();
        } catch (Exception ignored) {}

        try {
            Vehicle vehicle = vehicleService.getVehicleEntity(order.getVehicleId());
            vehicleDescription = vehicle.getBrand() + " " + vehicle.getModel() + " (" + vehicle.getLicensePlate() + ")";
        } catch (Exception ignored) {}

        return RentalOrderResponse.builder()
                .id(order.getId())
                .clientId(order.getClientId())
                .clientName(clientName)
                .vehicleId(order.getVehicleId())
                .vehicleDescription(vehicleDescription)
                .startDate(order.getStartDate())
                .endDate(order.getEndDate())
                .rentalDays(order.getRentalDays())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .financialAnalysis(order.getFinancialAnalysis())
                .creditContractId(order.getCreditContractId())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
