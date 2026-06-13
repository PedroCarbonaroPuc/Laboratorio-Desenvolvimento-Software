package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.TransactionResponse;
import br.com.labdevsoft.moeda.model.Benefit;
import br.com.labdevsoft.moeda.model.CoinTransaction;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.model.enums.TransactionActorType;
import br.com.labdevsoft.moeda.model.enums.TransactionType;
import br.com.labdevsoft.moeda.repository.CoinTransactionRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final CoinTransactionRepository coinTransactionRepository;
    private final StudentService studentService;
    private final ProfessorServiceHelper professorServiceHelper;
    private final PartnerService partnerService;

    public void recordSemesterAllocation(Professor professor, String semesterKey, long amount) {
        CoinTransaction transaction = CoinTransaction.builder()
                .type(TransactionType.SEMESTER_ALLOCATION)
                .amount(amount)
                .description("Credito semestral de moedas")
                .fromActorType(TransactionActorType.SYSTEM)
                .toActorType(TransactionActorType.PROFESSOR)
                .toActorId(professor.getId())
                .professorId(professor.getId())
                .semesterKey(semesterKey)
                .createdAt(Instant.now())
                .build();
        coinTransactionRepository.save(transaction);
    }

    public void recordProfessorTransfer(Professor professor, Student student, long amount, String message) {
        CoinTransaction transaction = CoinTransaction.builder()
                .type(TransactionType.PROFESSOR_TO_STUDENT)
                .amount(amount)
                .description(message)
                .fromActorType(TransactionActorType.PROFESSOR)
                .fromActorId(professor.getId())
                .toActorType(TransactionActorType.STUDENT)
                .toActorId(student.getId())
                .professorId(professor.getId())
                .studentId(student.getId())
                .createdAt(Instant.now())
                .build();
        coinTransactionRepository.save(transaction);
    }

    public void recordRedemption(Student student, PartnerCompany partner, Benefit benefit, long amount, String couponCode) {
        CoinTransaction transaction = CoinTransaction.builder()
                .type(TransactionType.REDEMPTION)
                .amount(amount)
                .description("Resgate de vantagem: " + benefit.getTitle())
                .fromActorType(TransactionActorType.STUDENT)
                .fromActorId(student.getId())
                .toActorType(TransactionActorType.PARTNER)
                .toActorId(partner.getId())
                .studentId(student.getId())
                .partnerId(partner.getId())
                .benefitId(benefit.getId())
                .couponCode(couponCode)
                .createdAt(Instant.now())
                .build();
        coinTransactionRepository.save(transaction);
    }

    public List<TransactionResponse> professorStatement(String professorId) {
        return coinTransactionRepository.findByProfessorIdOrderByCreatedAtDesc(professorId)
                .stream()
                .map(this::toProfessorResponse)
                .toList();
    }

    public List<TransactionResponse> studentStatement(String studentId) {
        return coinTransactionRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(this::toStudentResponse)
                .toList();
    }

    public long countForProfessor(String professorId) {
        return coinTransactionRepository.countByProfessorId(professorId);
    }

    public long countForStudent(String studentId) {
        return coinTransactionRepository.countByStudentId(studentId);
    }

    public long countForPartner(String partnerId) {
        return coinTransactionRepository.countByPartnerId(partnerId);
    }

    private TransactionResponse toProfessorResponse(CoinTransaction transaction) {
        String counterpart = switch (transaction.getType()) {
            case SEMESTER_ALLOCATION -> "Sistema";
            case PROFESSOR_TO_STUDENT -> studentService.getEntityById(transaction.getStudentId()).getName();
            case REDEMPTION -> "N/A";
        };

        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                counterpart,
                transaction.getCouponCode(),
                transaction.getCreatedAt());
    }

    private TransactionResponse toStudentResponse(CoinTransaction transaction) {

        String counterpart = switch (transaction.getType()) {
            case SEMESTER_ALLOCATION -> "N/A";
            case PROFESSOR_TO_STUDENT -> professorServiceHelper.getProfessorNameById(transaction.getProfessorId());
            case REDEMPTION -> partnerService.getEntityById(transaction.getPartnerId()).getCompanyName();
        };

        return new TransactionResponse(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                counterpart,
                transaction.getCouponCode(),
                transaction.getCreatedAt());
    }

}
