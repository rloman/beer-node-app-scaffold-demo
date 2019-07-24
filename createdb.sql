create database pub;

use pub;

create table beers (
	id INT NOT NULL AUTO_INCREMENT primary key, 
	name VARCHAR(255) NOT NULL, 
	alcoholPercentage DOUBLE
);

grant all privileges on pub.* to 'username'@'localhost' identified by 'password';
flush privileges;

