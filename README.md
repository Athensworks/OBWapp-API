# OBWapp-API

Data Models

Establishments
-------------
* id ID
* name STRING
* lat  STRING
* lon  STRING
* address STRING
* beers ARRAY
  * beer_id ID
  * status ('tapped', 'untapped', 'empty', 'empty-reported') STRING
  * reported_out_count INTEGER
  * last_out_update DATETIME


Beers
-----

* id ID
* name STRING
* brewery STRING
* rate_beer_id STRING
* ibu INTEGER
* abv FLOAT
* limited_release BOOLEAN
* favorites ARRAY
  * guid STRING
  * age INTEGER
* taste ARRAY
  * guid STRING
  * age INTEGER

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
    "breweries": [
        {
            "address": "",
            "beers": [
                {
                    "abv": 5.0,
                    "brewery": "Jackie O's",
                    "favorite_count": 44,
                    "ibu": 45,
                    "id": 1,
                    "limited_release": false,
                    "name": "Firefly Amber",
                    "rate_beer_id": 111588,
                    "status": "available",
                    "taste_count": 100
                },
                {
                    "abv": 5.0,
                    "brewery": "Jackie O's",
                    "favorite_count": 52,
                    "ibu": 123,
                    "id": 2,
                    "limited_release": false,
                    "name": "Firefly Amber",
                    "rate_beer_id": 111588,
                    "status": "available",
                    "taste_count": 126
                }
            ],
            "id": 1,
            "lat": "",
            "lon": "",
            "name": "Jackie O's"
        }
    ]
}

```

*POST  /taste*

Data:
```json
{
  "beer_id": 123,
  "guid": "GUID",
  "age":  35,
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
