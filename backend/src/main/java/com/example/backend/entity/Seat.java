package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "show_id", nullable = false)
    private MovieShow show;

    @Column(nullable = false)
    private String seatNumber; // e.g. A1, B5

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, BOOKED
}
