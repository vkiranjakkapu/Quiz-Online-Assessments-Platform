package com.qoap.reports.services;

import java.util.List;
import java.util.UUID;

import com.qoap.reports.dto.LeaderBoardReportSto;
import com.qoap.reports.models.Attempt;

public interface LeaderBoardService {

    List<LeaderBoardReportSto> getLeaderBoardByQuizId(UUID quizId);

    List<Attempt> getAllAttemptsByQuizId(UUID quizId);

}