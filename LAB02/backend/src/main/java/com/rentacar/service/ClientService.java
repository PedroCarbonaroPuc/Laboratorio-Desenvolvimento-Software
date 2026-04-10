package com.rentacar.service;

import com.rentacar.dto.response.ClientResponse;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.User;
import com.rentacar.repository.UserRepository;
import jakarta.inject.Singleton;

import java.time.LocalDateTime;

@Singleton
public class ClientService {

    private final UserRepository userRepository;

    public ClientService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ClientResponse getClientById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        return toResponse(user);
    }

    public ClientResponse updateClient(String id, User updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getAddress() != null) user.setAddress(updates.getAddress());
        if (updates.getProfession() != null) user.setProfession(updates.getProfession());
        if (updates.getEmployers() != null) user.setEmployers(updates.getEmployers());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.update(user);
        return toResponse(user);
    }

    public User getClientEntity(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }

    private ClientResponse toResponse(User user) {
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
}
