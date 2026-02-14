package com.example.demo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private DonationRepository donationRepository;
    
    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin admin) {

        Optional<Admin> foundAdmin =
                adminRepository.findByUsernameAndPassword(
                        admin.getUsername(),
                        admin.getPassword()
                );

        if (foundAdmin.isPresent()) {
            return ResponseEntity.ok("Admin login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid admin credentials");
        }
    }
    
    //Total Donor endpoint
    @GetMapping("/total-donors")
    public ResponseEntity<Long> getTotalDonors() {

        long totalDonors = donorRepository.count();
        return ResponseEntity.ok(totalDonors);
    }
    
    //Total donations endpoimt
    @GetMapping("/total-donations")
    public ResponseEntity<Long> getTotalDonations() {

        long totalDonations = donationRepository.count();
        return ResponseEntity.ok(totalDonations);
    }
    
    @GetMapping("/blood-group-availability")
    public Map<String, Long> getBloodGroupAvailability() {

        Map<String, Long> availability = new HashMap<>();

        availability.put("O+", donorRepository.countByBloodTypeAndStatus("O+", "ACTIVE"));
        availability.put("O-", donorRepository.countByBloodTypeAndStatus("O-", "ACTIVE"));
        availability.put("A+", donorRepository.countByBloodTypeAndStatus("A+", "ACTIVE"));
        availability.put("A-", donorRepository.countByBloodTypeAndStatus("A-", "ACTIVE"));
        availability.put("B+", donorRepository.countByBloodTypeAndStatus("B+", "ACTIVE"));
        availability.put("B-", donorRepository.countByBloodTypeAndStatus("B-", "ACTIVE"));
        availability.put("AB+", donorRepository.countByBloodTypeAndStatus("AB+", "ACTIVE"));
        availability.put("AB-", donorRepository.countByBloodTypeAndStatus("AB-", "ACTIVE"));

        return availability;
    }
    
    @PostMapping("/emergency-request")
    public EmergencyRequest createEmergency(
            @RequestBody EmergencyRequest request) {

        request.setStatus("PENDING");
        return emergencyRequestRepository.save(request);
    }

    @GetMapping("/emergency-requests")
    public List<EmergencyRequest> getAllEmergencies() {
        return emergencyRequestRepository.findAll();
    }



}

