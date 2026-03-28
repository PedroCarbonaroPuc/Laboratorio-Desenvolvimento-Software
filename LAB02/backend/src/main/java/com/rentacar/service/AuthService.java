package com.rentacar.service;

import com.rentacar.dto.request.LoginRequest;
import com.rentacar.dto.request.RegisterAgentRequest;
import com.rentacar.dto.request.RegisterClientRequest;
import com.rentacar.dto.response.AuthResponse;
import com.rentacar.exception.BusinessException;
import com.rentacar.model.Admin;
import com.rentacar.model.Agent;
import com.rentacar.model.Client;
import com.rentacar.model.User;
import com.rentacar.model.enums.UserRole;
import com.rentacar.repository.AdminRepository;
import com.rentacar.repository.AgentRepository;
import com.rentacar.repository.ClientRepository;
import com.rentacar.repository.UserRepository;
import com.rentacar.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AgentRepository agentRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, ClientRepository clientRepository,
                       AgentRepository agentRepository, AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.agentRepository = agentRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse registerClient(RegisterClientRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("E-mail já cadastrado");
        }
        if (clientRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }

        Client client = Client.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CLIENT)
                .name(request.getName())
                .cpf(request.getCpf())
                .rg(request.getRg())
                .address(request.getAddress())
                .profession(request.getProfession())
                .employers(request.getEmployers() != null ? request.getEmployers() : new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        client = clientRepository.save(client);

        String token = jwtTokenProvider.generateToken(client.getId(), UserRole.CLIENT.name());

        return AuthResponse.builder()
                .token(token)
                .role(UserRole.CLIENT.name())
                .userId(client.getId())
                .name(client.getName())
                .build();
    }

    public AuthResponse registerAgent(RegisterAgentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("E-mail já cadastrado");
        }
        if (agentRepository.existsByCnpj(request.getCnpj())) {
            throw new BusinessException("CNPJ já cadastrado");
        }

        Agent agent = Agent.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.AGENT)
                .companyName(request.getCompanyName())
                .cnpj(request.getCnpj())
                .address(request.getAddress())
                .phone(request.getPhone())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        agent = agentRepository.save(agent);

        String token = jwtTokenProvider.generateToken(agent.getId(), UserRole.AGENT.name());

        return AuthResponse.builder()
                .token(token)
                .role(UserRole.AGENT.name())
                .userId(agent.getId())
                .name(agent.getCompanyName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException("Credenciais inválidas");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole().name());

        String name = "";
        if (user.getRole() == UserRole.CLIENT) {
            name = clientRepository.findById(user.getId())
                    .map(Client::getName)
                    .orElse("");
        } else if (user.getRole() == UserRole.AGENT) {
            name = agentRepository.findById(user.getId())
                    .map(Agent::getCompanyName)
                    .orElse("");
        } else if (user.getRole() == UserRole.ADMIN) {
            name = adminRepository.findById(user.getId())
                    .map(Admin::getName)
                    .orElse("");
        }

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .name(name)
                .build();
    }
}
