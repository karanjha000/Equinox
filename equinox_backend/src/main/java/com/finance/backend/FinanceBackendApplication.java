package com.finance.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FinanaceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinanaceBackendApplication.class, args);
	}

}
