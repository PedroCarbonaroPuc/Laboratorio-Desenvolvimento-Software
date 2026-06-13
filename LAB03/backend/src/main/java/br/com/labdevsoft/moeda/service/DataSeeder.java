package br.com.labdevsoft.moeda.service;

import br.com.labdevsoft.moeda.dto.CoinTransferRequest;
import br.com.labdevsoft.moeda.model.Benefit;
import br.com.labdevsoft.moeda.model.Institution;
import br.com.labdevsoft.moeda.model.PartnerCompany;
import br.com.labdevsoft.moeda.model.Professor;
import br.com.labdevsoft.moeda.model.Student;
import br.com.labdevsoft.moeda.repository.BenefitRepository;
import br.com.labdevsoft.moeda.repository.CoinTransactionRepository;
import br.com.labdevsoft.moeda.repository.InstitutionRepository;
import br.com.labdevsoft.moeda.repository.PartnerCompanyRepository;
import br.com.labdevsoft.moeda.repository.ProfessorRepository;
import br.com.labdevsoft.moeda.repository.StudentRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final String PROFESSOR_PASSWORD = "Professor@123";
    private static final String STUDENT_PASSWORD = "Aluno@123";
    private static final String PARTNER_PASSWORD = "Parceiro@123";

    private final InstitutionRepository institutionRepository;
    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;
    private final PartnerCompanyRepository partnerCompanyRepository;
    private final BenefitRepository benefitRepository;
    private final CoinTransactionRepository coinTransactionRepository;
    private final SemesterAllocationService semesterAllocationService;
    private final ProfessorService professorService;
    private final RedemptionService redemptionService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<Institution> institutions = seedInstitutions();
        List<Professor> professors = seedProfessors(institutions);
        List<Student> students = seedStudents(institutions);
        List<PartnerCompany> partners = seedPartners();
        List<Benefit> benefits = seedBenefits(partners);

        seedTransactions(professors, students, benefits);
        printBootstrapPanel(professors, students, partners, benefits);
    }

    private List<Institution> seedInstitutions() {
        Institution puc = ensureInstitution("PUC Minas", "Cora", "Belo Horizonte");
        Institution ufmg = ensureInstitution("UFMG", "Pampulha", "Belo Horizonte");
        Institution cefet = ensureInstitution("CEFET-MG", "Nova Gameleira", "Belo Horizonte");

        List<Institution> institutions = List.of(puc, ufmg, cefet);
        log.info("Instituicoes disponiveis para cadastro: {}", institutions.size());
        return institutions;
    }

    private List<Professor> seedProfessors(List<Institution> institutions) {
        Institution puc = getInstitutionByName(institutions, "PUC Minas");
        Institution ufmg = getInstitutionByName(institutions, "UFMG");

        Professor ana = ensureProfessor(
                "Ana Ribeiro",
                "ana.ribeiro@instituicao.edu",
                "11111111111",
                "Engenharia de Software",
                puc.getId());

        Professor bruno = ensureProfessor(
                "Bruno Costa",
                "bruno.costa@instituicao.edu",
                "22222222222",
                "Ciencia da Computacao",
                ufmg.getId());

        return List.of(ana, bruno);
    }

    private List<Student> seedStudents(List<Institution> institutions) {
        Institution puc = getInstitutionByName(institutions, "PUC Minas");
        Institution ufmg = getInstitutionByName(institutions, "UFMG");
        Institution cefet = getInstitutionByName(institutions, "CEFET-MG");

        Student joao = ensureStudent(
                "Joao Martins",
                "joao.martins@aluno.edu",
                "33333333333",
                "MG1234567",
                "Rua dos Programadores, 101",
                "Engenharia de Software",
                puc.getId());

        Student beatriz = ensureStudent(
                "Beatriz Almeida",
                "beatriz.almeida@aluno.edu",
                "44444444444",
                "MG2345678",
                "Av. Inovacao, 202",
                "Ciencia da Computacao",
                ufmg.getId());

        Student carla = ensureStudent(
                "Carla Nunes",
                "carla.nunes@aluno.edu",
                "55555555555",
                "MG3456789",
                "Rua Campus Sul, 303",
                "Sistemas de Informacao",
                cefet.getId());

        return List.of(joao, beatriz, carla);
    }

    private List<PartnerCompany> seedPartners() {
        PartnerCompany nimbus = ensurePartner(
                "Nimbus Livraria",
                "Fernanda Lopes",
                "nimbus@parceiro.com",
                "12345678000100",
                "Rua das Letras, 45");

        PartnerCompany pulse = ensurePartner(
                "Pulse Tech Store",
                "Ricardo Silva",
                "pulse@parceiro.com",
                "98765432000199",
                "Av. Digital, 880");

        return List.of(nimbus, pulse);
    }

    private List<Benefit> seedBenefits(List<PartnerCompany> partners) {
        PartnerCompany nimbus = getPartnerByEmail(partners, "nimbus@parceiro.com");
        PartnerCompany pulse = getPartnerByEmail(partners, "pulse@parceiro.com");

        Benefit beneficioLivro = ensureBenefit(
                nimbus,
                "Vale livro tecnico",
                "Voucher de R$ 70 para livros de tecnologia e carreira.",
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
                120);

        Benefit beneficioCafe = ensureBenefit(
                nimbus,
                "Combo cafe + estudo",
                "1 bebida + 1 salgado para maratonas de estudo.",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
                90);

        Benefit beneficioHeadset = ensureBenefit(
                pulse,
                "Desconto em headset",
                "20% de desconto em headset para aulas e reunioes online.",
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
                180);

        Benefit beneficioTeclado = ensureBenefit(
                pulse,
                "Upgrade de teclado mecanico",
                "Cupom de R$ 120 para teclado mecanico selecionado.",
                "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
                210);

        return List.of(beneficioLivro, beneficioCafe, beneficioHeadset, beneficioTeclado);
    }

    private void seedTransactions(List<Professor> professors, List<Student> students, List<Benefit> benefits) {
        if (coinTransactionRepository.count() > 0) {
            return;
        }

        Professor ana = getProfessorByEmail(professors, "ana.ribeiro@instituicao.edu");
        Professor bruno = getProfessorByEmail(professors, "bruno.costa@instituicao.edu");
        Student joao = getStudentByEmail(students, "joao.martins@aluno.edu");
        Student beatriz = getStudentByEmail(students, "beatriz.almeida@aluno.edu");
        Student carla = getStudentByEmail(students, "carla.nunes@aluno.edu");

        semesterAllocationService.ensureProfessorAllowance(ana);
        semesterAllocationService.ensureProfessorAllowance(bruno);

        professorService.transferCoins(
                ana.getId(),
                new CoinTransferRequest(joao.getId(), 220L, "Excelente entrega no projeto de arquitetura."));
        professorService.transferCoins(
                ana.getId(),
                new CoinTransferRequest(beatriz.getId(), 180L, "Participacao consistente e apoio ao time."));
        professorService.transferCoins(
                bruno.getId(),
                new CoinTransferRequest(joao.getId(), 140L, "Otima apresentacao tecnica em sala."));
        professorService.transferCoins(
                bruno.getId(),
                new CoinTransferRequest(carla.getId(), 260L, "Melhoria de performance aplicada com sucesso."));

        Benefit livro = getBenefitByTitle(benefits, "Vale livro tecnico");
        Benefit cafe = getBenefitByTitle(benefits, "Combo cafe + estudo");

        redemptionService.redeem(joao.getId(), livro.getId());
        redemptionService.redeem(beatriz.getId(), cafe.getId());
    }

    private void printBootstrapPanel(
            List<Professor> professors,
            List<Student> students,
            List<PartnerCompany> partners,
            List<Benefit> benefits) {
        Professor ana = professorRepository.findByEmailIgnoreCase("ana.ribeiro@instituicao.edu")
                .orElseGet(() -> getProfessorByEmail(professors, "ana.ribeiro@instituicao.edu"));
        Professor bruno = professorRepository.findByEmailIgnoreCase("bruno.costa@instituicao.edu")
                .orElseGet(() -> getProfessorByEmail(professors, "bruno.costa@instituicao.edu"));
        Student joao = studentRepository.findByEmailIgnoreCase("joao.martins@aluno.edu")
                .orElseGet(() -> getStudentByEmail(students, "joao.martins@aluno.edu"));
        Student beatriz = studentRepository.findByEmailIgnoreCase("beatriz.almeida@aluno.edu")
                .orElseGet(() -> getStudentByEmail(students, "beatriz.almeida@aluno.edu"));
        Student carla = studentRepository.findByEmailIgnoreCase("carla.nunes@aluno.edu")
                .orElseGet(() -> getStudentByEmail(students, "carla.nunes@aluno.edu"));
        PartnerCompany nimbus = partnerCompanyRepository.findByEmailIgnoreCase("nimbus@parceiro.com")
                .orElseGet(() -> getPartnerByEmail(partners, "nimbus@parceiro.com"));
        PartnerCompany pulse = partnerCompanyRepository.findByEmailIgnoreCase("pulse@parceiro.com")
                .orElseGet(() -> getPartnerByEmail(partners, "pulse@parceiro.com"));

        log.info("==============================================================");
        log.info(" MOEDA ESTUDANTIL :: PAINEL DEMO CARREGADO");
        log.info("==============================================================");
        log.info(" Frontend: http://localhost:5173");
        log.info(" Backend : http://localhost:8080/api");
        log.info("--------------------------------------------------------------");
        log.info(" PROFESSORES (senha unica: {})", PROFESSOR_PASSWORD);
        log.info("  - {} | email={} | cpf={} | saldo={} moedas", ana.getName(), ana.getEmail(), ana.getCpf(), ana.getBalance());
        log.info("  - {} | email={} | cpf={} | saldo={} moedas", bruno.getName(), bruno.getEmail(), bruno.getCpf(), bruno.getBalance());
        log.info("--------------------------------------------------------------");
        log.info(" ALUNOS (senha unica: {})", STUDENT_PASSWORD);
        log.info("  - {} | email={} | cpf={} | saldo={} moedas", joao.getName(), joao.getEmail(), joao.getCpf(), joao.getBalance());
        log.info("  - {} | email={} | cpf={} | saldo={} moedas", beatriz.getName(), beatriz.getEmail(), beatriz.getCpf(), beatriz.getBalance());
        log.info("  - {} | email={} | cpf={} | saldo={} moedas", carla.getName(), carla.getEmail(), carla.getCpf(), carla.getBalance());
        log.info("--------------------------------------------------------------");
        log.info(" PARCEIROS (senha unica: {})", PARTNER_PASSWORD);
        log.info("  - {} | email={} | cnpj={}", nimbus.getCompanyName(), nimbus.getEmail(), nimbus.getCnpj());
        log.info("  - {} | email={} | cnpj={}", pulse.getCompanyName(), pulse.getEmail(), pulse.getCnpj());
        log.info("--------------------------------------------------------------");
        log.info(" VANTAGENS SEMEADAS: {}", benefits.size());
        for (Benefit benefit : benefits) {
            log.info("  - {} | custo={} moedas | ativo={}", benefit.getTitle(), benefit.getCostCoins(), benefit.isActive());
        }
        log.info("==============================================================");
    }

    private Institution ensureInstitution(String name, String campus, String city) {
        return institutionRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> institutionRepository.save(Institution.builder()
                        .name(name)
                        .campus(campus)
                        .city(city)
                        .createdAt(Instant.now())
                        .build()));
    }

    private Professor ensureProfessor(String name, String email, String cpf, String department, String institutionId) {
        return professorRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> professorRepository.save(Professor.builder()
                        .name(name)
                        .email(email)
                        .cpf(cpf)
                        .department(department)
                        .institutionId(institutionId)
                        .passwordHash(passwordEncoder.encode(PROFESSOR_PASSWORD))
                        .balance(0L)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()));
    }

    private Student ensureStudent(
            String name,
            String email,
            String cpf,
            String rg,
            String address,
            String course,
            String institutionId) {
        return studentRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> studentRepository.save(Student.builder()
                        .name(name)
                        .email(email)
                        .cpf(cpf)
                        .rg(rg)
                        .address(address)
                        .institutionId(institutionId)
                        .course(course)
                        .passwordHash(passwordEncoder.encode(STUDENT_PASSWORD))
                        .balance(0L)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()));
    }

    private PartnerCompany ensurePartner(String companyName, String contactName, String email, String cnpj, String address) {
        return partnerCompanyRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> partnerCompanyRepository.save(PartnerCompany.builder()
                        .companyName(companyName)
                        .contactName(contactName)
                        .email(email)
                        .cnpj(cnpj)
                        .address(address)
                        .passwordHash(passwordEncoder.encode(PARTNER_PASSWORD))
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()));
    }

    private Benefit ensureBenefit(PartnerCompany partner, String title, String description, String imageUrl, long costCoins) {
        return benefitRepository
                .findByPartnerIdAndTitleIgnoreCase(partner.getId(), title)
                .orElseGet(() -> benefitRepository.save(Benefit.builder()
                        .partnerId(partner.getId())
                        .title(title)
                        .description(description)
                        .imageUrl(imageUrl)
                        .costCoins(costCoins)
                        .active(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()));
    }

    private Institution getInstitutionByName(List<Institution> institutions, String name) {
        return institutions.stream()
                .filter(institution -> institution.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Instituicao nao encontrada: " + name));
    }

    private Professor getProfessorByEmail(List<Professor> professors, String email) {
        return professors.stream()
                .filter(professor -> professor.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Professor nao encontrado: " + email));
    }

    private Student getStudentByEmail(List<Student> students, String email) {
        return students.stream()
                .filter(student -> student.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Aluno nao encontrado: " + email));
    }

    private PartnerCompany getPartnerByEmail(List<PartnerCompany> partners, String email) {
        return partners.stream()
                .filter(partner -> partner.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Parceiro nao encontrado: " + email));
    }

    private Benefit getBenefitByTitle(List<Benefit> benefits, String title) {
        return benefits.stream()
                .filter(benefit -> benefit.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Vantagem nao encontrada: " + title));
    }
}
