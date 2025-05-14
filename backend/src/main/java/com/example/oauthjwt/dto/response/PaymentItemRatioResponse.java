// src/main/java/com/example/oauthjwt/dto/response/PaymentItemRatioResponse.java
package com.example.oauthjwt.dto.response;

public class PaymentItemRatioResponse {
    private final String itemName;  // paymentitem.name
    private final long count;       // 해당 아이템으로 결제된 건수

    public PaymentItemRatioResponse(String itemName, long count) {
        this.itemName = itemName;
        this.count    = count;
    }
    public String getItemName() { return itemName; }
    public long   getCount()    { return count;    }
}
