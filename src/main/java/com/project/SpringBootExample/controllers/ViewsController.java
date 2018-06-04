package com.project.SpringBootExample.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewsController {

	@RequestMapping("/")
	public String welcome() {
		return "index";
	}
	    
	@RequestMapping("/loginPage")
	public String login() {
		System.out.println("Login page called");
		return "login";
	}
	
	@RequestMapping("/signupPage")
	public String signup() {
		return "signup";
	}
	
	@RequestMapping("/profilePage")
	public String profile() {
		return "profile";
	}
	
}
