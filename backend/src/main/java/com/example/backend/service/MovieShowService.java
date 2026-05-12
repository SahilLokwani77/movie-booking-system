package com.example.backend.service;

import com.example.backend.entity.MovieShow;
import com.example.backend.repository.MovieShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieShowService {

    @Autowired
    private MovieShowRepository movieShowRepository;

    public List<MovieShow> getShowsByMovieId(Long movieId) {
        return movieShowRepository.findByMovieId(movieId);
    }

    public MovieShow getShowById(Long id) {
        return movieShowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show not found"));
    }
    
    public MovieShow saveShow(MovieShow show) {
        return movieShowRepository.save(show);
    }
}
