package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.LoginRequest;
import com.puc.moedaestudantil.dto.response.LoginResponse;
import com.puc.moedaestudantil.exception.BusinessException;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.model.Professor;
import com.puc.moedaestudantil.model.enums.TipoUsuario;
import com.puc.moedaestudantil.repository.AlunoRepository;
import com.puc.moedaestudantil.repository.EmpresaParceiraRepository;
import com.puc.moedaestudantil.repository.ProfessorRepository;
import com.puc.moedaestudantil.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AlunoRepository alunoRepository,
                       ProfessorRepository professorRepository,
                       EmpresaParceiraRepository empresaRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        return switch (request.tipo()) {
            case ALUNO -> autenticarAluno(request);
            case PROFESSOR -> autenticarProfessor(request);
            case EMPRESA -> autenticarEmpresa(request);
        };
    }

    private LoginResponse autenticarAluno(LoginRequest request) {
        Aluno aluno = alunoRepository.findByLogin(request.login())
                .orElseThrow(() -> new BusinessException("Login ou senha inválidos."));
        validarSenha(request.senha(), aluno.getSenha());
        String token = jwtService.gerarToken(aluno.getId(), aluno.getLogin(), aluno.getNome(), TipoUsuario.ALUNO);
        return new LoginResponse(token, aluno.getId(), aluno.getNome(), aluno.getLogin(), TipoUsuario.ALUNO, aluno.getSaldo());
    }

    private LoginResponse autenticarProfessor(LoginRequest request) {
        Professor professor = professorRepository.findByLogin(request.login())
                .orElseThrow(() -> new BusinessException("Login ou senha inválidos."));
        validarSenha(request.senha(), professor.getSenha());
        String token = jwtService.gerarToken(professor.getId(), professor.getLogin(), professor.getNome(), TipoUsuario.PROFESSOR);
        return new LoginResponse(token, professor.getId(), professor.getNome(), professor.getLogin(), TipoUsuario.PROFESSOR, professor.getSaldo());
    }

    private LoginResponse autenticarEmpresa(LoginRequest request) {
        EmpresaParceira empresa = empresaRepository.findByLogin(request.login())
                .orElseThrow(() -> new BusinessException("Login ou senha inválidos."));
        validarSenha(request.senha(), empresa.getSenha());
        String token = jwtService.gerarToken(empresa.getId(), empresa.getLogin(), empresa.getNome(), TipoUsuario.EMPRESA);
        return new LoginResponse(token, empresa.getId(), empresa.getNome(), empresa.getLogin(), TipoUsuario.EMPRESA, null);
    }

    private void validarSenha(String raw, String hash) {
        if (!passwordEncoder.matches(raw, hash)) {
            throw new BusinessException("Login ou senha inválidos.");
        }
    }
}
