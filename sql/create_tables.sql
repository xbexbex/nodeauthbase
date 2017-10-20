CREATE TABLE users (
	id SERIAL PRIMARY KEY, 
	username varchar(256), 
	email varchar(256), 
	password varchar(256),
	salt varchar(32)	
);
