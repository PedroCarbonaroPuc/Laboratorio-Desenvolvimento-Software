package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.VantagemRequest;
import com.puc.moedaestudantil.dto.response.VantagemResponse;
import com.puc.moedaestudantil.exception.ResourceNotFoundException;
import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.model.Vantagem;
import com.puc.moedaestudantil.repository.EmpresaParceiraRepository;
import com.puc.moedaestudantil.repository.VantagemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VantagemService {

    private final VantagemRepository repository;
    private final EmpresaParceiraRepository empresaRepository;

    public VantagemService(VantagemRepository repository, EmpresaParceiraRepository empresaRepository) {
        this.repository = repository;
        this.empresaRepository = empresaRepository;
    }

    public VantagemResponse criar(String empresaId, VantagemRequest request) {
        EmpresaParceira empresa = buscarEmpresa(empresaId);

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(request.nome());
        vantagem.setDescricao(request.descricao());
        vantagem.setFoto(request.foto());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setEmpresaId(empresaId);

        return VantagemResponse.from(repository.save(vantagem), empresa.getNome());
    }

    public List<VantagemResponse> listarTodas() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public List<VantagemResponse> listarPorEmpresa(String empresaId) {
        return repository.findByEmpresaId(empresaId).stream().map(this::toResponse).toList();
    }

    public VantagemResponse buscarPorId(String id) {
        return toResponse(buscarEntidade(id));
    }

    public Vantagem buscarEntidade(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada: " + id));
    }

    public VantagemResponse atualizar(String empresaId, String id, VantagemRequest request) {
        Vantagem vantagem = buscarEntidade(id);
        EmpresaParceira empresa = buscarEmpresa(empresaId);

        vantagem.setNome(request.nome());
        vantagem.setDescricao(request.descricao());
        vantagem.setFoto(request.foto());
        vantagem.setCustoMoedas(request.custoMoedas());

        return VantagemResponse.from(repository.save(vantagem), empresa.getNome());
    }

    public void deletar(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Vantagem não encontrada: " + id);
        }
        repository.deleteById(id);
    }

    private EmpresaParceira buscarEmpresa(String empresaId) {
        return empresaRepository.findById(empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada: " + empresaId));
    }

    private VantagemResponse toResponse(Vantagem vantagem) {
        String empresaNome = empresaRepository.findById(vantagem.getEmpresaId())
                .map(EmpresaParceira::getNome)
                .orElse("");
        return VantagemResponse.from(vantagem, empresaNome);
    }
}
