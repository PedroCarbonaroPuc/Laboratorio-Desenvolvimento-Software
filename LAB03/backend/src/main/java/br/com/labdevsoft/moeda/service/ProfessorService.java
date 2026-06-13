package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.BalanceAndStatementResponse;
import br.com.labdevsoft.moeda.dto.CoinTransferRequest;
import br.com.labdevsoft.moeda.dto.CurrentUserResponse;
import br.com.labdevsoft.moeda.dto.ProfessorProfileResponse;
import br.com.labdevsoft.moeda.exception.BusinessException;
import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.repository.ProfessorRepository;
import br.com.labdevsoft.moeda.repository.StudentRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;
    private final SemesterAllocationService semesterAllocationService;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

    public Professor getEntityById(String professorId) {
        return professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor nao encontrado."));
    }

    public ProfessorProfileResponse getOwnProfile(String professorId) {
        Professor professor = getEntityById(professorId);
        semesterAllocationService.ensureProfessorAllowance(professor);
        return toProfileResponse(getEntityById(professorId));
    }

    public BalanceAndStatementResponse getOwnStatement(String professorId) {
        Professor professor = getEntityById(professorId);
        semesterAllocationService.ensureProfessorAllowance(professor);

        Professor refreshedProfessor = getEntityById(professorId);
        return new BalanceAndStatementResponse(
                refreshedProfessor.getBalance(),
                transactionService.professorStatement(professorId));
    }

    public void transferCoins(String professorId, CoinTransferRequest request) {
        Professor professor = getEntityById(professorId);
        semesterAllocationService.ensureProfessorAllowance(professor);

        long amount = request.amount();
        if (amount <= 0) {
            throw new BusinessException("A quantidade de moedas deve ser maior que zero.");
        }

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado para receber moedas."));

        Professor refreshedProfessor = getEntityById(professorId);
        if (refreshedProfessor.getBalance() < amount) {
            throw new BusinessException("Saldo insuficiente para transferir moedas.");
        }

        refreshedProfessor.setBalance(refreshedProfessor.getBalance() - amount);
        refreshedProfessor.setUpdatedAt(Instant.now());

        student.setBalance(student.getBalance() + amount);
        student.setUpdatedAt(Instant.now());

        professorRepository.save(refreshedProfessor);
        studentRepository.save(student);

        transactionService.recordProfessorTransfer(refreshedProfessor, student, amount, request.message().trim());
        notificationService.notifyCoinReceived(
                student.getEmail(),
                student.getName(),
                refreshedProfessor.getName(),
                amount,
                request.message().trim());
    }

    public CurrentUserResponse currentUser(String professorId) {
        Professor professor = getEntityById(professorId);
        semesterAllocationService.ensureProfessorAllowance(professor);

        Professor refreshedProfessor = getEntityById(professorId);
        return new CurrentUserResponse(
                Role.PROFESSOR,
                refreshedProfessor.getId(),
                refreshedProfessor.getName(),
                refreshedProfessor.getEmail(),
                refreshedProfessor.getBalance());
    }

    private ProfessorProfileResponse toProfileResponse(Professor professor) {
        return new ProfessorProfileResponse(
                professor.getId(),
                professor.getName(),
                professor.getEmail(),
                professor.getCpf(),
                professor.getDepartment(),
                professor.getInstitutionId(),
                professor.getBalance());
    }
}
