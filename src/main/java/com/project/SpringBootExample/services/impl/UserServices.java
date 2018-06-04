package com.project.SpringBootExample.services.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.SpringBootExample.dao.IUserDao;
import com.project.SpringBootExample.models.User;
import com.project.SpringBootExample.services.IUserServices;

@Service
public class UserServices implements IUserServices,UserDetailsService{
	

	@Autowired
	IUserDao userDao;

	@Override
	public void persist(User user) {
		userDao.persist(user);
	}

	@Override
	public User save(User user) {
		return userDao.save(user);
	}

	@Override
	public User findByEmail(String email) {
		return userDao.findByEmail(email);
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userDao.findByEmail(email);
		if(user == null) {
    		throw new UsernameNotFoundException(email + " was not found");	
    	}
		
		Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
	    grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));
	    return new org.springframework.security.core.userdetails.User(
	    		user.getEmail(),
	    		user.getPassword(),
	    		grantedAuthorities);
	}

	@Override
	public User findById(Long id) {
		return userDao.findById(id);
	}
}
