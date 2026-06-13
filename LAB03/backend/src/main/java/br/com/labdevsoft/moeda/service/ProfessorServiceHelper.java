package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfessorServiceHelper {

    private final ProfessorRepository professorRepository;

    public Professor getEntityById(String professorId) {
        return professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor nao encontrado."));
    }

    public String getProfessorNameById(String professorId) {
        return getEntityById(professorId).getName();
    }
}
