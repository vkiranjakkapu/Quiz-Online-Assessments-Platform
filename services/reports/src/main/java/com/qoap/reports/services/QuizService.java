package com.qoap.reports.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import com.qoap.reports.models.Attempt;
import com.qoap.reports.models.Quiz;

public interface QuizService {

    Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth();

    Map<LocalDate, List<Quiz>> getAllQuizzesPerDayInMonth(YearMonth month);

    List<Attempt> getAttemptsByQuizIds(Set<UUID> quizIds);

}