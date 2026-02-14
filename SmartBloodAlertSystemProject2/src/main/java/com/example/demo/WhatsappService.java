package com.example.demo;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsappService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.from}")
    private String fromWhatsApp;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public void sendWhatsApp(String toNumber, String message) {

        Message.creator(
                new PhoneNumber("whatsapp:+91" + toNumber),
                new PhoneNumber(fromWhatsApp),
                message).create();

        System.out.println("WhatsApp message SENT via Twilio to " + toNumber);
    }
}
