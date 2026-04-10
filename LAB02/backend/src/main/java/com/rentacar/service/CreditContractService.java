package com.rentacar.service;

import com.rentacar.dto.request.CreateCreditContractRequest;
import com.rentacar.dto.response.CreditContractResponse;
import com.rentacar.exception.BusinessException;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.CreditContract;
import com.rentacar.model.RentalOrder;
import com.rentacar.model.enums.ContractStatus;
import com.rentacar.model.enums.OrderStatus;
import com.rentacar.repository.CreditContractRepository;
import com.rentacar.repository.RentalOrderRepository;
import jakarta.inject.Singleton;
import java.time.LocalDateTime;

@Singleton
public class CreditContractService {

    private final CreditContractRepository creditContractRepository;
    private final RentalOrderRepository rentalOrderRepository;

    public CreditContractService(CreditContractRepository creditContractRepository,
                                 RentalOrderRepository rentalOrderRepository) {
        this.creditContractRepository = creditContractRepository;
        this.rentalOrderRepository = rentalOrderRepository;
    }

    public CreditContractResponse createContract(CreateCreditContractRequest request) {
        RentalOrder order = rentalOrderRepository.findById(request.getRentalOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado"));

        if (order.getStatus() != OrderStatus.APPROVED) {
            throw new BusinessException("Contrato de crédito só pode ser criado para pedidos aprovados");
        }

        if (order.getCreditContractId() != null) {
            throw new BusinessException("Pedido já possui contrato de crédito associado");
        }

        CreditContract contract = CreditContract.builder()
                .rentalOrderId(request.getRentalOrderId())
                .bankAgentId(request.getBankAgentId())
                .clientId(order.getClientId())
                .amount(request.getAmount())
                .interestRate(request.getInterestRate())
                .installments(request.getInstallments())
                .status(ContractStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        contract.calculateInstallmentAmount();
        contract = creditContractRepository.save(contract);

        order.setCreditContractId(contract.getId());
        rentalOrderRepository.update(order);

        return toResponse(contract);
    }

    public CreditContractResponse getContractById(String id) {
        CreditContract contract = creditContractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato não encontrado"));
        return toResponse(contract);
    }

    public CreditContractResponse getContractByOrderId(String orderId) {
        CreditContract contract = creditContractRepository.findByRentalOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato não encontrado para este pedido"));
        return toResponse(contract);
    }

    private CreditContractResponse toResponse(CreditContract contract) {
        return CreditContractResponse.builder()
                .id(contract.getId())
                .rentalOrderId(contract.getRentalOrderId())
                .bankAgentId(contract.getBankAgentId())
                .clientId(contract.getClientId())
                .amount(contract.getAmount())
                .interestRate(contract.getInterestRate())
                .installments(contract.getInstallments())
                .installmentAmount(contract.getInstallmentAmount())
                .status(contract.getStatus())
                .createdAt(contract.getCreatedAt())
                .build();
    }
}
