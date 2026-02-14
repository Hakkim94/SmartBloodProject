package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BloodController {

    @Autowired
    private DonorService donorService;

    // ===============================
    // MAIN BLOOD REQUEST ENDPOINT
    // ===============================
    @PostMapping("/request-blood")
    public ResponseEntity<?> requestBlood(@RequestBody RecipientRequest req) {

        try {
            List<Donor> alertedDonors = donorService.processBloodRequest(req);

            if (alertedDonors.isEmpty()) {
                return ResponseEntity.ok("No matching donors available nearby.");
            }

            return ResponseEntity.ok(alertedDonors);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
