package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/donor/register")
    public String donorRegister() {
        return "donor-registration";
    }

    @GetMapping("/blood/request")
    public String bloodRequest() {
        return "blood-request";
    }

    @GetMapping("/request-dashboard")
    public String requestDashboard() {
        return "request-dashboard";
    }

    @GetMapping("/admin/login")
    public String adminLogin() {
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }
}
