# OBWapp-API

##Testing
-----------

To test the API you can use curl, here is the syntax:

 curl -H "Content-Type: application/json" -X *METHOD* -d '{ *JSON DATA* }' http://*ip*:3000/*api/path/*

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
{"beers": [
 {
        "abv": 5.0,
        "brewery": "Jackie O's",
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
        "brewery": "Jackie O's",
        "favorite_count": 52,
        "ibu": 123,
        "id": 2,
        "limited_release": false,
        "name": "Firefly Amber",
        "taste_count": 126,
        "description": "Even better description"
    },
    {
        "abv": 4.7,
        "brewery": "Jackie O's",
        "favorite_count": 11110,
        "ibu": 32,
        "id": 3,
        "limited_release": true,
        "name": "Razz Wheat",
        "taste_count": 12,
        "description": "The best description"
    }]
}
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

Data:
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

## Authentication

All of the /admin API endpoints are protected by authenticated HTTP requests
using RFC 6750 compliant bearer tokens. This can be expanded by having OAuth 2.0
issue the bearer tokens.

To use the /admin API endpoints, you must create at least one user in the usertoken table.

Example:

Then when issuing your requests to /admin you would append *?access_token=super-secret-bearer-token*

So in our example:

 curl -H "Content-Type: application/json" -X PUT -d '{"establishment_id": "6", "beer_id": "1", "status": "tapped"}' \
  http://10.80.90.100:3000/admin/statuses/?access_token=30085658-71d8-4f69-ae6f-33764cec544b
