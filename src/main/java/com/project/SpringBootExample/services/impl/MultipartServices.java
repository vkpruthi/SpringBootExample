package com.project.SpringBootExample.services.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.SpringBootExample.services.IMultipartFileServices;

@Service
public class MultipartServices implements IMultipartFileServices{

	@Override
	public String saveImage(MultipartFile file,Long id,String path) {
		try {
			String dir = "Example/resources/images/user/";
			
			if(!new File(dir).exists()){
				new File(dir).mkdirs();
			}else if(path != null){
			      File file1 = new File("Example/resources/"+path);
			      file1.delete();
			}

			String fileName = file.getOriginalFilename();
			String ext = FilenameUtils.getExtension(fileName);
			fileName = "user_"+id+"."+ext;
			
			InputStream fileContent = file.getInputStream();
			OutputStream outputStream = new FileOutputStream(new File(dir+"/"+fileName));
			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = fileContent.read(bytes)) != -1) {
				outputStream.write(bytes, 0, read);
			}
			String n = "images/user/"+fileName;
			outputStream.close();
			fileContent.close();
			return n;
		}catch (Exception e) {
			return null;
		}
	}
}
