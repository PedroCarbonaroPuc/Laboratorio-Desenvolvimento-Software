package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.RedemptionResponse;
import br.com.labdevsoft.moeda.exception.BusinessException;
import br.com.labdevsoft.moeda.model.Benefit;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.repository.StudentRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedemptionService {

    private final StudentRepository studentRepository;
    private final BenefitService benefitService;
    private final PartnerService partnerService;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

    public RedemptionResponse redeem(String studentId, String benefitId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException("Aluno nao encontrado para resgate."));

        Benefit benefit = benefitService.getEntityById(benefitId);
        if (!benefit.isActive()) {
            throw new BusinessException("A vantagem selecionada nao esta ativa.");
        }

        PartnerCompany partner = partnerService.getEntityById(benefit.getPartnerId());

        if (student.getBalance() < benefit.getCostCoins()) {
            throw new BusinessException("Saldo insuficiente para resgatar esta vantagem.");
        }

        student.setBalance(student.getBalance() - benefit.getCostCoins());
        student.setUpdatedAt(Instant.now());
        studentRepository.save(student);

        String couponCode = generateCouponCode();
        transactionService.recordRedemption(student, partner, benefit, benefit.getCostCoins(), couponCode);

        notificationService.notifyRedemptionToStudent(
                student.getEmail(),
                student.getName(),
                benefit.getTitle(),
                couponCode,
                benefit.getCostCoins());

        notificationService.notifyRedemptionToPartner(
                partner.getEmail(),
                partner.getCompanyName(),
                student.getName(),
                benefit.getTitle(),
                couponCode);

        return new RedemptionResponse(
                couponCode,
                benefit.getId(),
                benefit.getTitle(),
                partner.getCompanyName(),
                benefit.getCostCoins(),
                student.getBalance(),
                Instant.now());
    }

    private String generateCouponCode() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();
    }
}
