package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.model.ProfessorSemesterAllowance;
import br.com.labdevsoft.moeda.repository.ProfessorRepository;
import br.com.labdevsoft.moeda.repository.ProfessorSemesterAllowanceRepository;
import java.time.Instant;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SemesterAllocationService {

    private static final long SEMESTER_ALLOWANCE = 1000L;

    private final ProfessorRepository professorRepository;
    private final ProfessorSemesterAllowanceRepository allowanceRepository;
    private final TransactionService transactionService;

    public void ensureProfessorAllowance(Professor professor) {
        String semesterKey = currentSemesterKey();
        String uniqueKey = professor.getId() + "_" + semesterKey;

        if (allowanceRepository.existsByProfessorSemesterKey(uniqueKey)) {
            return;
        }

        professor.setBalance(professor.getBalance() + SEMESTER_ALLOWANCE);
        professor.setUpdatedAt(Instant.now());
        professorRepository.save(professor);

        ProfessorSemesterAllowance allowance = ProfessorSemesterAllowance.builder()
                .professorId(professor.getId())
                .semesterKey(semesterKey)
                .professorSemesterKey(uniqueKey)
                .allocatedAmount(SEMESTER_ALLOWANCE)
                .createdAt(Instant.now())
                .build();

        allowanceRepository.save(allowance);
        transactionService.recordSemesterAllocation(professor, semesterKey, SEMESTER_ALLOWANCE);

        log.info("Credito semestral aplicado ao professor {} para o semestre {}", professor.getId(), semesterKey);
    }

    @Scheduled(cron = "${app.allocation.cron:0 0 6 * * *}")
    public void allocateForAllProfessors() {
        professorRepository.findAll().forEach(this::ensureProfessorAllowance);
    }

    public String currentSemesterKey() {
        LocalDate now = LocalDate.now();
        int semester = now.getMonthValue() <= 6 ? 1 : 2;
        return now.getYear() + "." + semester;
    }
}
