package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.dto.request.EnvioMoedasRequest;
import com.puc.moedaestudantil.dto.response.ExtratoResponse;
import com.puc.moedaestudantil.dto.response.TransacaoResponse;
import com.puc.moedaestudantil.exception.BusinessException;
import com.puc.moedaestudantil.messaging.EmailMessage;
import com.puc.moedaestudantil.messaging.EmailProducer;
import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.model.Professor;
import com.puc.moedaestudantil.model.Transacao;
import com.puc.moedaestudantil.model.enums.TipoTransacao;
import com.puc.moedaestudantil.repository.AlunoRepository;
import com.puc.moedaestudantil.repository.ProfessorRepository;
import com.puc.moedaestudantil.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final EmailProducer emailProducer;

    public TransacaoService(TransacaoRepository transacaoRepository,
                            ProfessorRepository professorRepository,
                            AlunoRepository alunoRepository,
                            EmailProducer emailProducer) {
        this.transacaoRepository = transacaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.emailProducer = emailProducer;
    }

    public TransacaoResponse enviarMoedas(String professorId, EnvioMoedasRequest request) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new BusinessException("Professor não encontrado."));

        if (professor.getSaldo() < request.quantidade()) {
            throw new BusinessException("Saldo insuficiente. Saldo atual: " + professor.getSaldo() + " moedas.");
        }

        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new BusinessException("Aluno destinatário não encontrado."));

        professor.setSaldo(professor.getSaldo() - request.quantidade());
        aluno.setSaldo(aluno.getSaldo() + request.quantidade());
        professorRepository.save(professor);
        alunoRepository.save(aluno);

        Transacao transacao = new Transacao();
        transacao.setTipo(TipoTransacao.ENVIO);
        transacao.setOrigemId(professor.getId());
        transacao.setOrigemNome(professor.getNome());
        transacao.setDestinoId(aluno.getId());
        transacao.setDestinoNome(aluno.getNome());
        transacao.setValor(request.quantidade());
        transacao.setMensagem(request.mensagem());
        Transacao salva = transacaoRepository.save(transacao);

        notificarAluno(aluno, professor, request);
        notificarProfessor(aluno, professor, request);

        return TransacaoResponse.from(salva);
    }

    public ExtratoResponse extratoAluno(String alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new BusinessException("Aluno não encontrado."));
        List<TransacaoResponse> transacoes = buscarTransacoes(alunoId);
        return new ExtratoResponse(aluno.getId(), aluno.getNome(), aluno.getSaldo(), transacoes);
    }

    public ExtratoResponse extratoProfessor(String professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new BusinessException("Professor não encontrado."));
        List<TransacaoResponse> transacoes = buscarTransacoes(professorId);
        return new ExtratoResponse(professor.getId(), professor.getNome(), professor.getSaldo(), transacoes);
    }

    private List<TransacaoResponse> buscarTransacoes(String usuarioId) {
        return transacaoRepository
                .findByOrigemIdOrDestinoIdOrderByDataDesc(usuarioId, usuarioId)
                .stream()
                .map(TransacaoResponse::from)
                .toList();
    }

    private void notificarAluno(Aluno aluno, Professor professor, EnvioMoedasRequest request) {
        Map<String, String> dados = new HashMap<>();
        dados.put("nomeAluno", aluno.getNome());
        dados.put("nomeProfessor", professor.getNome());
        dados.put("quantidade", String.valueOf(request.quantidade()));
        dados.put("mensagem", request.mensagem());
        dados.put("saldoAtual", String.valueOf(aluno.getSaldo()));
        emailProducer.enviar(new EmailMessage(
                aluno.getEmail(),
                "Você recebeu moedas estudantis! 🪙",
                "RECEBIMENTO_MOEDAS",
                dados));
    }

    private void notificarProfessor(Aluno aluno, Professor professor, EnvioMoedasRequest request) {
        if (professor.getEmail() == null || professor.getEmail().isBlank()) {
            return;
        }
        Map<String, String> dados = new HashMap<>();
        dados.put("nomeProfessor", professor.getNome());
        dados.put("nomeAluno", aluno.getNome());
        dados.put("quantidade", String.valueOf(request.quantidade()));
        dados.put("mensagem", request.mensagem());
        dados.put("saldoAtual", String.valueOf(professor.getSaldo()));
        emailProducer.enviar(new EmailMessage(
                professor.getEmail(),
                "Confirmação de envio de moedas ✅",
                "CONFIRMACAO_ENVIO",
                dados));
    }
}
