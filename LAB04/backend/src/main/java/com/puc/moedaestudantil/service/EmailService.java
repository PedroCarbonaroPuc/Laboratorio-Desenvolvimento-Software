package com.puc.moedaestudantil.service;

import com.puc.moedaestudantil.messaging.EmailMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender defaultMailSender;
    private final TemplateEngine templateEngine;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${app.mail.provider:smtp}")
    private String provider;

    @Value("${app.mail.from:no-reply@moedaestudantil.com}")
    private String from;

    @Value("${spring.mail.host:localhost}")
    private String smtpHost;

    @Value("${spring.mail.port:25}")
    private int smtpPort;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    @Value("${spring.mail.properties.mail.smtp.auth:false}")
    private boolean smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:false}")
    private boolean smtpStarttls;

    @Value("${app.mail.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.mail.resend-from:onboarding@resend.dev}")
    private String resendFrom;

    @Value("${app.mail.resend-url:https://api.resend.com/emails}")
    private String resendUrl;

    public EmailService(JavaMailSender defaultMailSender,
                        TemplateEngine templateEngine,
                        ObjectMapper objectMapper) {
        this.defaultMailSender = defaultMailSender;
        this.templateEngine = templateEngine;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    }

    public void enviarEmail(EmailMessage message) {
        try {
            Context context = new Context();
            for (Map.Entry<String, String> entry : message.getData().entrySet()) {
                context.setVariable(entry.getKey(), entry.getValue());
            }

            String templateName = resolverTemplate(message.getTemplate());
            String html = templateEngine.process(templateName, context);

            boolean enviado = false;
            if ("resend".equalsIgnoreCase(provider)) {
                enviado = sendViaResend(message, html, templateName);
            }

            if (!enviado) {
                sendViaSmtp(message, html, templateName);
            }
        } catch (Exception ex) {
            log.error("Não foi possível enviar email para {} ({}): {}",
                    message.getTo(), ex.getClass().getSimpleName(), ex.getMessage());
        }
    }

    private boolean sendViaResend(EmailMessage message, String html, String templateName) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            log.warn("APP_MAIL_PROVIDER=resend, mas APP_MAIL_RESEND_API_KEY não está definido. Fallback para SMTP.");
            return false;
        }

        try {
            Map<String, Object> payload = Map.of(
                    "from", resendFrom,
                    "to", List.of(message.getTo()),
                    "subject", message.getSubject(),
                    "html", html
            );

            String body = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(resendUrl))
                    .timeout(Duration.ofSeconds(20))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int status = response.statusCode();
            if (status >= 200 && status < 300) {
                log.info("Email enviado para {} (template {}, provider resend)", message.getTo(), templateName);
                return true;
            }

            log.error("Falha no Resend para {} (status {}): {}", message.getTo(), status, response.body());
            return false;
        } catch (Exception ex) {
            log.error("Erro no envio via Resend para {} ({}): {}",
                    message.getTo(), ex.getClass().getSimpleName(), ex.getMessage());
            return false;
        }
    }

    private void sendViaSmtp(EmailMessage message, String html, String templateName) throws Exception {
        JavaMailSender sender = buildMailSender();
        MimeMessage mimeMessage = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(message.getTo());
        helper.setSubject(message.getSubject());
        helper.setText(html, true);
        sender.send(mimeMessage);
        log.info("Email enviado para {} (template {}, smtp {}:{})", message.getTo(), templateName, smtpHost, smtpPort);
    }

    private JavaMailSender buildMailSender() {
        if (smtpHost == null || smtpHost.isBlank()) {
            return defaultMailSender;
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(smtpHost);
        sender.setPort(smtpPort);

        if (smtpUsername != null && !smtpUsername.isBlank()) {
            sender.setUsername(smtpUsername);
        }
        if (smtpPassword != null && !smtpPassword.isBlank()) {
            sender.setPassword(smtpPassword);
        }

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", String.valueOf(smtpAuth));
        props.put("mail.smtp.starttls.enable", String.valueOf(smtpStarttls));
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.debug", "false");
        return sender;
    }

    private String resolverTemplate(String template) {
        return switch (template) {
            case "RECEBIMENTO_MOEDAS" -> "email-recebimento-moedas";
            case "CONFIRMACAO_ENVIO" -> "email-confirmacao-envio";
            case "CUPOM_ALUNO" -> "email-cupom-aluno";
            case "CONFERENCIA_EMPRESA" -> "email-conferencia-empresa";
            default -> "email-recebimento-moedas";
        };
    }
}
