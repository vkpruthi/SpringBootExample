package com.project.SpringBootExample.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.stereotype.Component;

import com.project.SpringBootExample.models.User;
import com.project.SpringBootExample.services.impl.UserServices;

@Component
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter{

	@Autowired
	UserServices userServies;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    	auth.userDetailsService(userServies).passwordEncoder(User.PASSWORD_ENCODER);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
        		.antMatchers("/user/add","/user/{id}/addImage","/user/addUserAndImage",
        				"/user/login").permitAll()
        		.antMatchers("/user/**").authenticated()
        		.antMatchers("/user/**").hasRole("USER")
        		.and()
                .httpBasic()
                .and()
                .csrf().disable();
    }
    
}
