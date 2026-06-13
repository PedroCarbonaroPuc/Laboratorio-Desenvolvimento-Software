package com.puc.moedaestudantil.messaging;

import com.puc.moedaestudantil.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EmailConsumer {

    private static final Logger log = LoggerFactory.getLogger(EmailConsumer.class);

    private final EmailService emailService;

    public EmailConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = "${app.rabbitmq.queue-email}")
    public void consumir(EmailMessage message) {
        log.info("Consumindo evento de email para: {}", message.getTo());
        try {
            emailService.enviarEmail(message);
        } catch (Exception ex) {
            log.error("Erro ao processar email para {}: {}", message.getTo(), ex.getMessage());
        }
    }
}
