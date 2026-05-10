package com.Exam.Backend;

import com.Exam.Backend.Model.Role;
import com.Exam.Backend.Model.User;
import com.Exam.Backend.Model.userRole;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import com.Exam.Backend.Repository.roleRepository;
import com.Exam.Backend.Repository.userRepository;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories("com.Exam.Backend.Repository")
@EntityScan("com.Exam.Backend.Model")
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private userRepository userRepository;

	@Autowired
	private roleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		// Vérifier si l'admin existe déjà
		Optional<User> existing = Optional.ofNullable(userRepository.findByUsername("admin"));
		if (existing.isPresent()) {
			System.out.println("Admin already exists → skipping creation.");
			return;
		}

		System.out.println("Creating default ADMIN user...");

		// Vérifier ou créer le rôle ADMIN
		Role adminRole = roleRepository.findByRoleName("ADMIN")
				.orElseGet(() -> {
					Role r = new Role();
					r.setRoleName("ADMIN");
					return roleRepository.save(r);   // IMPORTANT → sauvegarde du rôle
				});

		// Création de l'utilisateur admin
		User user = new User();
		user.setEmail("sample@gmail.com");
		user.setPassword(passwordEncoder.encode("password"));
		user.setPhone("1234567890");
		user.setFirstName("test");
		user.setLastName("xyz");
		user.setUsername("admin");

		// Lier rôle ↔ utilisateur
		userRole userRole = new userRole();
		userRole.setRole(adminRole);  // rôle déjà save → plus d'erreur
		userRole.setUser(user);

		Set<userRole> roles = new HashSet<>();
		roles.add(userRole);
		user.setUserRoles(roles);

		// Sauvegarde de l'utilisateur admin
		userRepository.save(user);

		System.out.println("Default ADMIN user created successfully.");
	}
}
