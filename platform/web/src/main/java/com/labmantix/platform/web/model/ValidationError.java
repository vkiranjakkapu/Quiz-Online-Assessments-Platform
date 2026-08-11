package com.labmantix.platform.web.model;

public record ValidationError(
		String field,
		Object rejectedValue,
		String message) {
}