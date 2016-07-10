# OBWapp-API

##Testing
-----------

To test the API you can use curl, here is the syntax:

 curl -H "Content-Type: application/json" -X *METHOD* -d '{ *JSON DATA* }' http://url/*api/path/*

Where METHOD can be:

 * POST
 * PUT
 * DELETE
 * GET

Example:

 curl -H "Content-Type: application/json" -X DELETE -d '{"establishment_id": "1", "beer_id": "1"}' http://10.80.90.100:3000/admin/statuses

## `GET /beers`
*GET /beers*
```json
[
 {
        "abv": 5.0,
        "brewery": {
          "id": 23,
          "name": "Jackie O's",
         },
        "favorite_count": 44,
        "ibu": 45,
        "id": 1,
        "limited_release": false,
        "name": "Firefly Amber",
        "taste_count": 100,
        "description": "Super awesome description"
    },
    {
        "abv": 5.0,
        "brewery": {
          "id": 23,
          "name": "Jackie O's",
         },        "favorite_count": 52,
        "ibu": 123,
        "id": 2,
        "limited_release": false,
        "name": "Firefly Amber",
        "taste_count": 126,
        "description": "Even better description"
    },
    {
        "abv": 4.7,
        "brewery": {
          "id": 23,
          "name": "Jackie O's",
         },        "favorite_count": 11110,
        "ibu": 32,
        "id": 3,
        "limited_release": true,
        "name": "Razz Wheat",
        "taste_count": 12,
        "description": "The best description"
    }
]
```

## `GET /establishments`
*GET /establishments*
*GET /establishments?lat=Y&lon=X&device_guid=ZZZZ&age=NN*

Parameters:
```
lat: Y
lon: X
device_guid: GUID
age: NN
```

Response:
```json
[
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

## `PUT /establishment/:establishment_id/beer/:beer_id`
*PUT /establishment/:establishment_id/beer/:beer_id*

Data (as JSON encoded reqest body):
```json
{
  "status": "empty-reported",
  "device_guid": "6b981317-1c2d-4219-ad79-7235013ad597"
}
```



## `POST  /taste`

*POST  /taste*

Data (as JSON encoded reqest body):
```json
{
  "beer_id": 123,
  "device_guid": "GUID",
  "age":  35,
  "lat": "Y",
  "lon": "X",
  "state": true
}
```

Response:
```json
{
  "beer_id": 123,
  "count": 52,
  "like_type": 1
}
```

## `POST  /favorite`
*POST  /favorite*

Data (as JSON encoded reqest body):
```json
{
  "beer_id": 2,
  "device_guid": "GUID",
  "age":  43,
  "lat": "Y",
  "lon": "X",
  "state": true
}
```

Response:
```json
{
  "beer_id": 2,
  "count": 192,
  "like_type": 2
}
```

## `POST /rate`
*POST /favorite*

Data (as JSON encoded request body):

```json
{
  "beer_id": 2,
  "device_guid": "GUID",
  "age":  43,
  "lat": "Y",
  "lon": "X",
  "value": 5
}
```

** Note: Value must between 0 or 1 -- 0 equals 'thumbs down'; 1 equals 'thumbs up'**

Response:
```json
{
  "beer_id": 2,
  "rating": 0.3,
}
```
** Note: Rating is average rating across beer**
