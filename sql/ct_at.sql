CREATE TABLE users (
	id SERIAL PRIMARY KEY, 
	username varchar(256), 
	email varchar(256), 
	password varchar(256),
	salt varchar(32)	
);

INSERT INTO users (username, password) VALUES ('test', 'test');
INSERT INTO users (username, password) VALUES ('asdf', 'asdf');
INSERT INTO users (username, password, salt) VALUES ('lol', 
'6e049c1b44ac596347478665488206ab41471b3bc7ebe7664a583c10e41a41cf992d2d0256cafbfae7134eb21f39c2e8e6ebfb8ade251db4ddccf0801145d613db2dbed8811ef215b22117908991e9834f42a53ef76a74d90ed5a7a0229de147895ca97c737b6377cbdd03d9fc5c572f353eebc312210c22d81c234d96f62ff7',
'majuriSuolaus');
