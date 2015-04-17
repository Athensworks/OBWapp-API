# OBWapp-API

Data Models

Establishments
-------------
* id ID
* name STRING
* lat  FLOAT
* lon  FLOAT
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
```json
{"beers": [
 {
        "abv": 5.0,
        "brewery": "Jackie O's",
        "favorite_count": 44,
        "ibu": 45,
        "id": 1,
        "limited_release": false,
        "name": "Firefly Amber",
        "rate_beer_id": 111588,
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
        "taste_count": 126
    },
    {
        "abv": 4.7,
        "brewery": "Jackie O's",
        "favorite_count": 11110,
        "ibu": 32,
        "id": 3,
        "limited_release": true,
        "name": "Razz Wheat",
        "rate_beer_id": 111586,
        "taste_count": 12
    }]
}
```

*GET /establishments* 

*GET /establishments?parameters=JSON_STRING*

Data:
```json
{
  "lat": "Y",
  "lon": "X",
  "guid": "GUID",
  "age":  "AGE"
}
```

Response:
```json
{
    "establishments": [
        {
            "address": "",
            "beer_statuses": [
                {
                    "id": 1,
                    "status": "tapped",
                },
                {
                    "id": 2,
                    "status": "untapped",
                },
                {
                    "id": 3,
                    "status": "empty",
                }
            ],
            "id": 1,
            "lat": "39.236",
            "lon": "-82.015",
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
  "device_guid": "GUID",
  "age":  35,
  "lat": "Y",
  "lon": "X",
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
  "device_guid": "GUID",
  "age":  43,
  "lat": "Y",
  "lon": "X",
}
```

Response:
```json
{
  "beer_id": 2,
  "favorite_count": 192
}
```


** Implement Later **

PUT /establishments/:establishment_id/beer/:beer_id/
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
