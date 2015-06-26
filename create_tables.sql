create table establishments(
id int unsigned not null auto_increment,
name varchar(100),
lat  float,
lon float,
address varchar(100),
primary key(id)
);

create table beers(
id int unsigned not null auto_increment,
name varchar(100),
brewery varchar(100),
ibu smallint unsigned,
abv float,
limited_release bool,
description text,
rate_beer_id varchar(64),
primary key(id)
);

create table likes(
id int unsigned not null auto_increment,
device_guid varchar(255),
beer_id int unsigned,
age tinyint unsigned,
like_type tinyint unsigned,
primary key(id)
);

create table statuses(
id int unsigned not null auto_increment,
establishment_id int unsigned,
beer_id int unsigned,
status tinyint unsigned,
reported_out_count int unsigned,
last_out_update datetime,
primary key(id)
);

create table reportstate(
device_guid varchar(255),
establishment_id int unsigned,
beer_id int unsigned,
last_report_update datetime
);

create table usertoken(
username varchar(255),
email varchar(255),
token varchar(255)
);

