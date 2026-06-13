package br.com.labdevsoft.moeda.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.email.mock-enabled:true}")
    private boolean mockEnabled;

    @Value("${spring.mail.username:no-reply@moedaestudantil.local}")
    private String senderAddress;

    public void notifyCoinReceived(String recipientEmail, String studentName, String professorName, long amount, String message) {
        String subject = "Voce recebeu moedas de merito";
        String body = "Ola " + studentName + ",\n\n"
                + "Voce recebeu " + amount + " moedas do professor " + professorName + ".\n"
                + "Mensagem: " + message + "\n\n"
                + "Acesse o sistema para consultar seu extrato.\n";

        sendEmail(recipientEmail, subject, body);
    }

    public void notifyRedemptionToStudent(
            String recipientEmail,
            String studentName,
            String benefitTitle,
            String couponCode,
            long costCoins) {
        String subject = "Cupom gerado para seu resgate";
        String body = "Ola " + studentName + ",\n\n"
                + "Seu resgate foi confirmado com sucesso.\n"
                + "Vantagem: " + benefitTitle + "\n"
                + "Custo: " + costCoins + " moedas\n"
                + "Codigo do cupom: " + couponCode + "\n\n"
                + "Apresente este codigo no parceiro para validar a troca.\n";

        sendEmail(recipientEmail, subject, body);
    }

    public void notifyRedemptionToPartner(
            String recipientEmail,
            String partnerName,
            String studentName,
            String benefitTitle,
            String couponCode) {
        String subject = "Novo cupom para conferencia de resgate";
        String body = "Ola " + partnerName + ",\n\n"
                + "Um aluno realizou um resgate no sistema de moeda estudantil.\n"
                + "Aluno: " + studentName + "\n"
                + "Vantagem: " + benefitTitle + "\n"
                + "Codigo do cupom: " + couponCode + "\n\n"
                + "Use o codigo para conferencia no atendimento presencial.\n";

        sendEmail(recipientEmail, subject, body);
    }

    private void sendEmail(String recipientEmail, String subject, String body) {
        if (mockEnabled) {
            log.info("[EMAIL-MOCK] to={} subject={} body={} ", recipientEmail, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderAddress);
            message.setTo(recipientEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception exception) {
            log.warn("Falha ao enviar email para {}. Detalhes: {}", recipientEmail, exception.getMessage());
        }
    }
}
