package com.qoap.reports.dto;

import com.qoap.reports.models.Attempt;
import com.qoap.reports.models.User;

import lombok.Builder;

@Builder
public record LeaderBoardReportSto(
		Attempt attempt,
		User student,
		Integer score) {
}