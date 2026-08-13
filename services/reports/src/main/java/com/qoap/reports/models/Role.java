package com.qoap.reports.models;

import com.qoap.reports.enums.RoleType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    private Long id;

    private RoleType name;

    private String description;

}
