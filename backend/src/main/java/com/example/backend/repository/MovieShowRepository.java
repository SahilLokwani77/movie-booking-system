package com.example.backend.repository;

import com.example.backend.entity.MovieShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieShowRepository extends JpaRepository<MovieShow, Long> {
    List<MovieShow> findByMovieId(Long movieId);
}
