package com.example.demo.service.impl;

import com.example.demo.mapper.UserMapper;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper userMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User authenticateUser(String userName, String userPassword) {
        User user = userMapper.loginUser(userName);
        if (user != null && passwordEncoder.matches(userPassword, user.getUserPassword())) {
            return user;
        }
        return null;
    }
    @Override
    public User loginUser(String userName) {
        return userMapper.loginUser(userName);
    }

}
