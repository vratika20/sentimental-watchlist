package com.sentinel.watchlist.service;

import com.sentinel.watchlist.dto.UserCreateRequest;
import com.sentinel.watchlist.dto.UserResponse;
import com.sentinel.watchlist.entity.User;
import com.sentinel.watchlist.exception.BadRequestException;
import com.sentinel.watchlist.exception.ResourceNotFoundException;
import com.sentinel.watchlist.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("User with email '" + request.email() + "' already exists");
        }
        User user = new User(request.name(), request.email());
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse loginUser(com.sentinel.watchlist.dto.UserLoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or user not found"));
        return mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserResponse(Long id) {
        User user = getUserEntity(id);
        return mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public void updateLastActiveTimestamp(Long userId, ZonedDateTime timestamp) {
        User user = getUserEntity(userId);
        user.setLastActiveTimestamp(timestamp);
        userRepository.save(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getLastActiveTimestamp(),
                user.getCreatedAt()
        );
    }
}
