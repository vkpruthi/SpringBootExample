package com.project.SpringBootExample.dao;

import com.project.SpringBootExample.models.User;

public interface IUserDao {

	void persist(User user);
	
	User save(User user); 
	
	User findByEmail(String email);
	
	User findById(Long id);
}
