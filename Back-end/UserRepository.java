package klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import klu.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	
	@Query("select count(U) from User U where U.emailid=:email")
	public int validateEmail(@Param("email") String email);
	
	@Query("select count(U) from User U where U.emailid=:email and U.password=:pwd")
	public int validateCredentials(@Param("email") String email, @Param("pwd") String pwd);
	
	
}
