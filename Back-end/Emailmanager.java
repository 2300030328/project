package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailManager {

	@Autowired
	JavaMailSender JMS;
	
	public String sendEmail(String toEmail, String subject, String msg)
	{
		try
		{
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setFrom("fcaabhiram@gmail.com");
			mailMessage.setTo(toEmail);
			mailMessage.setSubject(subject);
			mailMessage.setText(msg);
			
			JMS.send(mailMessage); //Send Email to toEmailAddress
			return "200::Password has been sent to registered email";
		}catch(Exception e)
		{
			return "404::" + e.getMessage();
		}		
	}
}
