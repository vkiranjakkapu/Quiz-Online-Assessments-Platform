package com.qoap.reports.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.reports.dto.APIResponseDto;
import com.qoap.reports.services.LeaderBoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports/api/v1/leaderboard")
@RequiredArgsConstructor
public class LeaderboardReportsController {

    private final LeaderBoardService leaderboardService;

    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<APIResponseDto> getLeaderboardByQuizId(@PathVariable UUID quizId) {
        return ResponseEntity
                .ok(APIResponseDto.builder().data(leaderboardService.getLeaderBoardByQuizId(quizId)).build());
    }

}
