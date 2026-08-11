package com.qoap.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qoap.identity.entities.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
