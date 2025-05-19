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

/**
 * UserServiceTest는 UserServiceImpl의 주요 기능에 대한 단위 테스트 수행.
 * 테스트는 각 기능이 비즈니스 요구사항에 맞게 동작하는지를 검증.
 * 외부 의존성은 Mockito로 모킹.
 */
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

    /**
     * 1. 회원가입 성공 (signup_success)
     *    - 이메일과 닉네임이 중복되지 않은 경우, 비밀번호를 암호화하고 주소를 저장한 뒤 유저를 저장한다.
     *    - 저장된 User 엔티티가 UserResponse로 변환되어 올바르게 반환되는지 검증한다.
     * */
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

    /**
     * 2. 회원가입 실패 - 이메일 중복 (signup_fail_duplicate_email)
     *    - 이미 존재하는 이메일로 가입 요청 시, ResponseStatusException 예외를 발생시킨다.
     *    - 예외 메시지에 "이메일이 중복되었습니다"가 포함되어야 한다.
     * */
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

    /**
     * 3. 로그인 성공 (login_success)
     *    - 이메일로 유저를 조회하고, 비밀번호가 일치하는 경우 로그인에 성공한다.
     *    - 결과적으로 반환된 UserResponse의 이메일이 기대값과 일치하는지 검증한다.
     */
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

    /**
     * 4. 로그인 실패 - 비밀번호 불일치 (login_fail_invalid_password)
     *    - 이메일은 존재하지만 비밀번호가 일치하지 않을 경우, ResponseStatusException 예외를 발생시킨다.
     *    - 예외 메시지에 "아이디 또는 비밀번호가 일치하지 않습니다"가 포함되어야 한다.
     */
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

    /**
     * 5. 이메일로 사용자 조회 성공 (getUserByEmail_success)
     *    - 이메일을 기반으로 유저를 조회할 수 있으며, UserResponse로 올바르게 변환된다.
     *    - 반환된 결과의 이메일이 정확히 매핑되었는지 확인한다.
     */
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

    /**
     * 6. 이메일로 사용자 조회 실패 (getUserByEmail_fail)
     *    - 존재하지 않는 이메일로 조회할 경우, ResponseStatusException 예외가 발생한다.
     *    - 예외 메시지에 "유저 정보가 존재하지 않습니다"가 포함되어야 한다.
     */
    @Test
    @DisplayName("이메일로 사용자 조회 실패")
    void getUserByEmail_fail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByEmail("test@example.com"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("유저 정보가 존재하지 않습니다");
    }
}

