package com.rentacar.service;

import com.rentacar.dto.response.AgentResponse;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.User;
import com.rentacar.repository.UserRepository;
import jakarta.inject.Singleton;

import java.time.LocalDateTime;

@Singleton
public class AgentService {

    private final UserRepository userRepository;

    public AgentService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AgentResponse getAgentById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));
        return toResponse(user);
    }

    public AgentResponse updateAgent(String id, User updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));

        if (updates.getCompanyName() != null) user.setCompanyName(updates.getCompanyName());
        if (updates.getAddress() != null) user.setAddress(updates.getAddress());
        if (updates.getPhone() != null) user.setPhone(updates.getPhone());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.update(user);
        return toResponse(user);
    }

    private AgentResponse toResponse(User user) {
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
