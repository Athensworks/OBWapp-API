create table establishments(
id int unsigned not null primary key
,name varchar(100)
,lat  float
,lon float
,address varchar(100)
);

create table beers(
id int unsigned not null primary key
,name varchar(100)
,brewery varchar(100)
,ibu smallint unsigned
,abv float
,limited_release bool
,description text
);

create table likes(
device_guid varchar(255)
,beer_id int unsigned
,age tinyint unsigned
,like_type tinyint unsigned
,like_status bool
);

create table statuses(
establishment_id int unsigned
,beer_id int unsigned
,status tinyint unsigned
,reported_out_count int unsigned
,last_out_update datetime
);
