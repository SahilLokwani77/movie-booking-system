package com.example.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private Long userId;
    private Long showId;
    private List<String> seatNumbers;
    private Double totalAmount;
}
