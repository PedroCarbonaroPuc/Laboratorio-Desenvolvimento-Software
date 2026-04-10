package com.rentacar.service;

import com.rentacar.dto.request.LoginRequest;
import com.rentacar.dto.request.RegisterAgentRequest;
import com.rentacar.dto.request.RegisterClientRequest;
import com.rentacar.dto.response.AuthResponse;
import com.rentacar.exception.BusinessException;
import com.rentacar.model.User;
import com.rentacar.model.enums.UserRole;
import com.rentacar.repository.UserRepository;
import com.rentacar.security.JwtTokenProvider;
import com.rentacar.security.PasswordEncoder;
import jakarta.inject.Singleton;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Singleton
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse registerClient(RegisterClientRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("E-mail já cadastrado");
        }
        if (userRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }

        User user = User.builder()
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

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), UserRole.CLIENT.name());

        return AuthResponse.builder()
                .token(token)
                .role(UserRole.CLIENT.name())
                .userId(user.getId())
                .name(user.getName())
                .build();
    }

    public AuthResponse registerAgent(RegisterAgentRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("E-mail já cadastrado");
        }
        if (userRepository.existsByCnpj(request.getCnpj())) {
            throw new BusinessException("CNPJ já cadastrado");
        }

        User user = User.builder()
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

        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), UserRole.AGENT.name());

        return AuthResponse.builder()
                .token(token)
                .role(UserRole.AGENT.name())
                .userId(user.getId())
                .name(user.getCompanyName())
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
        if (user.getRole() == UserRole.CLIENT || user.getRole() == UserRole.ADMIN) {
            name = user.getName() != null ? user.getName() : "";
        } else if (user.getRole() == UserRole.AGENT) {
            name = user.getCompanyName() != null ? user.getCompanyName() : "";
        }

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .name(name)
                .build();
    }
}
