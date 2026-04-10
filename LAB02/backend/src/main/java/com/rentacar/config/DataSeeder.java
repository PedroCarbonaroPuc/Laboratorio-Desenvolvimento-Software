package com.rentacar.config;

import com.rentacar.model.*;
import com.rentacar.model.enums.OrderStatus;
import com.rentacar.model.enums.OwnerType;
import com.rentacar.model.enums.UserRole;
import com.rentacar.repository.*;
import com.rentacar.security.PasswordEncoder;
import io.micronaut.context.event.StartupEvent;
import io.micronaut.runtime.event.annotation.EventListener;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Singleton
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      VehicleRepository vehicleRepository,
                      RentalOrderRepository rentalOrderRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener
    public void onStartup(StartupEvent event) {
        if (userRepository.count() > 0) {
            log.info("╔══════════════════════════════════════════════════════╗");
            log.info("║  Banco de dados já possui dados. Seed ignorado.     ║");
            log.info("╚══════════════════════════════════════════════════════╝");
            logCredentials();
            return;
        }

        log.info("Iniciando seed do banco de dados...");

        String agentPassword = "agent123";
        String clientPassword = "client123";
        String adminPassword = "admin123";

        // ── Admin (Dono da empresa) ──────────────────────────────
        User admin = User.builder()
                .email("admin@rentacar.com")
                .password(passwordEncoder.encode(adminPassword))
                .role(UserRole.ADMIN)
                .name("Administrador Geral")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(admin);

        // ── Agent (Empresa) ──────────────────────────────────────
        User agent = User.builder()
                .email("empresa@rentacar.com")
                .password(passwordEncoder.encode(agentPassword))
                .role(UserRole.AGENT)
                .companyName("RentaCar Veículos Ltda")
                .cnpj("12345678000199")
                .address(Address.builder()
                        .street("Avenida Paulista")
                        .number("1000")
                        .complement("Sala 501")
                        .neighborhood("Bela Vista")
                        .city("São Paulo")
                        .state("SP")
                        .zipCode("01310100")
                        .build())
                .phone("11999990001")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        agent = userRepository.save(agent);

        // ── Client (Pessoa Física) ───────────────────────────────
        Employer employer1 = Employer.builder()
                .name("Tech Solutions SA")
                .phone("11988887777")
                .income(new BigDecimal("8500.00"))
                .build();

        Employer employer2 = Employer.builder()
                .name("Freelancer Digital")
                .phone("11977776666")
                .income(new BigDecimal("3500.00"))
                .build();

        User client = User.builder()
                .email("cliente@rentacar.com")
                .password(passwordEncoder.encode(clientPassword))
                .role(UserRole.CLIENT)
                .name("João da Silva")
                .cpf("12345678901")
                .rg("MG12345678")
                .address(Address.builder()
                        .street("Rua das Flores")
                        .number("250")
                        .complement("Apto 32")
                        .neighborhood("Centro")
                        .city("Belo Horizonte")
                        .state("MG")
                        .zipCode("30130000")
                        .build())
                .profession("Engenheiro de Software")
                .employers(List.of(employer1, employer2))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        client = userRepository.save(client);

        // ── Veículos (10 unidades) ───────────────────────────────
        Vehicle v1 = createVehicle("REG-001", 2023, "Toyota", "Corolla Cross", "ABC1D23", OwnerType.COMPANY, agent.getId(), new BigDecimal("189.90"));
        Vehicle v2 = createVehicle("REG-002", 2024, "Honda", "Civic", "DEF4G56", OwnerType.COMPANY, agent.getId(), new BigDecimal("169.90"));
        Vehicle v3 = createVehicle("REG-003", 2023, "Volkswagen", "T-Cross", "GHI7J89", OwnerType.COMPANY, agent.getId(), new BigDecimal("159.90"));
        Vehicle v4 = createVehicle("REG-004", 2024, "Chevrolet", "Onix Plus", "JKL0M12", OwnerType.COMPANY, agent.getId(), new BigDecimal("119.90"));
        Vehicle v5 = createVehicle("REG-005", 2023, "Hyundai", "HB20S", "NOP3Q45", OwnerType.COMPANY, agent.getId(), new BigDecimal("109.90"));
        Vehicle v6 = createVehicle("REG-006", 2024, "Fiat", "Pulse", "RST6U78", OwnerType.COMPANY, agent.getId(), new BigDecimal("139.90"));
        Vehicle v7 = createVehicle("REG-007", 2023, "Jeep", "Renegade", "VWX9Y01", OwnerType.COMPANY, agent.getId(), new BigDecimal("219.90"));
        Vehicle v8 = createVehicle("REG-008", 2024, "Nissan", "Kicks", "ZAB2C34", OwnerType.COMPANY, agent.getId(), new BigDecimal("179.90"));
        createVehicle("REG-009", 2023, "Renault", "Kwid", "DEF5G67", OwnerType.COMPANY, agent.getId(), new BigDecimal("89.90"));
        createVehicle("REG-010", 2024, "BMW", "X1", "HIJ8K90", OwnerType.COMPANY, agent.getId(), new BigDecimal("349.90"));

        // ── Pedidos de aluguel (2 ativos para o cliente) ─────────

        // Pedido 1 — ACTIVE (Corolla Cross)
        v1.setAvailable(false);
        vehicleRepository.update(v1);

        RentalOrder order1 = RentalOrder.builder()
                .clientId(client.getId())
                .vehicleId(v1.getId())
                .startDate(LocalDate.now().minusDays(5))
                .endDate(LocalDate.now().plusDays(10))
                .status(OrderStatus.ACTIVE)
                .financialAnalysis(FinancialAnalysis.builder()
                        .agentId(agent.getId())
                        .approved(true)
                        .notes("Cliente com renda compatível. Aprovado.")
                        .analyzedAt(LocalDateTime.now().minusDays(6))
                        .build())
                .createdAt(LocalDateTime.now().minusDays(7))
                .updatedAt(LocalDateTime.now().minusDays(5))
                .build();
        order1.calculateTotalAmount(v1.getDailyRate());
        rentalOrderRepository.save(order1);

        // Pedido 2 — ACTIVE (Civic)
        v2.setAvailable(false);
        vehicleRepository.update(v2);

        RentalOrder order2 = RentalOrder.builder()
                .clientId(client.getId())
                .vehicleId(v2.getId())
                .startDate(LocalDate.now().minusDays(2))
                .endDate(LocalDate.now().plusDays(5))
                .status(OrderStatus.ACTIVE)
                .financialAnalysis(FinancialAnalysis.builder()
                        .agentId(agent.getId())
                        .approved(true)
                        .notes("Segundo aluguel aprovado conforme histórico.")
                        .analyzedAt(LocalDateTime.now().minusDays(3))
                        .build())
                .createdAt(LocalDateTime.now().minusDays(4))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build();
        order2.calculateTotalAmount(v2.getDailyRate());
        rentalOrderRepository.save(order2);

        // ── Log de credenciais ───────────────────────────────────
        logCredentials();
    }

    private void logCredentials() {
        log.info("");
        log.info("╔══════════════════════════════════════════════════════════════╗");
        log.info("║             🚗  RENTACAR — CREDENCIAIS PADRÃO              ║");
        log.info("╠══════════════════════════════════════════════════════════════╣");
        log.info("║                                                              ║");
        log.info("║  🔑 ADMIN GERAL (Dono da Empresa)                           ║");
        log.info("║     E-mail: admin@rentacar.com                               ║");
        log.info("║     Senha:  admin123                                         ║");
        log.info("║                                                              ║");
        log.info("║  👔 AGENTE (Empresa)                                         ║");
        log.info("║     E-mail: empresa@rentacar.com                             ║");
        log.info("║     Senha:  agent123                                         ║");
        log.info("║     CNPJ:   12.345.678/0001-99                               ║");
        log.info("║                                                              ║");
        log.info("║  👤 CLIENTE (Pessoa Física)                                  ║");
        log.info("║     E-mail: cliente@rentacar.com                             ║");
        log.info("║     Senha:  client123                                        ║");
        log.info("║     CPF:    123.456.789-01                                   ║");
        log.info("║                                                              ║");
        log.info("╚══════════════════════════════════════════════════════════════╝");
        log.info("");
    }

    private Vehicle createVehicle(String regNumber, int year, String brand, String model,
                                  String plate, OwnerType ownerType, String ownerId, BigDecimal dailyRate) {
        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(regNumber)
                .year(year)
                .brand(brand)
                .model(model)
                .licensePlate(plate)
                .ownerType(ownerType)
                .ownerId(ownerId)
                .dailyRate(dailyRate)
                .available(true)
                .createdAt(LocalDateTime.now())
                .build();
        return vehicleRepository.save(vehicle);
    }
}
