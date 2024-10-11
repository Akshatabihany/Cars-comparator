package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")  // Maps the root URL to this method
    public String home() {
        return "index";  // This should correspond to index.html in templates folder
    }

    @GetMapping("/car-details.html")
    public String getCarDetailsPage() {
        return "carDetails"; // Ensure car-details.html is located in src/main/resources/templates/
    }

    @GetMapping("/compare.html")
    public String getComparePage() {
        return "compare"; // Ensure car-details.html is located in src/main/resources/templates/
    }
}
