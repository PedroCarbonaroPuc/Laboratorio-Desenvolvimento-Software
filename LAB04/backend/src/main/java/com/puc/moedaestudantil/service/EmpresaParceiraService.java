package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.EmpresaParceiraRequest;
import com.puc.moedaestudantil.dto.request.EmpresaParceiraUpdateRequest;
import com.puc.moedaestudantil.dto.response.EmpresaParceiraResponse;
import com.puc.moedaestudantil.exception.BusinessException;
import com.puc.moedaestudantil.exception.ResourceNotFoundException;
import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.repository.EmpresaParceiraRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository repository;
    private final PasswordEncoder passwordEncoder;

    public EmpresaParceiraService(EmpresaParceiraRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public EmpresaParceiraResponse criar(EmpresaParceiraRequest request) {
        if (repository.existsByCnpj(request.cnpj())) {
            throw new BusinessException("Já existe uma empresa cadastrada com este CNPJ.");
        }
        if (repository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe uma empresa cadastrada com este email.");
        }
        if (repository.existsByLogin(request.login())) {
            throw new BusinessException("Este login já está em uso.");
        }

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(request.nome());
        empresa.setEmail(request.email());
        empresa.setCnpj(request.cnpj());
        empresa.setLogin(request.login());
        empresa.setSenha(passwordEncoder.encode(request.senha()));

        return EmpresaParceiraResponse.from(repository.save(empresa));
    }

    public List<EmpresaParceiraResponse> listar() {
        return repository.findAll().stream().map(EmpresaParceiraResponse::from).toList();
    }

    public EmpresaParceiraResponse buscarPorId(String id) {
        return EmpresaParceiraResponse.from(buscarEntidade(id));
    }

    public EmpresaParceira buscarEntidade(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada: " + id));
    }

    public EmpresaParceiraResponse atualizar(String id, EmpresaParceiraUpdateRequest request) {
        EmpresaParceira empresa = buscarEntidade(id);

        if (!empresa.getCnpj().equals(request.cnpj()) && repository.existsByCnpj(request.cnpj())) {
            throw new BusinessException("Já existe uma empresa cadastrada com este CNPJ.");
        }
        if (!empresa.getEmail().equals(request.email()) && repository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe uma empresa cadastrada com este email.");
        }

        empresa.setNome(request.nome());
        empresa.setEmail(request.email());
        empresa.setCnpj(request.cnpj());

        return EmpresaParceiraResponse.from(repository.save(empresa));
    }

    public void deletar(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Empresa não encontrada: " + id);
        }
        repository.deleteById(id);
    }
}
