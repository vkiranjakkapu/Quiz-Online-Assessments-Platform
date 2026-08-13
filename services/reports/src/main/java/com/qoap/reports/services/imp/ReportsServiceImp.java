package com.qoap.reports.services.imp;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

		List<QuizTrendsResponseDto> reports = new ArrayList<QuizTrendsResponseDto>();

		Map<LocalDate, List<Quiz>> allQuizzesPerDayInMonth = quizService.getAllQuizzesPerDayInMonth();
		if (allQuizzesPerDayInMonth.size() == 0) {
			return reports;
		}

		Set<UUID> allQuizIds = allQuizzesPerDayInMonth.values().stream().flatMap(Collection::stream)
				.map(Quiz::getId)
				.collect(Collectors.toSet());
		Map<Quiz, List<Attempt>> attemptsPerQuiz = quizService.getAttemptsByQuizIds(allQuizIds).stream()
				.collect(Collectors.groupingBy(Attempt::getQuiz));

		allQuizzesPerDayInMonth.forEach((date, quizzes) -> {
			reports.add(QuizTrendsResponseDto.builder()
					.date(date)
					.quizzes(quizzes.size())
					.attempts(quizzes.stream().flatMap(q -> Stream.of(attemptsPerQuiz.get(q)))
							.count())
					.build());
		});
		return reports;
	}

	@Override
	public List<QuizTrendsResponseDto> getQuizReports(YearMonth month) {

		List<QuizTrendsResponseDto> reports = new ArrayList<QuizTrendsResponseDto>();

		Map<LocalDate, List<Quiz>> allQuizzesPerDayInMonth = quizService.getAllQuizzesPerDayInMonth(month);
		if (allQuizzesPerDayInMonth.size() == 0) {
			return reports;
		}

		Set<UUID> allQuizIds = allQuizzesPerDayInMonth.values().stream().flatMap(Collection::stream)
				.map(Quiz::getId)
				.collect(Collectors.toSet());
		Map<Quiz, List<Attempt>> attemptsPerQuiz = quizService.getAttemptsByQuizIds(allQuizIds).stream()
				.collect(Collectors.groupingBy(Attempt::getQuiz));

		allQuizzesPerDayInMonth.forEach((date, quizzes) -> {
			reports.add(QuizTrendsResponseDto.builder()
					.date(date)
					.quizzes(quizzes.size())
					.attempts(quizzes.stream().flatMap(q -> Stream.of(attemptsPerQuiz.get(q)))
							.count())
					.build());
		});
		return reports;
	}

}
