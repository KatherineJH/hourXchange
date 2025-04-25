package com.example.oauthjwt.dto.response;

import com.example.oauthjwt.entity.Advertisement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApiResponse {

    private String message;
    private boolean status;
    private int code;

    public static ApiResponse success(String message) {
        return new ApiResponse(message, true, 200);
    }

    public static ApiResponse badRequest(String message) {
        return new ApiResponse(message, false, 400);
    }

    public static ApiResponse unauthorized(String message) {
        return new ApiResponse(message, false, 401);
    }

    public static ApiResponse forbidden(String message) {
        return new ApiResponse(message, false, 403);
    }

    public static ApiResponse notFound(String message) {
        return new ApiResponse(message, false, 404);
    }

    public static ApiResponse serverError(String message) {
        return new ApiResponse(message, false, 500);
    }
}
