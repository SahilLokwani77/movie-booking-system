package com.example.backend;

import com.example.backend.entity.Movie;
import com.example.backend.entity.MovieShow;
import com.example.backend.entity.Seat;
import com.example.backend.repository.MovieRepository;
import com.example.backend.repository.MovieShowRepository;
import com.example.backend.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private MovieShowRepository movieShowRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Override
    public void run(String... args) throws Exception {
        if (movieRepository.count() == 0) {
            // Add Movies
            Movie movie1 = new Movie(null, "Avengers: Endgame", "Epic conclusion to the Infinity Saga", 181, "English", "https://via.placeholder.com/300x450.png?text=Avengers");
            Movie movie2 = new Movie(null, "Inception", "A thief who steals corporate secrets through dream-sharing", 148, "English", "https://via.placeholder.com/300x450.png?text=Inception");
            Movie movie3 = new Movie(null, "The Dark Knight", "Batman faces the Joker", 152, "English", "https://via.placeholder.com/300x450.png?text=Dark+Knight");
            
            movie1 = movieRepository.save(movie1);
            movie2 = movieRepository.save(movie2);
            movie3 = movieRepository.save(movie3);

            // Add Shows
            MovieShow show1 = new MovieShow(null, movie1, LocalDateTime.now().plusDays(1).withHour(18).withMinute(0), 10, 150.0);
            MovieShow show2 = new MovieShow(null, movie1, LocalDateTime.now().plusDays(1).withHour(21).withMinute(0), 10, 200.0);
            MovieShow show3 = new MovieShow(null, movie2, LocalDateTime.now().plusDays(2).withHour(14).withMinute(30), 10, 120.0);

            show1 = movieShowRepository.save(show1);
            show2 = movieShowRepository.save(show2);
            show3 = movieShowRepository.save(show3);

            // Add Seats for Show 1 (A1 to A5, B1 to B5)
            for (int i = 1; i <= 5; i++) {
                seatRepository.save(new Seat(null, show1, "A" + i, "AVAILABLE"));
                seatRepository.save(new Seat(null, show1, "B" + i, "AVAILABLE"));
                
                seatRepository.save(new Seat(null, show2, "A" + i, "AVAILABLE"));
                seatRepository.save(new Seat(null, show2, "B" + i, "AVAILABLE"));
                
                seatRepository.save(new Seat(null, show3, "A" + i, "AVAILABLE"));
                seatRepository.save(new Seat(null, show3, "B" + i, "AVAILABLE"));
            }
        }
    }
}
