package com.qoap.identity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.identity.entities.Nominee;
import com.qoap.identity.entities.User;

public interface NomineeRepository extends JpaRepository<Nominee, Long> {

    List<Nominee> findAllByCustomer(User customer);
    
}
