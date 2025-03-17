package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String userName, @RequestParam String userPassword) {
        User user=new User(userName, userPassword);
        Integer login = userService.loginUser(user);
        if (login >0) {
            String token = "JWT-" + user.getUserId();
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

}
