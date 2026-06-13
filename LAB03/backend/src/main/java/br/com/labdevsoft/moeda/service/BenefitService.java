package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.BenefitCreateRequest;
import br.com.labdevsoft.moeda.dto.BenefitResponse;
import br.com.labdevsoft.moeda.dto.BenefitUpdateRequest;
import br.com.labdevsoft.moeda.exception.ForbiddenOperationException;
import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.Benefit;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.repository.BenefitRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class BenefitService {

    private final BenefitRepository benefitRepository;
    private final PartnerService partnerService;

    public BenefitResponse create(String partnerId, BenefitCreateRequest request) {
        PartnerCompany partner = partnerService.getEntityById(partnerId);
        Benefit benefit = Benefit.builder()
                .partnerId(partnerId)
                .title(request.title().trim())
                .description(request.description().trim())
                .imageUrl(request.imageUrl().trim())
                .costCoins(request.costCoins())
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return toResponse(benefitRepository.save(benefit), partner.getCompanyName());
    }

    public List<BenefitResponse> listPublicCatalog() {
        return benefitRepository.findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<BenefitResponse> listByPartner(String partnerId) {
        return benefitRepository.findByPartnerIdOrderByCreatedAtDesc(partnerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BenefitResponse getById(String benefitId) {
        return toResponse(getEntityById(benefitId));
    }

    public Benefit getEntityById(String benefitId) {
        return benefitRepository.findById(benefitId)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem nao encontrada."));
    }

    public BenefitResponse update(String partnerId, String benefitId, BenefitUpdateRequest request) {
        Benefit benefit = getEntityById(benefitId);
        assertOwnership(partnerId, benefit);

        if (StringUtils.hasText(request.title())) {
            benefit.setTitle(request.title().trim());
        }
        if (StringUtils.hasText(request.description())) {
            benefit.setDescription(request.description().trim());
        }
        if (StringUtils.hasText(request.imageUrl())) {
            benefit.setImageUrl(request.imageUrl().trim());
        }
        if (request.costCoins() != null && request.costCoins() > 0) {
            benefit.setCostCoins(request.costCoins());
        }
        if (request.active() != null) {
            benefit.setActive(request.active());
        }

        benefit.setUpdatedAt(Instant.now());
        return toResponse(benefitRepository.save(benefit));
    }

    public void delete(String partnerId, String benefitId) {
        Benefit benefit = getEntityById(benefitId);
        assertOwnership(partnerId, benefit);
        benefitRepository.deleteById(benefitId);
    }

    public BenefitResponse toResponse(Benefit benefit) {
        PartnerCompany partner = partnerService.getEntityById(benefit.getPartnerId());
        return toResponse(benefit, partner.getCompanyName());
    }

    private BenefitResponse toResponse(Benefit benefit, String partnerName) {
        return new BenefitResponse(
                benefit.getId(),
                benefit.getPartnerId(),
                partnerName,
                benefit.getTitle(),
                benefit.getDescription(),
                benefit.getImageUrl(),
                benefit.getCostCoins(),
                benefit.isActive());
    }

    private void assertOwnership(String partnerId, Benefit benefit) {
        if (!benefit.getPartnerId().equals(partnerId)) {
            throw new ForbiddenOperationException("Operacao permitida apenas para o parceiro dono da vantagem.");
        }
    }
}
