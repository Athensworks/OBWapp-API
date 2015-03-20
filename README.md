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


*GET   /beers*
*GET   /beers?parameters=JSON_STRING*

Data:
```json
{
  "lat": "X",
  "lon": "Y",
  "guid": "GUID",
  "age":  "AGE"
}
```

Response:
```json
{
  [
    "name": "Jackie O's",
    "address": "",
    "lat": "",
    "lon": "",
    "beers": [{
      "id": 1,
      "name": "Firefly Amber",
      "brewery": "Jackie O's",
      "rate_beer_id": 111588,
      "ibu": ,
      "abv": 5.0,
      "limited_release": false,
      "status": "available",
      "favorite_count": 44,
      "taste_count": 100
      }, {
      "id": 2,
      "name": "Firefly Amber",
      "brewery": "Jackie O's",
      "rate_beer_id": 111588,
      "ibu": 123,
      "abv": 5.0,
      "limited_release": false,
      "status": "available",
      "favorite_count": 52,
      "taste_count": 126
      }
    ]
  ]
}
```

*POST  /taste*

Data:
```json
{
  "lat": "X",
  "lon": "Y",
  "guid": "GUID",
  "age":  35
}
```

Response:
```json
{
  "beer_id": 123,
  "taste_count": 52
}
```


*POST  /favorite*

Data:
```json
{
  "lat": "X",
  "lon": "Y",
  "beer_id": 2,
  "guid": "GUID",
  "age":  43
}
```

Response:
```json
{
  "beer_id": 2,
  "favorite_count": 192
}
```

POST /available