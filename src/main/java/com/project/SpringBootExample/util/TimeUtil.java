package com.project.SpringBootExample.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class TimeUtil {

	private static DateFormat timeAndDate= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	public static String getTimestamp(){
		return timeAndDate.format(new Date());
	}
	
	public static String getlocaleTime(Locale locale,Date date){
		DateFormat df = DateFormat.getDateTimeInstance(DateFormat.DEFAULT,DateFormat.DEFAULT, locale);
		return df.format(date);
	}
	
	public static Long getTimeInLong(){
		return new Date().getTime();
	}
	
}
