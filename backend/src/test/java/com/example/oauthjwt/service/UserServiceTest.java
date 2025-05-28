package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.AddressRequest;
import com.example.oauthjwt.dto.request.UserRequest;
import com.example.oauthjwt.dto.response.UserResponse;
import com.example.oauthjwt.entity.Address;
import com.example.oauthjwt.entity.User;
import com.example.oauthjwt.entity.Wallet;
import com.example.oauthjwt.entity.type.UserRole;
import com.example.oauthjwt.entity.type.UserStatus;
import com.example.oauthjwt.repository.UserRepository;
import com.example.oauthjwt.service.impl.UserServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserServiceImpl userService;

    private UserRequest makeUserRequest() {
        return UserRequest.builder()
                .email("test@a.com")
                .password("pw")
                .name("홍길동")
                .username("tester")
                .birthdate(LocalDate.of(2000, 1, 1))
                .address(AddressRequest.builder()
                        .zonecode("12345")
                        .roadAddress("서울로 1길")
                        .jibunAddress("")
                        .detailAddress("")
                        .build())
                .build();
    }

    private User makeUser() {
        User u = User.builder()
                .id(1L)
                .email("test@a.com")
                .password("encodedpw")
                .name("홍길동")
                .username("tester")
                .birthdate(LocalDate.of(2000, 1, 1))
                .role(UserRole.ROLE_USER)
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .wallet(null)
                .address(null)
                .build();
        return u;
    }

    @Test
    @DisplayName("회원가입 성공")
    void signup_success() {
        // given
        UserRequest req = makeUserRequest();
        given(userRepository.existsByEmail("test@a.com")).willReturn(false);
        given(userRepository.existsByUsername("tester")).willReturn(false);
        given(passwordEncoder.encode("pw")).willReturn("encodedpw");
        given(userRepository.save(any(User.class)))
                .willAnswer(inv -> {
                    User u = inv.getArgument(0);
                    u.setId(1L);
                    return u;
                });

        // when
        UserResponse res = userService.signup(req);

        // then
        assertThat(res.getEmail()).isEqualTo("test@a.com");
        assertThat(res.getId()).isEqualTo(1L);
        then(userRepository).should().save(any(User.class));
    }

    @Test
    @DisplayName("회원가입: 이메일 중복")
    void signup_duplicate_email() {
        UserRequest req = makeUserRequest();
        given(userRepository.existsByEmail("test@a.com")).willReturn(true);

        assertThatThrownBy(() -> userService.signup(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    @DisplayName("회원가입: 닉네임 중복")
    void signup_duplicate_username() {
        UserRequest req = makeUserRequest();
        given(userRepository.existsByEmail("test@a.com")).willReturn(false);
        given(userRepository.existsByUsername("tester")).willReturn(true);

        assertThatThrownBy(() -> userService.signup(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    @DisplayName("로그인: 이메일/비밀번호 일치하면 성공")
    void login_success() {
        User user = makeUser();
        UserRequest req = UserRequest.builder().email("test@a.com").password("pw").build();
        given(userRepository.findByEmail("test@a.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("pw", "encodedpw")).willReturn(true);

        UserResponse res = userService.login(req);

        assertThat(res.getEmail()).isEqualTo("test@a.com");
        then(userRepository).should().findByEmail("test@a.com");
        then(passwordEncoder).should().matches("pw", "encodedpw");
    }

    @Test
    @DisplayName("로그인: 이메일 미존재")
    void login_email_not_found() {
        UserRequest req = UserRequest.builder().email("none@a.com").password("pw").build();
        given(userRepository.findByEmail("none@a.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.login(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    @DisplayName("로그인: 비밀번호 불일치")
    void login_pw_not_match() {
        User user = makeUser();
        UserRequest req = UserRequest.builder().email("test@a.com").password("wrongpw").build();
        given(userRepository.findByEmail("test@a.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("wrongpw", "encodedpw")).willReturn(false);

        assertThatThrownBy(() -> userService.login(req))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> {
                    ResponseStatusException rse = (ResponseStatusException) ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                    assertThat(rse.getReason()).isEqualTo("아이디 또는 비밀번호가 일치하지 않습니다.");
                });
    }

    @Test
    @DisplayName("이메일로 유저 조회 성공")
    void getUserByEmail_success() {
        User user = makeUser();
        given(userRepository.findByEmail("test@a.com")).willReturn(Optional.of(user));

        UserResponse res = userService.getUserByEmail("test@a.com");

        assertThat(res.getEmail()).isEqualTo("test@a.com");
    }

    @Test
    @DisplayName("이메일로 유저 조회: 미존재 시 예외")
    void getUserByEmail_not_found() {
        given(userRepository.findByEmail("none@a.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserByEmail("none@a.com"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex -> assertThat(((ResponseStatusException) ex).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
    }

    @Test
    @DisplayName("모든 유저 조회")
    void getAllUsers() {
        User u1 = makeUser();
        User u2 = makeUser(); u2.setId(2L); u2.setEmail("u2@a.com");
        given(userRepository.findAll()).willReturn(List.of(u1, u2));

        List<UserResponse> users = userService.getAllUsers();

        assertThat(users).hasSize(2);
        assertThat(users.get(0).getEmail()).isEqualTo("test@a.com");
        assertThat(users.get(1).getEmail()).isEqualTo("u2@a.com");
    }

    @Test
    @DisplayName("ID로 유저 조회 성공")
    void getUserById_success() {
        User user = makeUser();
        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        UserResponse res = userService.getUserById(1L);

        assertThat(res.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("ID로 유저 조회: 미존재")
    void getUserById_not_found() {
        given(userRepository.findById(2L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(2L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("유저 페이지네이션 조회")
    void getUserList() {
        User u1 = makeUser();
        User u2 = makeUser(); u2.setId(2L); u2.setEmail("u2@a.com");

        Pageable pageable = PageRequest.of(0, 2);
        Page<User> page = new PageImpl<>(List.of(u1, u2), pageable, 2);

        given(userRepository.findAll(pageable)).willReturn(page);

        Page<UserResponse> res = userService.getUserList(pageable);

        assertThat(res.getTotalElements()).isEqualTo(2);
        assertThat(res.getContent().get(1).getEmail()).isEqualTo("u2@a.com");
    }
}
