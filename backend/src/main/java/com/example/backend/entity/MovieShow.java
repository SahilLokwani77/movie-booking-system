package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "movie_shows")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieShow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false)
    private LocalDateTime showTime;

    private Integer availableSeats;

    @Column(nullable = false)
    private Double price;
}
