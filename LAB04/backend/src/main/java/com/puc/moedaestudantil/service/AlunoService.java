package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.AlunoRequest;
import com.puc.moedaestudantil.dto.request.AlunoUpdateRequest;
import com.puc.moedaestudantil.dto.response.AlunoResponse;
import com.puc.moedaestudantil.exception.BusinessException;
import com.puc.moedaestudantil.exception.ResourceNotFoundException;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.repository.AlunoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository repository;
    private final InstituicaoService instituicaoService;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository repository,
                        InstituicaoService instituicaoService,
                        PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.instituicaoService = instituicaoService;
        this.passwordEncoder = passwordEncoder;
    }

    public AlunoResponse criar(AlunoRequest request) {
        if (repository.existsByCpf(request.cpf())) {
            throw new BusinessException("Já existe um aluno cadastrado com este CPF.");
        }
        if (repository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe um aluno cadastrado com este email.");
        }
        if (repository.existsByLogin(request.login())) {
            throw new BusinessException("Este login já está em uso.");
        }
        // valida instituição existente
        instituicaoService.buscarPorId(request.instituicaoId());

        Aluno aluno = new Aluno();
        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setCpf(request.cpf());
        aluno.setRg(request.rg());
        aluno.setEndereco(request.endereco());
        aluno.setCurso(request.curso());
        aluno.setInstituicaoId(request.instituicaoId());
        aluno.setLogin(request.login());
        aluno.setSenha(passwordEncoder.encode(request.senha()));
        aluno.setSaldo(0);

        Aluno salvo = repository.save(aluno);
        return toResponse(salvo);
    }

    public List<AlunoResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public AlunoResponse buscarPorId(String id) {
        return toResponse(buscarEntidade(id));
    }

    public Aluno buscarEntidade(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado: " + id));
    }

    public AlunoResponse atualizar(String id, AlunoUpdateRequest request) {
        Aluno aluno = buscarEntidade(id);

        if (!aluno.getCpf().equals(request.cpf()) && repository.existsByCpf(request.cpf())) {
            throw new BusinessException("Já existe um aluno cadastrado com este CPF.");
        }
        if (!aluno.getEmail().equals(request.email()) && repository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe um aluno cadastrado com este email.");
        }
        instituicaoService.buscarPorId(request.instituicaoId());

        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setCpf(request.cpf());
        aluno.setRg(request.rg());
        aluno.setEndereco(request.endereco());
        aluno.setCurso(request.curso());
        aluno.setInstituicaoId(request.instituicaoId());

        return toResponse(repository.save(aluno));
    }

    public void deletar(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Aluno não encontrado: " + id);
        }
        repository.deleteById(id);
    }

    private AlunoResponse toResponse(Aluno aluno) {
        String instituicaoNome = instituicaoService.nomeOuVazio(aluno.getInstituicaoId());
        return AlunoResponse.from(aluno, instituicaoNome);
    }
}
