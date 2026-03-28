package com.rentacar.service;

import com.rentacar.dto.response.AgentResponse;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.Agent;
import com.rentacar.repository.AgentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AgentService {

    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public AgentResponse getAgentById(String id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));
        return toResponse(agent);
    }

    public AgentResponse updateAgent(String id, Agent updates) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado"));

        if (updates.getCompanyName() != null) agent.setCompanyName(updates.getCompanyName());
        if (updates.getAddress() != null) agent.setAddress(updates.getAddress());
        if (updates.getPhone() != null) agent.setPhone(updates.getPhone());
        agent.setUpdatedAt(LocalDateTime.now());

        agent = agentRepository.save(agent);
        return toResponse(agent);
    }

    private AgentResponse toResponse(Agent agent) {
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
