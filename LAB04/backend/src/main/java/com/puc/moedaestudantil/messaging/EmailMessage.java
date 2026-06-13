package com.puc.moedaestudantil.messaging;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class EmailMessage implements Serializable {

    private String to;
    private String subject;
    private String template;
    private Map<String, String> data;

    public EmailMessage() {
        this.data = new HashMap<>();
    }

    public EmailMessage(String to, String subject, String template, Map<String, String> data) {
        this.to = to;
        this.subject = subject;
        this.template = template;
        this.data = data != null ? data : new HashMap<>();
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }
}
