package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.InstitutionResponse;
import br.com.labdevsoft.moeda.exception.ResourceNotFoundException;
import br.com.labdevsoft.moeda.model.Institution;
import br.com.labdevsoft.moeda.repository.InstitutionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstitutionService {

    private final InstitutionRepository institutionRepository;

    public List<InstitutionResponse> listAll() {
        return institutionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Institution getEntityById(String id) {
        return institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instituicao nao encontrada."));
    }

    public InstitutionResponse toResponse(Institution institution) {
        return new InstitutionResponse(
                institution.getId(),
                institution.getName(),
                institution.getCampus(),
                institution.getCity());
    }
}
