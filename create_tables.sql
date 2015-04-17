create table establishments(
id short
,name text
,lat  float
,long float
,address text
,beers short[]
);

create table beers(
id short
,name text
,brewery text
,ibu short
,abv float
,limited_release bool
,description text
);

create table likes(
device_guid text
,beer_id short
,age short
,like_type short/text
,like_status bool
);

create table status(
establishment_id short
,beer_id short
,status short
,reported_out_count short
,last_out_update datetime
);


