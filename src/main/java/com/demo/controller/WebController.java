package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/car-details.html")
    public String getCarDetailsPage() {
        return "carDetails";
    }

    @GetMapping("/compare.html")
    public String getComparePage() {
        return "compare"; 
    }
}
