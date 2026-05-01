package com.example.backend.controller;

import com.example.backend.entity.Seat;
import com.example.backend.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/show/{showId}")
    public ResponseEntity<List<Seat>> getSeatsByShowId(@PathVariable Long showId) {
        return ResponseEntity.ok(seatService.getSeatsByShowId(showId));
    }
    
    @PostMapping
    public ResponseEntity<Seat> addSeat(@RequestBody Seat seat) {
        return ResponseEntity.ok(seatService.saveSeat(seat));
    }
}
