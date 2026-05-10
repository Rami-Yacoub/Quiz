package com.Exam.Backend.Repository;

import com.Exam.Backend.Model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface roleRepository extends JpaRepository<Role,Long> {

    Optional<Role> findByRoleName(String roleName);
}
