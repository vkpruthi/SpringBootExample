package com.project.SpringBootExample.services;

import org.springframework.web.multipart.MultipartFile;

public interface IMultipartFileServices {

	String saveImage(MultipartFile file,Long id,String path);
	
}
