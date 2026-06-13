package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.response.ProfessorResponse;
import com.puc.moedaestudantil.exception.ResourceNotFoundException;
import com.puc.moedaestudantil.model.Professor;
import com.puc.moedaestudantil.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    private static final int MOEDAS_SEMESTRAIS = 1000;

    private final ProfessorRepository repository;
    private final InstituicaoService instituicaoService;

    public ProfessorService(ProfessorRepository repository, InstituicaoService instituicaoService) {
        this.repository = repository;
        this.instituicaoService = instituicaoService;
    }

    public List<ProfessorResponse> listar() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ProfessorResponse buscarPorId(String id) {
        return toResponse(buscarEntidade(id));
    }

    public Professor buscarEntidade(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado: " + id));
    }

    /**
     * Recarga semestral acumulável: adiciona 1000 moedas ao saldo corrente de cada professor.
     */
    public void recargaSemestral() {
        List<Professor> professores = repository.findAll();
        for (Professor p : professores) {
            p.setSaldo(p.getSaldo() + MOEDAS_SEMESTRAIS);
        }
        repository.saveAll(professores);
    }

    private ProfessorResponse toResponse(Professor professor) {
        String instituicaoNome = instituicaoService.nomeOuVazio(professor.getInstituicaoId());
        return ProfessorResponse.from(professor, instituicaoNome);
    }
}
