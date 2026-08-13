package com.qoap.reports.controllers;

import java.time.YearMonth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qoap.reports.dto.APIResponseDto;
import com.qoap.reports.services.ReportsService;

@RestController
@RequestMapping("/reports/api/v1")
public class ReportsController {

    private ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/quiz/monthly")
    public ResponseEntity<APIResponseDto> getMonthlyQuizzesTrend() {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(reportsService.getQuizReports()).build());
    }

    @GetMapping("/quiz/monthly/{month}")
    public ResponseEntity<APIResponseDto> getMonthlyQuizzesTrend(@PathVariable YearMonth month) {
        return ResponseEntity.ok().body(APIResponseDto.builder().data(reportsService.getQuizReports(month)).build());
    }

}
