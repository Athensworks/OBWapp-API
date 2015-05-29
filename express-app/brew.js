
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

  console.log('%s',JSON.stringify(req.body));
   console.log(req.body.beer_id);
  res.json(req.body);

  connection.query('SELECT * from beers', function(err, rows, fields) {

	if (err) throw err;
	res.json(rows);
  });

});


var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Brew Week app listening at http://%s:%s', host, port);

});
