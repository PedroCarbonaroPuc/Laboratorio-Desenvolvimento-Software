package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.AuthResponse;
import br.com.labdevsoft.moeda.dto.CurrentUserResponse;
import br.com.labdevsoft.moeda.dto.LoginRequest;
import br.com.labdevsoft.moeda.exception.BusinessException;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.model.SessionToken;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.repository.PartnerCompanyRepository;
import br.com.labdevsoft.moeda.repository.ProfessorRepository;
import br.com.labdevsoft.moeda.repository.SessionTokenRepository;
import br.com.labdevsoft.moeda.repository.StudentRepository;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final PartnerCompanyRepository partnerCompanyRepository;
    private final SessionTokenRepository sessionTokenRepository;
    private final SemesterAllocationService semesterAllocationService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.token-hours:24}")
    private long tokenHours;

    public AuthResponse login(LoginRequest request) {
        Instant now = Instant.now();
        sessionTokenRepository.deleteByExpiresAtBefore(now);

        return switch (request.role()) {
            case STUDENT -> loginStudent(request, now);
            case PROFESSOR -> loginProfessor(request, now);
            case PARTNER -> loginPartner(request, now);
        };
    }

    public void logout(String bearerToken) {
        String token = extractTokenValue(bearerToken);
        if (StringUtils.hasText(token)) {
            sessionTokenRepository.deleteByToken(token);
        }
    }

    public CurrentUserResponse currentUser(AuthenticatedUser authenticatedUser) {
        return switch (authenticatedUser.role()) {
            case STUDENT -> {
                Student student = studentRepository.findById(authenticatedUser.userId())
                        .orElseThrow(() -> new BusinessException("Aluno nao encontrado."));
                yield new CurrentUserResponse(Role.STUDENT, student.getId(), student.getName(), student.getEmail(), student.getBalance());
            }
            case PROFESSOR -> {
                Professor professor = professorRepository.findById(authenticatedUser.userId())
                        .orElseThrow(() -> new BusinessException("Professor nao encontrado."));
                semesterAllocationService.ensureProfessorAllowance(professor);
                Professor refreshedProfessor = professorRepository.findById(authenticatedUser.userId())
                        .orElseThrow(() -> new BusinessException("Professor nao encontrado."));
                yield new CurrentUserResponse(
                        Role.PROFESSOR,
                        refreshedProfessor.getId(),
                        refreshedProfessor.getName(),
                        refreshedProfessor.getEmail(),
                        refreshedProfessor.getBalance());
            }
            case PARTNER -> {
                PartnerCompany partner = partnerCompanyRepository.findById(authenticatedUser.userId())
                        .orElseThrow(() -> new BusinessException("Parceiro nao encontrado."));
                yield new CurrentUserResponse(Role.PARTNER, partner.getId(), partner.getCompanyName(), partner.getEmail(), 0L);
            }
        };
    }

    private AuthResponse loginStudent(LoginRequest request, Instant now) {
        Student student = studentRepository.findByEmailIgnoreCase(request.login().trim())
                .orElseThrow(() -> new BusinessException("Credenciais invalidas para aluno."));

        validatePassword(request.password(), student.getPasswordHash());
        SessionToken token = createToken(Role.STUDENT, student.getId(), now);

        return new AuthResponse(
                token.getToken(),
                Role.STUDENT,
                student.getId(),
                student.getName(),
                token.getExpiresAt());
    }

    private AuthResponse loginProfessor(LoginRequest request, Instant now) {
        String login = request.login().trim();
        Professor professor = login.contains("@")
                ? professorRepository.findByEmailIgnoreCase(login)
                        .orElseThrow(() -> new BusinessException("Credenciais invalidas para professor."))
                : professorRepository.findByCpf(login)
                        .orElseThrow(() -> new BusinessException("Credenciais invalidas para professor."));

        validatePassword(request.password(), professor.getPasswordHash());
        semesterAllocationService.ensureProfessorAllowance(professor);

        SessionToken token = createToken(Role.PROFESSOR, professor.getId(), now);
        return new AuthResponse(
                token.getToken(),
                Role.PROFESSOR,
                professor.getId(),
                professor.getName(),
                token.getExpiresAt());
    }

    private AuthResponse loginPartner(LoginRequest request, Instant now) {
        String login = request.login().trim();
        PartnerCompany partner = login.contains("@")
                ? partnerCompanyRepository.findByEmailIgnoreCase(login)
                        .orElseThrow(() -> new BusinessException("Credenciais invalidas para parceiro."))
                : partnerCompanyRepository.findByCnpj(login)
                        .orElseThrow(() -> new BusinessException("Credenciais invalidas para parceiro."));

        validatePassword(request.password(), partner.getPasswordHash());

        SessionToken token = createToken(Role.PARTNER, partner.getId(), now);
        return new AuthResponse(
                token.getToken(),
                Role.PARTNER,
                partner.getId(),
                partner.getCompanyName(),
                token.getExpiresAt());
    }

    private SessionToken createToken(Role role, String userId, Instant now) {
        SessionToken sessionToken = SessionToken.builder()
                .token(UUID.randomUUID().toString().replace("-", ""))
                .role(role)
                .userId(userId)
                .createdAt(now)
                .expiresAt(now.plus(tokenHours, ChronoUnit.HOURS))
                .build();

        return sessionTokenRepository.save(sessionToken);
    }

    private void validatePassword(String rawPassword, String encodedPassword) {
        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {
            throw new BusinessException("Credenciais invalidas.");
        }
    }

    private String extractTokenValue(String bearerToken) {
        if (!StringUtils.hasText(bearerToken)) {
            return null;
        }

        if (bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }

        return bearerToken.trim();
    }
}
