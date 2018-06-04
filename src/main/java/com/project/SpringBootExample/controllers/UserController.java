package com.project.SpringBootExample.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.SpringBootExample.models.User;
import com.project.SpringBootExample.services.IMultipartFileServices;
import com.project.SpringBootExample.services.IUserServices;

@RestController
@RequestMapping("/user/")
public class UserController {

	@Autowired
	IUserServices userServices;
	
	@Autowired
	IMultipartFileServices multipartFileServices;
	
	@Autowired
	private MessageSource messageSource;
    
    public String getMessage(String code, String locale) {
    	 return messageSource.getMessage(code, null, new Locale(locale));
	}
	
	@RequestMapping(value="add",method=RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> add(@RequestBody @Valid User user, BindingResult result){
		Map<String, Object> response = new HashMap<String, Object>();
		
		if(user == null) {
			response.put("data", "");
			response.put("status", "Fail");
			response.put("code", "400");
			response.put("message", "Bad Request");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}else if(result.hasFieldErrors()) {
			response.put("data", "");
			response.put("status", "Fail");
			response.put("code", "400");
			response.put("message", result.getFieldError().getDefaultMessage());
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}else {
			userServices.persist(user);
			
			response.put("data", "");
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", "Success");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}
	
	@RequestMapping(value="{id}/addImage",method=RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> addImage(@PathVariable("id") Long id, @RequestPart("file") MultipartFile file){
		Map<String, Object> response = new HashMap<String, Object>();
		String path = multipartFileServices.saveImage(file, id,"images/user/user_5.jpg");
		response.put("data", path);
		response.put("status", "OK");
		response.put("code", "200");
		response.put("message", messageSource.getMessage("message.user.signup", null, Locale.forLanguageTag("en")));
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	
	@RequestMapping(value="addUserAndImage",method=RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> addUserAndImage( @RequestParam("user") String jsonStr, @RequestPart(value="file",required=false) MultipartFile file) 
			throws JsonParseException, JsonMappingException, IOException{
		Map<String, Object> response = new HashMap<String, Object>();
		if(jsonStr == null || jsonStr.equals("")) {
			response.put("data", "");
			response.put("status", "Fail");
			response.put("code", "400");
			response.put("message", "Bad Request");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}else {
			User user = new ObjectMapper().readValue(jsonStr, User.class);
			ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		    Validator validator = factory.getValidator();
		    Set<ConstraintViolation<User>> violations = validator.validate(user);
		    if(!violations.isEmpty()) {
				Iterator<ConstraintViolation<User>> voi=violations.iterator();
	        	response.put("result", "fail");
				response.put("status", "400");
				response.put("message", voi.next().getMessage());
				response.put("data", "");
				return new ResponseEntity<Map<String,Object>>(response, HttpStatus.BAD_REQUEST);
			}else {
				Map<String, Object> data = new HashMap<String, Object>();
				User user2 = userServices.save(user);
				if(file != null) {
					String path =multipartFileServices.saveImage(file, user2.getId(), null);
					user2.setImage(path);
				}
				user2 = userServices.save(user2);
				data.put("user", user2);
				response.put("data", data);
				response.put("status", "OK");
				response.put("code", "200");
				response.put("message", messageSource.getMessage("message.user.signup", null, Locale.forLanguageTag("en_US")));
				return new ResponseEntity<>(response, HttpStatus.OK);
			}
		}
	}
	
	@RequestMapping(value="login",method=RequestMethod.POST)
	public ResponseEntity<Map<String, Object>> login(@RequestBody String jsonStr){
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			JSONObject jsonObject = new JSONObject(jsonStr);
			User user = userServices.findByEmail(jsonObject.getString("email"));
			if(user != null) {
				Boolean isCorrect = User.PASSWORD_ENCODER.matches(jsonObject.getString("password"), user.getPassword());
				if(isCorrect) {
					response.put("data", user);
					response.put("status", "OK");
					response.put("code", "200");
					response.put("message", messageSource.getMessage(
							"message.user.login", null, Locale.forLanguageTag("en-US")));
					return new ResponseEntity<>(response, HttpStatus.OK);
				}else {
					response.put("data", "");
					response.put("status", "Fail");
					response.put("code", "400");
					response.put("message", messageSource.getMessage(
							"message.user.password", null, Locale.forLanguageTag("en-US")));
					return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
				}
			}else {
				response.put("data", "");
				response.put("status", "Fail");
				response.put("code", "400");
				response.put("message", messageSource.getMessage(
						"message.user.email", null, Locale.forLanguageTag("en-US")));
				return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			e.printStackTrace();
			response.put("result", "Error");
			response.put("status", "500");
			response.put("message", e.getMessage());
			response.put("data", "");
			return new ResponseEntity<Map<String,Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(value="{id}/getProfile")
	public ResponseEntity<Map<String, Object>> getProfile(@PathVariable("id") Long id){
		Map<String, Object> response = new HashMap<String, Object>();
		try {
			User user = userServices.findById(id);
			response.put("data", user);
			response.put("status", "OK");
			response.put("code", "200");
			response.put("message", messageSource.getMessage(
					"message.user.login", null, Locale.forLanguageTag("en-US")));
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			response.put("result", "Error");
			response.put("status", "500");
			response.put("message", e.getMessage());
			response.put("data", "");
			return new ResponseEntity<Map<String,Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
