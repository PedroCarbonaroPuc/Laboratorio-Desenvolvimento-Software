package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.ResgateRequest;
import com.puc.moedaestudantil.dto.response.ResgateResponse;
import com.puc.moedaestudantil.exception.BusinessException;
import com.puc.moedaestudantil.messaging.EmailMessage;
import com.puc.moedaestudantil.messaging.EmailProducer;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.model.Resgate;
import com.puc.moedaestudantil.model.Transacao;
import com.puc.moedaestudantil.model.Vantagem;
import com.puc.moedaestudantil.model.enums.TipoTransacao;
import com.puc.moedaestudantil.repository.AlunoRepository;
import com.puc.moedaestudantil.repository.EmpresaParceiraRepository;
import com.puc.moedaestudantil.repository.ResgateRepository;
import com.puc.moedaestudantil.repository.TransacaoRepository;
import com.puc.moedaestudantil.repository.VantagemRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ResgateService {

    private final ResgateRepository resgateRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final TransacaoRepository transacaoRepository;
    private final EmailProducer emailProducer;

    public ResgateService(ResgateRepository resgateRepository,
                          AlunoRepository alunoRepository,
                          VantagemRepository vantagemRepository,
                          EmpresaParceiraRepository empresaRepository,
                          TransacaoRepository transacaoRepository,
                          EmailProducer emailProducer) {
        this.resgateRepository = resgateRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
        this.transacaoRepository = transacaoRepository;
        this.emailProducer = emailProducer;
    }

    public ResgateResponse resgatar(String alunoId, ResgateRequest request) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new BusinessException("Aluno não encontrado."));

        Vantagem vantagem = vantagemRepository.findById(request.vantagemId())
                .orElseThrow(() -> new BusinessException("Vantagem não encontrada."));

        if (aluno.getSaldo() < vantagem.getCustoMoedas()) {
            throw new BusinessException("Saldo insuficiente. Saldo atual: " + aluno.getSaldo()
                    + " moedas. Custo da vantagem: " + vantagem.getCustoMoedas() + " moedas.");
        }

        aluno.setSaldo(aluno.getSaldo() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        String codigo = gerarCodigo();
        Resgate resgate = new Resgate();
        resgate.setCodigo(codigo);
        resgate.setAlunoId(aluno.getId());
        resgate.setAlunoNome(aluno.getNome());
        resgate.setVantagemId(vantagem.getId());
        resgate.setVantagemNome(vantagem.getNome());
        resgate.setCustoMoedas(vantagem.getCustoMoedas());
        resgate.setEmpresaId(vantagem.getEmpresaId());
        Resgate salvo = resgateRepository.save(resgate);

        registrarTransacao(aluno, vantagem);
        String emailDestinoCupom = request.emailDestinoCupom();
        if (emailDestinoCupom == null || emailDestinoCupom.isBlank()) {
            emailDestinoCupom = aluno.getEmail();
        }
        notificarAluno(aluno, vantagem, codigo, emailDestinoCupom.trim());
        notificarEmpresa(aluno, vantagem, codigo);

        return ResgateResponse.from(salvo);
    }

    public List<ResgateResponse> listarPorAluno(String alunoId) {
        return resgateRepository.findByAlunoIdOrderByDataDesc(alunoId)
                .stream().map(ResgateResponse::from).toList();
    }

    public List<ResgateResponse> listarPorEmpresa(String empresaId) {
        return resgateRepository.findByEmpresaIdOrderByDataDesc(empresaId)
                .stream().map(ResgateResponse::from).toList();
    }

    private String gerarCodigo() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void registrarTransacao(Aluno aluno, Vantagem vantagem) {
        Transacao transacao = new Transacao();
        transacao.setTipo(TipoTransacao.RESGATE);
        transacao.setOrigemId(aluno.getId());
        transacao.setOrigemNome(aluno.getNome());
        transacao.setDestinoId(vantagem.getEmpresaId());
        transacao.setDestinoNome(vantagem.getNome());
        transacao.setValor(vantagem.getCustoMoedas());
        transacao.setMensagem("Resgate da vantagem: " + vantagem.getNome());
        transacaoRepository.save(transacao);
    }

    private void notificarAluno(Aluno aluno, Vantagem vantagem, String codigo, String emailDestinoCupom) {
        Map<String, String> dados = new HashMap<>();
        dados.put("nomeAluno", aluno.getNome());
        dados.put("nomeVantagem", vantagem.getNome());
        dados.put("codigo", codigo);
        dados.put("custoMoedas", String.valueOf(vantagem.getCustoMoedas()));
        dados.put("saldoAtual", String.valueOf(aluno.getSaldo()));
        emailProducer.enviar(new EmailMessage(
                emailDestinoCupom,
                "Seu cupom de resgate 🎁",
                "CUPOM_ALUNO",
                dados));
    }

    private void notificarEmpresa(Aluno aluno, Vantagem vantagem, String codigo) {
        empresaRepository.findById(vantagem.getEmpresaId()).ifPresent(empresa -> {
            if (empresa.getEmail() == null || empresa.getEmail().isBlank()) {
                return;
            }
            Map<String, String> dados = new HashMap<>();
            dados.put("nomeEmpresa", empresa.getNome());
            dados.put("nomeAluno", aluno.getNome());
            dados.put("nomeVantagem", vantagem.getNome());
            dados.put("codigo", codigo);
            emailProducer.enviar(new EmailMessage(
                    empresa.getEmail(),
                    "Conferência de resgate de vantagem 🏢",
                    "CONFERENCIA_EMPRESA",
                    dados));
        });
    }
}
