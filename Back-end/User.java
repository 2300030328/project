package klu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "user")
public class User {
    
   
    @Column(name = "fullname")
    private String fullname;
    
    @Id
   
    @Column(name = "emailid")
    private String emailid;
    
   
    
    @Column(name = "password")
    private String password;

    // No-argument constructor
    public User() {}

    // Constructor with parameters
    public User(String fullname, String emailid, String password) {
        this.fullname = fullname;
        this.emailid = emailid;
        this.password = password;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmailid() {
        return emailid;
    }

    public void setEmailid(String emailid) {
        this.emailid = emailid;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User  {" +
                "fullname='" + fullname + '\'' +
                ", emailid='" + emailid + '\'' +
                '}';
    }
}
