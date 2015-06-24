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


Note status is stored in the db as int so we will return:

* unknown = 0
* untapped = 1
* tapped = 2
* empty = 3
* empty reported = 4


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

## `GET /beers`
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

## `GET /establishments`
*GET /establishments*
*GET /establishments?parameters=JSON_STRING*

Data:
```json
{
  "lat": "Y",
  "lon": "X",
  "device_guid": "GUID",
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
## `GET /establishment/:establishment_id/beer_statuses`

*GET /establishment/:establishment_id/beer_statuses* 
```json
{ "beer_statuses": [
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
]}
```


## `POST  /taste`

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
  "count": 52,
  "like_type": "taste"
}
```

## `POST  /favorite`
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
  "count": 192,
  "like_type": "favorite"
}
```

## `PUT /report`
*PUT /report*

Data:
```json
{
  "beer_id": 123,
  "establishment_id": 345,
  "device_guid": "6b981317-1c2d-4219-ad79-7235013ad597"
}
```

# Admin Interface

Note: Admin interface returns 200 (OK), 404 (Not Found) or 403 (Forbidden)

## `POST /admin/establishments`
*POST /admin/establishments*

Data:
```json
{
  "name": "Some Random Pub",
  "address": "44 Court Street, Athens, OH 45701",
  "lon": "123.4567",
  "lat": "456.7890"
}

```

## `PUT /admin/establishments`
*PUT /admin/establishments*

Data:
```json
{
  "id": "1",
  "name": "Some Random Pub",
  "address": "44 Court Street, Athens, OH 45701",
  "lon": "123.4567",
  "lat": "456.7890"
}  

```

## `DELETE /admin/establishments`
*DELETE /admin/establishments*

Data:
```json
{
  "id": "1",
  "name": "Some Random Pub",
  "address": "44 Court Street, Athens, OH 45701"
}

```

## `POST /admin/beers`
*POST /admin/beers*

Data:
```json
{
  "name": "Ricky IPA",
  "brewery": "Ball n Chain Buds",
  "ibu": "40",
  "abv": "5.6",
  "limited_release": "1",
  "description": "An IPA that you can't get drunk on",
  "rate_beer_id": "5551234"
}
```

## `PUT /admin/beers`
*PUT /admin/beers*

Data:
```json
{
  "id": "1",
  "name": "Ricky IPA",
  "brewery": "Ball n Chain Buds",
  "ibu": "40",
  "abv": "5.6",
  "limited_release": "1",
  "description": "An IPA that you can't get drunk on",
  "rate_beer_id": "5551234"
}
```

## `DELETE /admin/beers`
*DELETE /admin/beers*

Data:
```json
{
  "id": "1",
  "name": "Ricky IPA",
  "brewery": "Ball n Chain Buds"
}
```

## `POST /admin/statuses`
*POST /admin/statuses*

Data:
```json
{
  "establishment_id": "1",
  "beer_id": "1",
  "status": "tapped"
}
```

## `PUT /admin/statuses`
*PUT /admin/statuses*

note: This will only update the status, it uses the IDs to match

Data:
```json
{
  "establishment_id": "1",
  "beer_id": "1",
  "status": "empty"
}
```

## `DELETE /admin/statuses`
*DELETE /admin/statuses*

Data:
```json
{
  "establishment_id": "1",
  "beer_id": "1",
}
```


# Implement Later

## `PUT /establishments/:establishment_id/beer/:beer_id/`
*PUT /establishments/:establishment_id/beer/:beer_id/*

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
