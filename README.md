# OBWapp-API

Data Models


Status - 'tapped', 'untapped', 'empty', 'empty-reported'

Establishments
-------------
name
lat
lon
address
beers
  beer_id
  status
  out_count
  last_out_entry


Beers
-----
id
name
brewery
rate_beer_id
ibu
abv
limited_release
status
favorites
  guid
  age
taste
  guid
  age


GET   /beers
GET   /beers?parameters=JSON_STRING
  Data:
  {
    lat: X,
    lon: Y,
    guid: GUID,
    age:  AGE
  }

  Response:

  {
    [
      name: "Jackie O's",
      address: "",
      lat: "",
      lon: "",
      beers: [{
        id: 1,
        name: "Firefly Amber",
        brewery: "Jackie O's",
        rate_beer_id: 111588,
        ibu: ,
        abv: 5.0,
        limited_release: false,
        status: 'available',
        favorite_count: 52,
        taste_count: 126
        }, {
        id: 2,
        name: "Firefly Amber",
        brewery: "Jackie O's",
        rate_beer_id: 111588,
        ibu: ,
        abv: 5.0,
        limited_release: false,
        status: 'available',
        favorite_count: 52,
        taste_count: 126
        }
      ]
    ]
    beer_id: ID,
    favorite_count: COUNT
  }

PUT  /taste
  Data:
  {
    lat: X,
    lon: Y,
    guid: GUID,
    age:  AGE
  }

  Response:

  {
    beer_id: ID,
    taste_count: COUNT
  }

POST  /favorite
  Data:
  {
    lat: X,
    lon: Y,
    beer_id: ID,
    guid: GUID,
    age:  AGE
  }

  Response:

  {
    beer_id: ID,
    favorite_count: COUNT
  }

POST /available