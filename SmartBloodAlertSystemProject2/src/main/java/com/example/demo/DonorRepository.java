package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    List<Donor> findByBloodType(String bloodType);

    long countByBloodTypeAndStatus(String bloodType, String status);
}

