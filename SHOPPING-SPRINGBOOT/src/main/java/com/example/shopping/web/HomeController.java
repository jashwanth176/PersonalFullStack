package com.example.shopping.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Shopping API is running. Try GET /shoppingapi/api/items";
    }
}
