package com.example.demo;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private WhatsappService whatsappService;

    // ===============================
    // MAIN BUSINESS METHOD
    // ===============================
    public List<Donor> processBloodRequest(RecipientRequest req) {

        if (req == null || req.getBloodType() == null) {
            throw new IllegalArgumentException("Invalid blood request");
        }

        List<Donor> best = findBestDonors(
                req.getLatitude(),
                req.getLongitude(),
                req.getBloodType(),
                5
        );

        String msg = buildMessage(req);

        for (Donor d : best) {
            try {
                smsService.sendSms(d.getPhoneNumber(), msg);
            } catch (Exception e) {
                System.out.println("SMS failed: " + e.getMessage());
            }

            try {
                whatsappService.sendWhatsApp(d.getPhoneNumber(), msg);
            } catch (Exception e) {
                System.out.println("WhatsApp failed: " + e.getMessage());
            }
        }

        return best;
    }

    // ===============================
    // FIND NEAREST DONORS (KNN style)
    // ===============================
    public List<Donor> findBestDonors(
            double lat,
            double lon,
            String bloodType,
            int k
    ) {

        List<Donor> donors = donorRepository.findByBloodType(bloodType);

        return donors.stream()
                .sorted(Comparator.comparingDouble(
                        d -> Haversine.distance(
                                lat, lon,
                                d.getLatitude(), d.getLongitude()
                        )
                ))
                .limit(k)
                .collect(Collectors.toList());
    }

    // ===============================
    // MESSAGE BUILDER
    // ===============================
    private String buildMessage(RecipientRequest req) {

        return "🚨 URGENT BLOOD REQUEST 🚨\n" +
               "Blood Group: " + req.getBloodType() + "\n" +
               "Location: " + req.getLocation() + "\n" +
               "A nearby patient needs help.\n" +
               "Please donate if possible ❤️";
    }
}
