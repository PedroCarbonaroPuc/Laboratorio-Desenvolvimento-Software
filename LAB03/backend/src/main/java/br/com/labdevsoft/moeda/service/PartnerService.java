package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.CurrentUserResponse;
import br.com.labdevsoft.moeda.dto.PartnerRegistrationRequest;
import br.com.labdevsoft.moeda.dto.PartnerResponse;
import br.com.labdevsoft.moeda.dto.PartnerUpdateRequest;
import br.com.labdevsoft.moeda.exception.BusinessException;
import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.repository.PartnerCompanyRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerCompanyRepository partnerCompanyRepository;
    private final PasswordEncoder passwordEncoder;

    public PartnerResponse register(PartnerRegistrationRequest request) {
        validatePartnerUniqueness(request.email(), request.cnpj());

        PartnerCompany partner = PartnerCompany.builder()
                .companyName(request.companyName().trim())
                .contactName(request.contactName().trim())
                .email(request.email().trim().toLowerCase())
                .cnpj(request.cnpj().trim())
                .address(request.address().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(partnerCompanyRepository.save(partner));
    }

    public List<PartnerResponse> listAll() {
        return partnerCompanyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PartnerResponse getById(String partnerId) {
        return toResponse(getEntityById(partnerId));
    }

    public PartnerCompany getEntityById(String partnerId) {
        return partnerCompanyRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa parceira nao encontrada."));
    }

    public PartnerResponse update(String partnerId, PartnerUpdateRequest request) {
        PartnerCompany partner = getEntityById(partnerId);

        if (StringUtils.hasText(request.companyName())) {
            partner.setCompanyName(request.companyName().trim());
        }
        if (StringUtils.hasText(request.contactName())) {
            partner.setContactName(request.contactName().trim());
        }
        if (StringUtils.hasText(request.address())) {
            partner.setAddress(request.address().trim());
        }
        if (StringUtils.hasText(request.password())) {
            partner.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        partner.setUpdatedAt(Instant.now());
        return toResponse(partnerCompanyRepository.save(partner));
    }

    public void delete(String partnerId) {
        PartnerCompany partner = getEntityById(partnerId);
        partnerCompanyRepository.deleteById(partner.getId());
    }

    public PartnerResponse toResponse(PartnerCompany partner) {
        return new PartnerResponse(
                partner.getId(),
                partner.getCompanyName(),
                partner.getContactName(),
                partner.getEmail(),
                partner.getCnpj(),
                partner.getAddress());
    }

    private void validatePartnerUniqueness(String email, String cnpj) {
        if (partnerCompanyRepository.existsByEmailIgnoreCase(email.trim())) {
            throw new BusinessException("Ja existe parceiro com este email.");
        }
        if (partnerCompanyRepository.existsByCnpj(cnpj.trim())) {
            throw new BusinessException("Ja existe parceiro com este CNPJ.");
        }
    }

}
