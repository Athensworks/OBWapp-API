# OBWapp-API

Data Models

Establishments
-------------

* name
* lat
* lon
* address
* beers
  * beer_id
  * status ('tapped', 'untapped', 'empty', 'empty-reported')
  * reported_out_count
  * last_out_update


Beers
-----

* id
* name
* brewery
* rate_beer_id
* ibu
* abv
* limited_release
* favorites
  * guid
  * age
* taste
  * guid
  * age


*GET /beers*

*GET /beers?parameters=JSON_STRING*

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
    "id": 1,
    "name": "Jackie O's",
    "address": "",
    "lat": "",
    "lon": "",
    "beers": [{
      "id": 1,
      "name": "Firefly Amber",
      "brewery": "Jackie O's",
      "rate_beer_id": 111588,
      "ibu": 45,
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
  "beer_id": 123,
  "guid": "GUID",
  "age":  35
  "lat": "X",
  "lon": "Y",
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
  "beer_id": 2,
  "guid": "GUID",
  "age":  43
  "lat": "X",
  "lon": "Y",
}
```

Response:
```json
{
  "beer_id": 2,
  "favorite_count": 192
}
```

PUT /establishment/:establishment_id/beer/:beer_id/
Data:
```json
{
  "status": "empty-reported"
}
```

Response:
```json
{
  "establishment_id": 1,
  "beer_id": 2,
  "reported_out_count": 4
}
```