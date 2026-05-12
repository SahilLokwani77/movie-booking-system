package com.example.backend.service;

import com.example.backend.dto.BookingRequest;
import com.example.backend.entity.Booking;
import com.example.backend.entity.MovieShow;
import com.example.backend.entity.Seat;
import com.example.backend.entity.User;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.MovieShowRepository;
import com.example.backend.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private MovieShowRepository movieShowRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Booking bookTickets(BookingRequest request) {
        User user = userService.getUserById(request.getUserId());
        MovieShow show = movieShowRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        // Check seat availability
        for (String seatNumber : request.getSeatNumbers()) {
            Seat seat = seatRepository.findByShowIdAndSeatNumber(show.getId(), seatNumber)
                    .orElseThrow(() -> new RuntimeException("Seat " + seatNumber + " not found for this show"));
            
            if ("BOOKED".equals(seat.getStatus())) {
                throw new RuntimeException("Seat " + seatNumber + " is already booked.");
            }
            // Mark as booked
            seat.setStatus("BOOKED");
            seatRepository.save(seat);
        }

        // Update available seats count in show
        show.setAvailableSeats(show.getAvailableSeats() - request.getSeatNumbers().size());
        movieShowRepository.save(show);

        // Create booking record
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setTotalAmount(request.getTotalAmount());
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}
