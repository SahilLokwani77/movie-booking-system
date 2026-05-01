package com.example.backend.controller;

import com.example.backend.dto.BookingRequest;
import com.example.backend.entity.Booking;
import com.example.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/book")
    public ResponseEntity<?> bookTickets(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.bookTickets(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
}
