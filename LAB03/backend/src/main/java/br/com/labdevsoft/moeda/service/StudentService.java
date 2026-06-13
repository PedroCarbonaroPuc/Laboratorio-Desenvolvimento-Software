package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.CurrentUserResponse;
import br.com.labdevsoft.moeda.dto.StudentRegistrationRequest;
import br.com.labdevsoft.moeda.dto.StudentResponse;
import br.com.labdevsoft.moeda.dto.StudentUpdateRequest;
import br.com.labdevsoft.moeda.exception.BusinessException;
import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.repository.StudentRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final InstitutionService institutionService;
    private final PasswordEncoder passwordEncoder;

    public StudentResponse register(StudentRegistrationRequest request) {
        validateStudentUniqueness(request.email(), request.cpf());
        institutionService.getEntityById(request.institutionId());

        Student student = Student.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .cpf(request.cpf().trim())
                .rg(request.rg().trim())
                .address(request.address().trim())
                .institutionId(request.institutionId().trim())
                .course(request.course().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .balance(0L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(studentRepository.save(student));
    }

    public List<StudentResponse> listAll() {
        return studentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentResponse getById(String studentId) {
        return toResponse(getEntityById(studentId));
    }

    public Student getEntityById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno nao encontrado."));
    }

    public StudentResponse update(String studentId, StudentUpdateRequest request) {
        Student student = getEntityById(studentId);

        if (StringUtils.hasText(request.name())) {
            student.setName(request.name().trim());
        }
        if (StringUtils.hasText(request.address())) {
            student.setAddress(request.address().trim());
        }
        if (StringUtils.hasText(request.course())) {
            student.setCourse(request.course().trim());
        }
        if (StringUtils.hasText(request.password())) {
            student.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        student.setUpdatedAt(Instant.now());
        return toResponse(studentRepository.save(student));
    }

    public void delete(String studentId) {
        Student student = getEntityById(studentId);
        studentRepository.deleteById(student.getId());
    }

    public StudentResponse toResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getCpf(),
                student.getRg(),
                student.getAddress(),
                student.getInstitutionId(),
                student.getCourse(),
                student.getBalance());
    }

    private void validateStudentUniqueness(String email, String cpf) {
        if (studentRepository.existsByEmailIgnoreCase(email.trim())) {
            throw new BusinessException("Ja existe aluno com este email.");
        }
        if (studentRepository.existsByCpf(cpf.trim())) {
            throw new BusinessException("Ja existe aluno com este CPF.");
        }
    }

}
