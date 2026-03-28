package com.rentacar.service;

import com.rentacar.dto.response.ClientResponse;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.Client;
import com.rentacar.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public ClientResponse getClientById(String id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        return toResponse(client);
    }

    public ClientResponse updateClient(String id, Client updates) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        if (updates.getName() != null) client.setName(updates.getName());
        if (updates.getAddress() != null) client.setAddress(updates.getAddress());
        if (updates.getProfession() != null) client.setProfession(updates.getProfession());
        if (updates.getEmployers() != null) client.setEmployers(updates.getEmployers());
        client.setUpdatedAt(LocalDateTime.now());

        client = clientRepository.save(client);
        return toResponse(client);
    }

    public Client getClientEntity(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }

    private ClientResponse toResponse(Client client) {
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
}
