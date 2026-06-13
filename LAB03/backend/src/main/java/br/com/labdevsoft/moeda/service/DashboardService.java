package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.DashboardSummaryResponse;
import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.repository.BenefitRepository;
import br.com.labdevsoft.moeda.repository.PartnerCompanyRepository;
import br.com.labdevsoft.moeda.repository.ProfessorRepository;
import br.com.labdevsoft.moeda.repository.StudentRepository;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final PartnerCompanyRepository partnerCompanyRepository;
    private final BenefitRepository benefitRepository;
    private final TransactionService transactionService;
    private final SemesterAllocationService semesterAllocationService;

    public DashboardSummaryResponse summary(AuthenticatedUser user) {
        return switch (user.role()) {
            case STUDENT -> studentSummary(user.userId());
            case PROFESSOR -> professorSummary(user.userId());
            case PARTNER -> partnerSummary(user.userId());
        };
    }

    private DashboardSummaryResponse studentSummary(String studentId) {

        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado."));

        return new DashboardSummaryResponse(
                Role.STUDENT,
                student.getName(),
                student.getBalance(),
                transactionService.countForStudent(student.getId()),
                benefitRepository.count());
    }

    private DashboardSummaryResponse professorSummary(String professorId) {

        var professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor nao encontrado."));
        semesterAllocationService.ensureProfessorAllowance(professor);

        var refreshedProfessor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor nao encontrado."));

        return new DashboardSummaryResponse(
                Role.PROFESSOR,
                refreshedProfessor.getName(),
                refreshedProfessor.getBalance(),
                transactionService.countForProfessor(professorId),
                benefitRepository.count());
    }

    private DashboardSummaryResponse partnerSummary(String partnerId) {

        var partner = partnerCompanyRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Parceiro nao encontrado."));

        return new DashboardSummaryResponse(
                Role.PARTNER,
                partner.getCompanyName(),
                0L,
                transactionService.countForPartner(partnerId),
                benefitRepository.countByPartnerId(partnerId));
    }
}
