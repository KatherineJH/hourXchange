package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.UserDTO;
import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.entity.Address;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.repository.AddressRepository;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("회원가입 성공")
    void signup_success() {
        UserRequest request = UserRequest.builder()
                .email("test@example.com")
                .username("tester")
                .password("password123")
                .address(new AddressRequest("서울시", "서초구", "양재동", "101-202"))
                .build();

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(addressRepository.save(any())).thenReturn(Address.of(request.getAddress()));
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse result = userService.signup(request);

        assertThat(result.getEmail()).isEqualTo("test@example.com");
        assertThat(result.getUsername()).isEqualTo("tester");
    }

    @Test
    @DisplayName("회원가입 실패 - 이메일 중복")
    void signup_fail_duplicate_email() {
        UserRequest request = UserRequest.builder()
                .email("test@example.com")
                .username("tester")
                .password("password123")
                .build();

        when(userRepository.existsByEmail(any())).thenReturn(true);

        assertThatThrownBy(() -> userService.signup(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("이메일이 중복되었습니다");
    }

    @Test
    @DisplayName("로그인 성공")
    void login_success() {
        User user = User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);

        UserDTO dto = UserDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();
        UserResponse result = userService.login(dto);

        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("로그인 실패 - 비밀번호 불일치")
    void login_fail_invalid_password() {
        User user = User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        UserDTO dto = UserDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        assertThatThrownBy(() -> userService.login(dto))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("아이디 또는 비밀번호가 일치하지 않습니다");
    }

    @Test
    @DisplayName("이메일로 사용자 조회 성공")
    void getUserByEmail_success() {
        User user = User.builder()
                .email("test@example.com")
                .username("tester")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserResponse result = userService.getUserByEmail("test@example.com");

        assertThat(result.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("이메일로 사용자 조회 실패")
    void getUserByEmail_fail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByEmail("test@example.com"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("유저 정보가 존재하지 않습니다");
    }
}

