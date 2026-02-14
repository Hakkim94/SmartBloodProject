package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donor")
@CrossOrigin(origins = "*")
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private DonorService donorService;

    @GetMapping("/best")
    public ResponseEntity<?> bestDonors(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam String bloodType,
            @RequestParam(defaultValue = "5") int k) {

        return ResponseEntity.ok(
                donorService.findBestDonors(lat, lon, bloodType, k));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getDonorCount() {
        long count = donorRepository.count();
        System.out.println("API Called: /api/donor/count -> Total Donors: " + count);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/availability")
    public ResponseEntity<java.util.Map<String, Long>> getBloodAvailability() {
        java.util.Map<String, Long> availability = new java.util.HashMap<>();
        String[] groups = { "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-" };
        for (String group : groups) {
            availability.put(group, donorRepository.countByBloodTypeAndStatus(group, "ACTIVE"));
        }
        System.out.println("API Called: /api/donor/availability -> " + availability);
        return ResponseEntity.ok(availability);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Donor donor) {
        donorRepository.save(donor);
        return ResponseEntity.ok("Donor Registered Successfully!");
    }
}
