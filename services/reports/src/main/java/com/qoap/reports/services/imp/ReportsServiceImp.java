package com.qoap.reports.services.imp;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.qoap.reports.dto.QuizTrendsResponseDto;
import com.qoap.reports.models.Attempt;
import com.qoap.reports.models.Quiz;
import com.qoap.reports.services.QuizService;
import com.qoap.reports.services.ReportsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportsServiceImp implements ReportsService {

	private final QuizService quizService;

	@Override
	public List<QuizTrendsResponseDto> getQuizReports() {
		return getQuizReports(YearMonth.now());
	}

	@Override
	public List<QuizTrendsResponseDto> getQuizReports(YearMonth month) {

		List<QuizTrendsResponseDto> reports = new ArrayList<>();

		Map<LocalDate, List<Quiz>> allQuizzesPerDayInMonth = quizService.getAllQuizzesPerDayInMonth(month);

		Set<UUID> allQuizIds = allQuizzesPerDayInMonth.values().stream()
				.flatMap(Collection::stream)
				.map(Quiz::getId)
				.collect(Collectors.toSet());

		// 1. Group attempts by Quiz ID instead of the Quiz object itself
		Map<UUID, List<Attempt>> attemptsPerQuizId = quizService.getAttemptsByQuizIds(allQuizIds).stream()
				.collect(Collectors.groupingBy(attempt -> attempt.getQuiz().getId()));

		LocalDate today = LocalDate.now();
		LocalDate firstDay = month.atDay(1);
		LocalDate lastDayToReport = month.equals(YearMonth.from(today))
				? today
				: month.atEndOfMonth();

		for (LocalDate date = firstDay; !date.isAfter(lastDayToReport); date = date.plusDays(1)) {
			List<Quiz> quizzes = allQuizzesPerDayInMonth.getOrDefault(date, Collections.emptyList());

			// 2. Lookup using q.getId()
			int totalAttempts = quizzes.stream()
					.mapToInt(q -> attemptsPerQuizId.getOrDefault(q.getId(), Collections.emptyList()).size())
					.sum();

			reports.add(QuizTrendsResponseDto.builder()
					.date(date)
					.quizzes(quizzes.size())
					.attempts(totalAttempts)
					.build());
		}

		return reports;
	}

}
