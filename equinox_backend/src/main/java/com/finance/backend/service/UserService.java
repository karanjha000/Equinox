package com.finance.backend.service;

import com.finance.backend.dto.RoleUpdateRequest;
import com.finance.backend.dto.UserResponse;
import com.finance.backend.model.User;
import com.finance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public List<UserResponse> getAllUser(){
        return userRepository.findAll()
                .stream()
                .map(authService::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
                return authService.mapToResponse(user);
    }
    public UserResponse updateUserRole(Long id, RoleUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setRole(request.getRole());
        return authService.mapToResponse(userRepository.save(user));
    }
    public UserResponse toggleUserStatus(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
                user.setActive(!user.isActive());
                return authService.mapToResponse(userRepository.save(user));
    }
    public void deleteUser(Long id){
        if (!userRepository.existsById(id)){
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
