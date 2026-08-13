package com.qoap.reports.services;

import java.time.YearMonth;
import java.util.List;

import com.qoap.reports.dto.QuizTrendsResponseDto;

public interface ReportsService {

    List<QuizTrendsResponseDto> getQuizReports();

    List<QuizTrendsResponseDto> getQuizReports(YearMonth month);

}