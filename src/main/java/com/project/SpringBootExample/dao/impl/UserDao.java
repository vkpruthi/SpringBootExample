package com.project.SpringBootExample.dao.impl;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project.SpringBootExample.dao.IUserDao;
import com.project.SpringBootExample.models.User;


@Repository
@Transactional
public class UserDao implements IUserDao{
	
	@Autowired
	private EntityManager entityManager;

	@Override
	public void persist(User user) {
		entityManager.persist(user);
	}

	@Override
	public User save(User user) {
		return entityManager.merge(user);
	}

	@Override
	public User findByEmail(String email) {
		try {
		 TypedQuery<User> query = entityManager.createQuery("from User where email =:email",User.class);
		 return query.setParameter("email", email).getSingleResult();
		}catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public User findById(Long id) {
		return entityManager.find(User.class, id);
	}
	
}
