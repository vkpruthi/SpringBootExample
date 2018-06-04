package com.project.SpringBootExample.services;

import com.project.SpringBootExample.models.User;

public interface IUserServices {

	void persist(User user);
	
	User save(User user);
	
	User findByEmail(String email);
	
	User findById(Long id);
	
}
