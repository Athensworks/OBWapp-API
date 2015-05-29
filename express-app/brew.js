
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'drunk',
	password : 'bartender12345',
	database : 'testbrew' });

connection.connect();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Brew Week App request from ' + req.ip);
});

app.get('/beers', function (req, res) {
  res.type('json');
  res.json({
  "beers": [{
    "abv": 5.4,
    "brewery": "Jackie O's",
    "favorite_count": 44,
    "ibu": 45,
    "id": 1,
    "limited_release": false,
    "name": "Firefly Amber",
    "rate_beer_id": 111588,
    "taste_count": 100
  }, {
    "abv": 6.7,
    "brewery": "Jackie O's",
    "favorite_count": 52,
    "ibu": 58,
    "id": 2,
    "limited_release": false,
    "name": "Chomolungma",
    "rate_beer_id": 111587,
    "taste_count": 126
  }, {
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
});
});

app.get('/establishments', function (req, res) {
  res.type('json');
  res.json(
{
  "establishments": [{
    "address": "24 W. Union St. Athens OH 45701",
    "beer_statuses": [{
      "id": 1,
      "status": "tapped",
    }, {
      "id": 2,
      "status": "untapped",
    }, {
      "id": 3,
      "status": "empty",
    }],
    "id": 1,
    "lat": "39.236",
    "lon": "-82.015",
    "name": "Jackie O's"
  }]
});

});

app.get('/establishment/:estid/beer_statuses', function (req, res) {
  res.send('beer status for establishment ' + req.params.estid);
});

app.post('/taste', function (req, res) {
  var like = {
    type_id: 1,
    type: "taste"
  };

  liker(req, res, like);
});

app.post('/favorite', function (req, res) {
  var like = {
    type_id: 2,
    type: "favorite"
  };

  liker(req, res, like);
});

var liker = function(req, res, like) {
  var beer_id     = req.body.beer_id;
  var device_guid = req.body.device_guid;
  var age         = req.body.age;

  var sql = "DELETE FROM likes WHERE device_guid = ? AND beer_id = ? AND like_type = ?";
  var inserts = [device_guid, beer_id, like.type_id];
  sql = mysql.format(sql, inserts);

  connection.beginTransaction(function(err){
    connection.query(sql, function(err, result) {
      if (result.affectedRows == 0) {
        connection.query('INSERT INTO likes SET ?', {device_guid: device_guid, beer_id: beer_id, age: age, like_type: like.type_id}, function(err, result) {
          likeResponse(beer_id, like, res);
        })
      } else {
        likeResponse(beer_id, like, res);
      }
    });
  });

}

var likeResponse = function(beer_id, like, res) {
  var sql = "SELECT COUNT(*) FROM likes WHERE beer_id = ? AND like_type = ?";
  var inserts = [beer_id, like.type_id];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
    connection.commit(function(error){});

    var object = {
      beer_id: beer_id,
      count: countFromRow(result[0]),
      like_type: like.type
    };

    res.json(object);
  });
};

var countFromRow = function(row) {
  return row["COUNT(*)"];
}
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Brew Week app listening at http://%s:%s', host, port);

});
