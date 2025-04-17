package com.example.oauthjwt.controller.auth;

import com.example.oauthjwt.dto.TransactionReqDTO;
import com.example.oauthjwt.dto.TransactionResDTO;
import com.example.oauthjwt.entity.TRANSACTION_STATE;
import com.example.oauthjwt.service.ServiceProductService;
import com.example.oauthjwt.service.TransactionService;
import com.example.oauthjwt.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/transaction")
public class TransactionController {
    private final UserService userService;
    private final TransactionService transactionService;
    private final ServiceProductService serviceProductService;

    @PostMapping("/")
    public ResponseEntity<?> createTransaction(@RequestBody TransactionReqDTO transactionReqDTO) {
        Map<String, String> userCheck = userService.existsById(transactionReqDTO.getUserId());
        if(!userCheck.isEmpty()){
            return ResponseEntity.badRequest().body(userCheck);
        }

        Map<String, String> productCheck = serviceProductService.existsById(transactionReqDTO.getProductId());
        if(!productCheck.isEmpty()){
            return ResponseEntity.badRequest().body(productCheck);
        }

        Map<String, String> TRANSACTION_STATECheck = TRANSACTION_STATE.existsByValue(transactionReqDTO.getTransactionState());
        if(!TRANSACTION_STATECheck.isEmpty()){
            return ResponseEntity.badRequest().body(TRANSACTION_STATECheck);
        }

        TransactionResDTO result = transactionService.createTransaction(transactionReqDTO);

        return ResponseEntity.ok(result);
    }
}
