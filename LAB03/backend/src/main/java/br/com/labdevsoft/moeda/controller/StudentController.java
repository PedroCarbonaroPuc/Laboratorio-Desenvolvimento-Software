package br.com.labdevsoft.moeda.controller;

import br.com.labdevsoft.moeda.dto.BalanceAndStatementResponse;
import br.com.labdevsoft.moeda.dto.StudentRegistrationRequest;
import br.com.labdevsoft.moeda.dto.StudentResponse;
import br.com.labdevsoft.moeda.dto.StudentUpdateRequest;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.model.enums.Role;
import br.com.labdevsoft.moeda.security.AuthFacade;
import br.com.labdevsoft.moeda.security.AuthenticatedUser;
import br.com.labdevsoft.moeda.service.StudentService;
import br.com.labdevsoft.moeda.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final TransactionService transactionService;
    private final AuthFacade authFacade;

    @PostMapping("/register")
    public ResponseEntity<StudentResponse> register(@Valid @RequestBody StudentRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.register(request));
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> listAll() {
        authFacade.requireRole(Role.PROFESSOR);
        return ResponseEntity.ok(studentService.listAll());
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<StudentResponse> findById(@PathVariable String studentId) {
        authFacade.requireRole(Role.PROFESSOR);
        return ResponseEntity.ok(studentService.getById(studentId));
    }

    @GetMapping("/me")
    public ResponseEntity<StudentResponse> currentStudentProfile() {
        authFacade.requireRole(Role.STUDENT);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(studentService.getById(user.userId()));
    }

    @PutMapping("/me")
    public ResponseEntity<StudentResponse> updateOwnData(@RequestBody StudentUpdateRequest request) {
        authFacade.requireRole(Role.STUDENT);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        return ResponseEntity.ok(studentService.update(user.userId(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteOwnAccount() {
        authFacade.requireRole(Role.STUDENT);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        studentService.delete(user.userId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/statement")
    public ResponseEntity<BalanceAndStatementResponse> getOwnStatement() {
        authFacade.requireRole(Role.STUDENT);
        AuthenticatedUser user = authFacade.requireAuthenticatedUser();
        Student student = studentService.getEntityById(user.userId());

        BalanceAndStatementResponse response = new BalanceAndStatementResponse(
                student.getBalance(),
                transactionService.studentStatement(student.getId()));

        return ResponseEntity.ok(response);
    }
}
