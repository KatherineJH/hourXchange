package com.example.oauthjwt.service;

import com.example.oauthjwt.dto.request.DonationRequest;
import com.example.oauthjwt.dto.response.DonationHistoryResponse;
import com.example.oauthjwt.dto.response.DonationResponse;
import com.example.oauthjwt.dto.response.PageResult;
import com.example.oauthjwt.entity.*;
import com.example.oauthjwt.entity.type.DonationStatus;
import com.example.oauthjwt.repository.*;

import com.example.oauthjwt.service.impl.CustomUserDetails;
import com.example.oauthjwt.service.impl.DonationServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    @Mock private DonationRepository donationRepository;
    @Mock private DonationHistoryRepository donationHistoryRepository;
    @Mock private WalletRepository walletRepository;
    @Mock private UserRepository userRepository;
    @Mock private DonationImageRepository donationImageRepository;
    @Mock private StringRedisTemplate stringRedisTemplate;

    @InjectMocks private DonationServiceImpl donationService;

    private CustomUserDetails userDetails(Long id) {
        User u = new User();
        u.setId(id);
        return new CustomUserDetails(u);
    }

    private DonationRequest sampleRequest() {
        return DonationRequest.builder()
                .purpose("help")
                .targetAmount(1000)
                .title("t")
                .description("d")
                .startDate(LocalDate.now().minusDays(1))
                .endDate(LocalDate.now().plusDays(10))
                .images(List.of("u1","u2"))
                .build();
    }

    @Test @DisplayName("createDonation: 정상 생성")
    void createDonation_Success() {
        var req = sampleRequest();
        var cd = userDetails(1L);
        User author = new User(); author.setId(1L);
        given(userRepository.findById(1L)).willReturn(Optional.of(author));
        given(donationImageRepository.existsByImgUrl("u1")).willReturn(false);
        given(donationImageRepository.existsByImgUrl("u2")).willReturn(false);
        given(donationRepository.save(any(Donation.class)))
                .willAnswer(inv -> {
                    Donation d = inv.getArgument(0);
                    d.setId(5L);
                    return d;
                });

        DonationResponse res = donationService.createDonation(req, cd);

        assertThat(res.getId()).isEqualTo(5L);
        assertThat(res.getImages()).containsExactly("u1","u2");
    }

    @Test @DisplayName("createDonation: 이미지 중복 예외")
    void createDonation_DuplicateImage() {
        var req = sampleRequest();
        var cd = userDetails(2L);
        User author = new User(); author.setId(2L);
        given(userRepository.findById(2L)).willReturn(Optional.of(author));
        given(donationImageRepository.existsByImgUrl("u1")).willReturn(true);

        assertThatThrownBy(() -> donationService.createDonation(req, cd))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex->{
                    var rse=(ResponseStatusException)ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                });
    }

    @Test @DisplayName("update: 정상 수정")
    void update_Success() {
        var req = sampleRequest();
        var cd = userDetails(3L);

        Donation orig = Donation.of(req, new User(){ { setId(3L);} });
        orig.setId(7L); orig.setCurrentAmount(100);
        when(userRepository.findById(3L)).thenReturn(Optional.of(orig.getAuthor()));
        when(donationRepository.findById(7L)).thenReturn(Optional.of(orig));
        willDoNothing().given(donationImageRepository).deleteByDonationId(7L);
        when(donationImageRepository.existsByImgUrl(anyString())).thenReturn(false);
        when(donationRepository.save(any(Donation.class))).thenAnswer(inv->inv.getArgument(0));

        DonationResponse res = donationService.update(7L, req, cd);

        assertThat(res.getId()).isEqualTo(7L);
        assertThat(res.getTitle()).isEqualTo("t");
    }

    @Test @DisplayName("update: 권한 없으면 예외")
    void update_NoAuth() {
        var req = sampleRequest();
        var cd = userDetails(4L);

        Donation orig = Donation.of(req, new User(){ { setId(99L);} });
        orig.setId(8L);
        when(userRepository.findById(4L)).thenReturn(Optional.of(new User(){ { setId(4L);} }));
        when(donationRepository.findById(8L)).thenReturn(Optional.of(orig));

        assertThatThrownBy(() -> donationService.update(8L, req, cd))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(ex->{
                    var rse=(ResponseStatusException)ex;
                    assertThat(rse.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
                });
    }

    @Test @DisplayName("getDonation: 첫 방문 시 view++, 캐시 등록")
    void getDonation_First() {
        Donation d = Donation.of(sampleRequest(), new User(){ { setId(5L);} });
        d.setId(5L);
        String key="view donationId: 5, by: key";
        when(donationRepository.findById(5L)).thenReturn(Optional.of(d));
        when(stringRedisTemplate.hasKey(key)).thenReturn(false);
        var ops=mock(ValueOperations.class);
        when(stringRedisTemplate.opsForValue()).thenReturn(ops);
        when(donationRepository.save(any())).thenReturn(d);

        DonationResponse res=donationService.getDonation(5L,"key");

        assertThat(res.getId()).isEqualTo(5L);
        verify(ops).set(eq(key),"1",eq(Duration.ofHours(24)));
    }

    @Test @DisplayName("findAll: 페이징 결과 반환")
    void findAll_Success() {
        Donation d = Donation.of(sampleRequest(), new User(){ { setId(6L);} });
        Page<Donation> page=new PageImpl<>(List.of(d), PageRequest.of(0,1,Sort.by("createdAt").descending()),1);
        when(donationRepository.findAll(PageRequest.of(0,1,Sort.by("createdAt").descending()))).thenReturn(page);

        PageResult<DonationResponse> pr=donationService.findAll(0,1);

        assertThat(pr.getTotalElements()).isEqualTo(1);
        assertThat(pr.getContent()).hasSize(1);
    }

    @Test @DisplayName("delete: 정상 삭제 및 환불")
    void delete_Success() {
        var cd=userDetails(7L);
        Donation d = Donation.of(sampleRequest(), new User(){ { setId(7L);} });
        d.setId(10L);
        when(donationRepository.findById(10L)).thenReturn(Optional.of(d));
        // not cancelled
        d.setStatus(DonationStatus.ONGOING);
        List<Object[]> rows= (List<Object[]>) List.of(new Object[]{8L, 4});
        when(donationHistoryRepository.findUserIdAndTotalHoursByDonation(10L)).thenReturn(rows);
        User u=new User(); u.setId(8L);
        when(userRepository.findById(8L)).thenReturn(Optional.of(u));
        when(donationHistoryRepository.save(any(DonationHistory.class)))
                .thenAnswer(inv->inv.getArgument(0));

        List<DonationHistoryResponse> out=donationService.delete(10L, cd);

        assertThat(out).hasSize(1);
        verify(walletRepository).addCredit(8L,4);
    }

    @Test @DisplayName("getTopByProgress/ViewCount/Recent")
    void getTops() {
        Donation d=Donation.of(sampleRequest(), new User(){ { setId(9L);} });
        List<Donation> list=List.of(d);
        when(donationRepository.findTopByProgress(eq(DonationStatus.ONGOING), any(LocalDate.class), eq(PageRequest.of(0,1))))
                .thenReturn(list);
        when(donationRepository.findTopByViewCount(eq(DonationStatus.ONGOING), any(LocalDate.class), eq(PageRequest.of(0,1))))
                .thenReturn(list);
        when(donationRepository.findTopByCreatedAt(eq(DonationStatus.ONGOING), any(LocalDate.class), eq(PageRequest.of(0,1))))
                .thenReturn(list);

        assertThat(donationService.getTopByProgress(1)).hasSize(1);
        assertThat(donationService.getTopByViewCount(1)).hasSize(1);
        assertThat(donationService.getTopByRecent(1)).hasSize(1);
    }
}
