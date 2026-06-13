package com.puc.moedaestudantil.config;

import com.puc.moedaestudantil.model.Aluno;
import com.puc.moedaestudantil.model.EmpresaParceira;
import com.puc.moedaestudantil.model.Instituicao;
import com.puc.moedaestudantil.model.Professor;
import com.puc.moedaestudantil.model.Vantagem;
import com.puc.moedaestudantil.repository.AlunoRepository;
import com.puc.moedaestudantil.repository.EmpresaParceiraRepository;
import com.puc.moedaestudantil.repository.InstituicaoRepository;
import com.puc.moedaestudantil.repository.ProfessorRepository;
import com.puc.moedaestudantil.repository.VantagemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.rabbitmq.exchange}")
    private String rabbitExchange;

    @Value("${app.rabbitmq.queue-email}")
    private String rabbitEmailQueue;

    @Value("${app.rabbitmq.routing-key-email}")
    private String rabbitEmailRoutingKey;

    public DataSeeder(InstituicaoRepository instituicaoRepository,
                      ProfessorRepository professorRepository,
                      EmpresaParceiraRepository empresaRepository,
                      AlunoRepository alunoRepository,
                      VantagemRepository vantagemRepository,
                      PasswordEncoder passwordEncoder) {
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
        this.empresaRepository = empresaRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Map<String, Instituicao> instituicoes = seedInstituicoes();
        List<Professor> professores = seedProfessores(instituicoes);
        List<EmpresaParceira> empresas = seedEmpresas();
        List<Aluno> alunos = seedAlunos(instituicoes);
        int vantagensCriadas = seedVantagens(empresas);
        logResumoCredenciaisETestes(professores, empresas, alunos, vantagensCriadas);
    }

    private Map<String, Instituicao> seedInstituicoes() {
        List<Instituicao> atuais = instituicaoRepository.findAll();
        Map<String, Instituicao> porNome = new HashMap<>();
        for (Instituicao instituicao : atuais) {
            porNome.putIfAbsent(instituicao.getNome(), instituicao);
        }

        List<Instituicao> seeds = List.of(
                new Instituicao("PUC Minas", "Belo Horizonte"),
                new Instituicao("UFMG", "Belo Horizonte"),
                new Instituicao("CEFET-MG", "Belo Horizonte"),
                new Instituicao("UNICAMP", "Campinas"),
                new Instituicao("UFOP", "Ouro Preto"),
                new Instituicao("USP", "São Paulo")
        );

        int criadas = 0;
        for (Instituicao seed : seeds) {
            if (!porNome.containsKey(seed.getNome())) {
                Instituicao salva = instituicaoRepository.save(seed);
                porNome.put(salva.getNome(), salva);
                criadas++;
            }
        }

        log.info("Seed: instituições -> total: {}, novas nesta execução: {}.", porNome.size(), criadas);
        return porNome;
    }

    private List<Professor> seedProfessores(Map<String, Instituicao> instituicoes) {
        List<ProfessorSeed> seeds = List.of(
                new ProfessorSeed("professor", "João Paulo Aramuni", "joao.aramuni@puc.com", "111.111.111-11", "Engenharia de Software", "PUC Minas", 1600),
                new ProfessorSeed("maria", "Maria Silva", "maria.silva@puc.com", "222.222.222-22", "Ciência da Computação", "PUC Minas", 1400),
                new ProfessorSeed("carlos", "Carlos Menezes", "carlos.menezes@ufmg.br", "223.223.223-23", "Sistemas de Informação", "UFMG", 1200),
                new ProfessorSeed("ana", "Ana Beatriz", "ana.beatriz@unicamp.br", "224.224.224-24", "Engenharia de Computação", "UNICAMP", 1300)
        );

        int criados = 0;
        List<Professor> resultado = new ArrayList<>();
        for (ProfessorSeed seed : seeds) {
            Professor professor = professorRepository.findByLogin(seed.login()).orElseGet(Professor::new);
            boolean novo = professor.getId() == null;

            professor.setLogin(seed.login());
            professor.setNome(seed.nome());
            professor.setEmail(seed.email());
            professor.setCpf(seed.cpf());
            professor.setDepartamento(seed.departamento());
            professor.setInstituicaoId(obterInstituicaoId(instituicoes, seed.instituicaoNome()));
            professor.setSaldo(seed.saldo());
            professor.setSenha(garantirSenhaSeed(professor.getSenha()));

            Professor salvo = professorRepository.save(professor);
            if (novo) {
                criados++;
            }
            resultado.add(salvo);
        }

        log.info("Seed: professores -> total seed: {}, novos nesta execução: {}.", resultado.size(), criados);
        return resultado;
    }

    private List<EmpresaParceira> seedEmpresas() {
        List<EmpresaSeed> seeds = List.of(
                new EmpresaSeed("empresa", "Restaurante Universitário Sabor & Cia", "contato@saborecia.com", "12.345.678/0001-90"),
                new EmpresaSeed("techbooks", "TechBooks Academy", "contato@techbooks.com", "12.345.678/0001-91"),
                new EmpresaSeed("fitlife", "FitLife Saúde e Bem-estar", "parcerias@fitlife.com", "12.345.678/0001-92"),
                new EmpresaSeed("cinestar", "CineStar BH", "beneficios@cinestar.com", "12.345.678/0001-93")
        );

        int criadas = 0;
        List<EmpresaParceira> resultado = new ArrayList<>();
        for (EmpresaSeed seed : seeds) {
            EmpresaParceira empresa = empresaRepository.findByLogin(seed.login()).orElseGet(EmpresaParceira::new);
            boolean nova = empresa.getId() == null;

            empresa.setLogin(seed.login());
            empresa.setNome(seed.nome());
            empresa.setEmail(seed.email());
            empresa.setCnpj(seed.cnpj());
            empresa.setSenha(garantirSenhaSeed(empresa.getSenha()));

            EmpresaParceira salva = empresaRepository.save(empresa);
            if (nova) {
                criadas++;
            }
            resultado.add(salva);
        }

        log.info("Seed: empresas -> total seed: {}, novas nesta execução: {}.", resultado.size(), criadas);
        return resultado;
    }

    private List<Aluno> seedAlunos(Map<String, Instituicao> instituicoes) {
        List<AlunoSeed> seeds = List.of(
                new AlunoSeed("aluno", "Pedro Carbonaro", "pedro.aluno@puc.com", "333.333.333-33", "MG-12.345.678", "Rua das Acácias, 100 - Belo Horizonte", "Engenharia de Software", "PUC Minas", 520),
                new AlunoSeed("bruna", "Bruna Lima", "bruna.lima@ufmg.br", "334.334.334-34", "MG-22.222.222", "Av. Brasil, 2100 - Belo Horizonte", "Ciência da Computação", "UFMG", 460),
                new AlunoSeed("rafael", "Rafael Costa", "rafael.costa@cefetmg.br", "335.335.335-35", "MG-33.333.333", "Rua dos Inconfidentes, 45 - Belo Horizonte", "Engenharia Elétrica", "CEFET-MG", 300),
                new AlunoSeed("juliana", "Juliana Nogueira", "juliana.nogueira@unicamp.br", "336.336.336-36", "SP-44.444.444", "Rua Harmonia, 900 - Campinas", "Sistemas de Informação", "UNICAMP", 380),
                new AlunoSeed("caio", "Caio Rodrigues", "caio.rodrigues@usp.br", "337.337.337-37", "SP-55.555.555", "Av. Paulista, 1500 - São Paulo", "Engenharia de Computação", "USP", 275)
        );

        int criados = 0;
        List<Aluno> resultado = new ArrayList<>();
        for (AlunoSeed seed : seeds) {
            Aluno aluno = alunoRepository.findByLogin(seed.login()).orElseGet(Aluno::new);
            boolean novo = aluno.getId() == null;

            aluno.setLogin(seed.login());
            aluno.setNome(seed.nome());
            aluno.setEmail(seed.email());
            aluno.setCpf(seed.cpf());
            aluno.setRg(seed.rg());
            aluno.setEndereco(seed.endereco());
            aluno.setCurso(seed.curso());
            aluno.setInstituicaoId(obterInstituicaoId(instituicoes, seed.instituicaoNome()));
            aluno.setSaldo(seed.saldo());
            aluno.setSenha(garantirSenhaSeed(aluno.getSenha()));

            Aluno salvo = alunoRepository.save(aluno);
            if (novo) {
                criados++;
            }
            resultado.add(salvo);
        }

        log.info("Seed: alunos -> total seed: {}, novos nesta execução: {}.", resultado.size(), criados);
        return resultado;
    }

    private int seedVantagens(List<EmpresaParceira> empresas) {
        List<VantagemSeed> seeds = List.of(
                new VantagemSeed("empresa", "Almoço com 30% OFF", "Desconto para almoço em dias úteis.", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", 120),
                new VantagemSeed("empresa", "Jantar especial 2x1", "Cupom para jantar com acompanhante.", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5", 220),
                new VantagemSeed("techbooks", "Livro técnico com 40% OFF", "Desconto em livros de tecnologia e engenharia.", "https://images.unsplash.com/photo-1512820790803-83ca734da794", 180),
                new VantagemSeed("techbooks", "Assinatura 1 mês plataforma", "Acesso completo por 30 dias ao catálogo premium.", "https://images.unsplash.com/photo-1516321165247-4aa89a48be28", 260),
                new VantagemSeed("fitlife", "Mensalidade academia 50%", "Desconto na primeira mensalidade da academia parceira.", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438", 210),
                new VantagemSeed("fitlife", "Avaliação física gratuita", "Sessão de avaliação com personal trainer.", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b", 140),
                new VantagemSeed("cinestar", "Ingresso de cinema VIP", "Ingresso para sessão premium em qualquer dia.", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba", 160),
                new VantagemSeed("cinestar", "Combo pipoca + refrigerante", "Combo completo para uma pessoa.", "https://images.unsplash.com/photo-1578849278619-e73505e9610f", 90),
                new VantagemSeed("cinestar", "Passaporte 3 sessões", "Use em até 60 dias em sessões 2D.", "https://images.unsplash.com/photo-1594909122845-11baa439b7bf", 320)
        );

        Map<String, EmpresaParceira> empresasPorLogin = empresas.stream()
                .collect(Collectors.toMap(EmpresaParceira::getLogin, e -> e));

        int criadas = 0;
        for (VantagemSeed seed : seeds) {
            EmpresaParceira empresa = empresasPorLogin.get(seed.empresaLogin());
            if (empresa == null) {
                continue;
            }
            Set<String> nomesExistentes = vantagemRepository.findByEmpresaId(empresa.getId())
                    .stream()
                    .map(v -> v.getNome().trim().toLowerCase())
                    .collect(Collectors.toSet());
            if (nomesExistentes.contains(seed.nome().trim().toLowerCase())) {
                continue;
            }

            Vantagem vantagem = new Vantagem();
            vantagem.setEmpresaId(empresa.getId());
            vantagem.setNome(seed.nome());
            vantagem.setDescricao(seed.descricao());
            vantagem.setFoto(seed.foto());
            vantagem.setCustoMoedas(seed.custoMoedas());
            vantagemRepository.save(vantagem);
            criadas++;
        }

        long total = vantagemRepository.count();
        log.info("Seed: vantagens -> total no banco: {}, novas nesta execução: {}.", total, criadas);
        return criadas;
    }

    private String obterInstituicaoId(Map<String, Instituicao> instituicoes, String nomePreferido) {
        Instituicao instituicao = Optional.ofNullable(instituicoes.get(nomePreferido))
                .orElseGet(() -> instituicoes.values().stream().findFirst().orElseThrow());
        return instituicao.getId();
    }

    private String garantirSenhaSeed(String senhaAtualHash) {
        if (senhaAtualHash != null && passwordEncoder.matches("123456", senhaAtualHash)) {
            return senhaAtualHash;
        }
        return passwordEncoder.encode("123456");
    }

    private void logResumoCredenciaisETestes(List<Professor> professores,
                                             List<EmpresaParceira> empresas,
                                             List<Aluno> alunos,
                                             int vantagensCriadas) {
        String loginsProfessores = professores.stream().map(Professor::getLogin).collect(Collectors.joining(", "));
        String loginsEmpresas = empresas.stream().map(EmpresaParceira::getLogin).collect(Collectors.joining(", "));
        String loginsAlunos = alunos.stream().map(Aluno::getLogin).collect(Collectors.joining(", "));

        log.info("================= CREDENCIAIS DE TESTE (SEED) =================");
        log.info("Senha padrão para todos os usuários seed: 123456");
        log.info("PROFESSOR -> {}", loginsProfessores);
        log.info("EMPRESA   -> {}", loginsEmpresas);
        log.info("ALUNO     -> {}", loginsAlunos);
        log.info("Resumo de dados: {} professores, {} empresas, {} alunos, {} vantagens no total ({} novas nesta execução).",
                professores.size(), empresas.size(), alunos.size(), vantagemRepository.count(), vantagensCriadas);
        log.info("---------------------- ROTEIRO E2E FILA/EMAIL ------------------");
        log.info("1) Login professor (ex.: 'professor') e envie moedas para aluno (ex.: 'aluno').");
        log.info("2) Verifique RabbitMQ em http://localhost:15672 -> Exchange '{}' e Queue '{}' (routing key '{}').",
                rabbitExchange, rabbitEmailQueue, rabbitEmailRoutingKey);
        log.info("3) Verifique e-mails no MailHog: http://localhost:8025.");
        log.info("4) Login aluno (ex.: 'aluno') e resgate uma vantagem para disparar novo evento na fila.");
        log.info("===============================================================");
    }

    private record ProfessorSeed(String login,
                                 String nome,
                                 String email,
                                 String cpf,
                                 String departamento,
                                 String instituicaoNome,
                                 int saldo) {
    }

    private record EmpresaSeed(String login,
                               String nome,
                               String email,
                               String cnpj) {
    }

    private record AlunoSeed(String login,
                             String nome,
                             String email,
                             String cpf,
                             String rg,
                             String endereco,
                             String curso,
                             String instituicaoNome,
                             int saldo) {
    }

    private record VantagemSeed(String empresaLogin,
                                String nome,
                                String descricao,
                                String foto,
                                int custoMoedas) {
    }
}
