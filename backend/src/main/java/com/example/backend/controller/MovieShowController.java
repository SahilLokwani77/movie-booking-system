package com.example.backend.controller;

import com.example.backend.entity.MovieShow;
import com.example.backend.service.MovieShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "*")
public class MovieShowController {

    @Autowired
    private MovieShowService movieShowService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<MovieShow>> getShowsByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(movieShowService.getShowsByMovieId(movieId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieShow> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(movieShowService.getShowById(id));
    }
    
    @PostMapping
    public ResponseEntity<MovieShow> addShow(@RequestBody MovieShow show) {
        return ResponseEntity.ok(movieShowService.saveShow(show));
    }
}
