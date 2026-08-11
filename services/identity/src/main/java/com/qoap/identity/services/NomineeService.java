package com.qoap.identity.services;

import java.util.List;
import java.util.UUID;

import com.qoap.identity.dto.NomineeRequestDto;
import com.qoap.identity.dto.NomineeResponseDto;
import com.qoap.identity.entities.Nominee;

public interface NomineeService {

    List<Nominee> getAllNomineesByCustomer(UUID customerId);

    Nominee getNomineeById(Long id);

    List<NomineeResponseDto> createAllNominees(List<NomineeRequestDto> nomineesRequest);

    Nominee updateNominee(Nominee nominee);

    boolean deleteNominee(Nominee nominee);

}