var bwappname = "Brew Week App API";
var bwversion = "1.0.0";
var bwcopyright = "Copyright (c) 2015 Athensworks";
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var db_test = {
	host : 'localhost',
	user : 'username1234',
	password : 'password1234',
	database : 'database1234' };

var connection;
var beer_status_names = ["unknown", "untapped", "tapped", "empty", "empty-reported"];

function dbMgr() {
  connection = mysql.createConnection(db_test);

  connection.connect(function(err) {
    if(err) {
      console.log('ERROR: Unable to connect to MySQL server: ', err);
      setTimeout(dbMgr, 2500);
    }
  });

  connection.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      dbMgr();
    } else {
      throw err;
    }
 });
}

dbMgr();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Brew Week App request from ' + req.ip);
});

app.get('/beers', function(req, res) {
  res.type('json');

  var sql = 'select *,(select count(*) from likes where beer_id = beers.id and likes.like_type = 1) as "taste_count",(select count(*) from likes where beer_id = beers.id and likes.like_type = 2) as "favorite_count" from beers;';

  connection.query(sql, function(err, rows) {
    res.json({ beers: rows });
  });

});

app.get('/establishments', function (req, res) {
  res.type('json');

  var sql = "select establishments.*, statuses.* FROM establishments, statuses WHERE establishments.id = statuses.establishment_id ORDER BY establishments.id;";

  connection.query(sql, function(err, rows) {
        var prow = [];
        var pcnt = 0;
        var bcnt = 0;
        var rowcount = 0;
        var bscnt = 0;
        var keeploop = 1;

        while (rows[rowcount]) {
		keeploop = 1;
		bcnt = 0;
                prow.push({});
                prow[pcnt].address = rows[rowcount].address;
                prow[pcnt].beer_statuses = [];
                while (keeploop) {
                    prow[pcnt].beer_statuses.push({});
                    prow[pcnt].beer_statuses[bcnt].id = rows[bscnt].beer_id;
                    switch(rows[bscnt].status) {
                        case 4:
                                prow[pcnt].beer_statuses[bcnt].status = "empty-reported";
                                break;

                        case 3:
                                prow[pcnt].beer_statuses[bcnt].status = "empty";
                                break;

                        case 2:
                                prow[pcnt].beer_statuses[bcnt].status = "tapped";
                                break;

                        case 1:
                                prow[pcnt].beer_statuses[bcnt].status = "untapped";
                                break;

                        default:
                        case 0:
                                prow[pcnt].beer_statuses[bcnt].status = "unknown";
                                break;
                    }
                    if (bscnt == rows.length - 1) {
                        keeploop = 0;
                    } else if (rows[bscnt].establishment_id < rows[bscnt+1].establishment_id) {
                        keeploop = 0;
                    } else {
                        bscnt++;
			bcnt++;
                    }
                }
                prow[pcnt].id = rows[rowcount].id;
                prow[pcnt].lat = rows[rowcount].lat;
                prow[pcnt].lon = rows[rowcount].lon;
                prow[pcnt].name = rows[rowcount].name;

                if (rows.length >= (rowcount + bcnt + 1)) {
                        rowcount = rowcount + bcnt + 1;
                        pcnt++;
			bscnt++;
                } else {
                        console.log('ERROR: length is %s, count is %s, beer count is %s',rows.length, rowcount, bscnt);
                        rowcount = rows.length;
                }
        }

        res.json({ establishments: prow });
  });
});

app.get('/establishment/:estid/beer_statuses', function (req, res) {
  res.type('json');
  var sql = "SELECT * FROM statuses WHERE statuses.establishment_id = " + req.params.estid + ";";
  connection.query(sql, function (err, rows) {
	  var beer_statuses = [];
	  for (i = 0; i < rows.length; i++) {
		  beer_statuses.push({ id: rows[i].beer_id, status: beer_status_names[rows[i].status] });
	  }
	  res.json({ beer_statuses: beer_statuses });
  });
});

router.put('/establishments/:est_id/beer/:beer_id', function (req, res) {
  var device_guid = req.body.device_guid;
  var establishment_id = req.params.est_id;
  var beer_id = req.params.beer_id;

  console.log('%s %s %s',device_guid, establishment_id, beer_id);

  beer_reporter(beer_id, establishment_id, device_guid, req, res);
});

app.put('/report', function (req, res) {
  var beer_id = req.body.beer_id;
  var establishment_id = req.body.establishment_id;
  var device_guid = req.body.device_guid;

  beer_reporter(beer_id, establishment_id, device_guid, req, res);
});

var beer_reporter = function (beer_id, establishment_id, device_guid, req, res) {
  var sqlcheck = "SELECT * from reportstate WHERE device_guid = ? and establishment_id = ? and beer_id = ? LIMIT 1";
  var inscheck = [device_guid, establishment_id, beer_id];
  sqlcheck = mysql.format(sqlcheck, inscheck);

  // note: Deliberately not using transactions here. The nested SQL queries seem to cause problems.
  //       With transactions in use, not all of the queries are executed until the next request.
  //       Too lazy to debug, so just removed transactions :)

  connection.query(sqlcheck, function(err, result) {
     if (result.length == 1) {
        res.sendStatus(403);
     } else {
  	var sql = "SELECT * from statuses WHERE establishment_id = ? and beer_id = ? LIMIT 1";
  	var inserts = [establishment_id, beer_id];
  	sql = mysql.format(sql, inserts);

    	connection.query(sql, function(err, result) {
      	    if (result.length == 1) {
          	var reportcount = result[0].reported_out_count + 1;
		var sqlupdate = "UPDATE statuses SET status = 4, reported_out_count = ? WHERE establishment_id = ? AND beer_id = ? LIMIT 1";
		var insupdate = [reportcount, establishment_id, beer_id];
		sqlupdate = mysql.format(sqlupdate, insupdate);
        	connection.query(sqlupdate, function(err, result) {
		    var sqlrep = "INSERT into reportstate values (?,?,?,NOW())";
		    var insrep = [device_guid, establishment_id, beer_id];
		    sqlrep = mysql.format(sqlrep, insrep);
		    connection.query(sqlrep, function(err, result) {
			res.sendStatus(200);
		    });
        	});
      	    } else {
	       res.sendStatus(404);
      	    }
        });
     }
  });
};

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
      if (result.affectedRows === 0) {
	var sqlinsert = "INSERT into likes (device_guid, beer_id, age, like_type) VALUES (?,?,?,?)";
	var insinsert = [device_guid, beer_id, age, like.type_id];
	sqlinsert = mysql.format(sqlinsert, insinsert);
        connection.query(sqlinsert, function(err, result) {
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

  console.log('');
  console.log('%s, version %s', bwappname, bwversion);
  console.log('%s', bwcopyright);
  console.log('');
  console.log('Listening on http://%s:%s', host, port);
  console.log('');

});

app.post('/admin/establishments', function (req, res) {
  var estname = req.body.name;
  var estaddr = req.body.address;
  var estlon  = req.body.lon;
  var estlat  = req.body.lat;

  var sql = "SELECT * from establishments where name = ? LIMIT 1";
  var inserts = [estname];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
    if (result.length == 1) {
	res.sendStatus(403);
    } else {
	var sqladd = "INSERT into establishments (name, lat, lon, address) VALUES (?,?,?,?)";
	var insadd = [estname, estlat, estlon, estaddr];
	sqladd = mysql.format(sqladd, insadd);

	connection.query(sqladd, function(err, result) {
		res.sendStatus(200);
	});
    }
  });
});

app.put('/admin/establishments', function (req, res) {
  var estid   = req.body.id;
  var estname = req.body.name;
  var estaddr = req.body.address;
  var estlon  = req.body.lon;
  var estlat  = req.body.lat;

  var sql = "SELECT * from establishments where id = ? LIMIT 1";
  var inserts = [estid];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
    if (result.length == 0) {
	res.sendStatus(404);
    } else {
	var sqladd = "UPDATE establishments SET name = ?, lat = ?, lon = ?, address = ? WHERE id = ?";
	var insadd = [estname, estlat, estlon, estaddr, estid];
	sqladd = mysql.format(sqladd, insadd);

	connection.query(sqladd, function(err, result) {
		res.sendStatus(200);
	});
    }
  });
});

app.delete('/admin/establishments', function (req, res) {
  var estid   = req.body.id;
  var estname = req.body.name;
  var estaddr = req.body.address;

  var sql = "DELETE FROM establishments WHERE id = ? AND name = ? AND address = ? LIMIT 1";
  var inserts = [estid, estname, estaddr];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
    if (result.affectedRows == 1) {
	res.sendStatus(200);
    } else {
	res.sendStatus(404);
    }
  });
});

app.post('/admin/beers', function (req, res) {
  var beername = req.body.name;
  var beerbrew = req.body.brewery;
  var beeribu = req.body.ibu;
  var beerabv = req.body.abv;
  var beerlimited = req.body.limited_release;
  var beerdesc = req.body.description;
  var beerrbid = req.body.rate_beer_id;

  var sql = "SELECT * from beers WHERE name = ? AND brewery = ? LIMIT 1";
  var inserts = [beername, beerbrew];
  sql = mysql.format(sql,inserts);

  connection.query(sql, function(err, result) {
	if (result.length == 1) {
		res.sendStatus(403);
	} else {
		var sqladd = "INSERT into beers (name, brewery, ibu, abv, limited_release, description, rate_beer_id) VALUES (?,?,?,?,?,?,?)";
		var insadd = [beername, beerbrew, beeribu, beerabv, beerlimited, beerdesc, beerrbid];
		sqladd = mysql.format(sqladd, insadd);

		connection.query(sqladd, function(err, result) {
			res.sendStatus(200);
		});
	}
  });
});

app.put('/admin/beers', function (req, res) {
  var beerid = req.body.id;
  var beername = req.body.name;
  var beerbrew = req.body.brewery;
  var beeribu = req.body.ibu;
  var beerabv = req.body.abv;
  var beerlimited = req.body.limited_release;
  var beerdesc = req.body.description;
  var beerrbid = req.body.rate_beer_id;

  var sql = "SELECT * from beers WHERE id = ? LIMIT 1";
  var inserts = [beerid];
  sql = mysql.format(sql,inserts);

  connection.query(sql, function(err, result) {
	if (result.length == 0) {
		res.sendStatus(404);
	} else {
		var sqladd = "UPDATE beers SET name = ?, brewery = ?, ibu = ?, abv = ?, limited_release = ?, description = ?, rate_beer_id = ? WHERE id = ?";
		var insadd = [beername, beerbrew, beeribu, beerabv, beerlimited, beerdesc, beerrbid, beerid];
		sqladd = mysql.format(sqladd, insadd);

		connection.query(sqladd, function(err, result) {
			res.sendStatus(200);
		});
	}
  });
});

app.delete('/admin/beers', function (req, res) {
  var beerid = req.body.id;
  var beername = req.body.name;
  var beerbrew = req.body.brewery;

  var sql = "DELETE FROM beers WHERE id = ? AND name = ? AND brewery = ? LIMIT 1";
  var inserts = [beerid, beername, beerbrew];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
    if (result.affectedRows == 1) {
	res.sendStatus(200);
    } else {
	res.sendStatus(404);
    }
  });
});

app.post('/admin/statuses', function (req, res) {
  var est_id = req.body.establishment_id;
  var beer_id = req.body.beer_id;
  var status = req.body.status;

  var sql = "SELECT * from statuses WHERE establishment_id = ? AND beer_id = ? LIMIT 1";
  var inserts = [est_id, beer_id];

  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
	if (result.length == 1) {
		res.sendStatus(403);
	} else {
		var numstatus;
		switch(status) {
			case "empty-reported":
				numstatus = 4;
				break;

			case "empty":
				numstatus = 3;
				break;

			case "tapped":
				numstatus = 2;
				break;

			case "untapped":
				numstatus = 1;
				break;

			default:
			case "unknown":
				numstatus = 0;
				break;
		}

		var sqladd = "INSERT into statuses VALUES (?,?,?,0,NOW())";
		var insadd = [est_id, beer_id, numstatus];

		sqladd = mysql.format(sqladd, insadd);
		connection.query(sqladd, function(err, result) {
			res.sendStatus(200);
		});
	}
  });
});

app.put('/admin/statuses', function (req, res) {
  var est_id = req.body.establishment_id;
  var beer_id = req.body.beer_id;
  var status = req.body.status;

  var sql = "SELECT * from statuses WHERE establishment_id = ? AND beer_id = ? LIMIT 1";
  var inserts = [est_id, beer_id];

  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
	if (result.length == 0) {
		res.sendStatus(404);
	} else {
		var numstatus;
		switch(status) {
			case "empty-reported":
				numstatus = 4;
				break;

			case "empty":
				numstatus = 3;
				break;

			case "tapped":
				numstatus = 2;
				break;

			case "untapped":
				numstatus = 1;
				break;

			default:
			case "unknown":
				numstatus = 0;
				break;
		}

		var sqladd = "UPDATE statuses SET status = ?, last_out_update = NOW() WHERE establishment_id = ? AND beer_id = ?";
		var insadd = [numstatus, est_id, beer_id];

		sqladd = mysql.format(sqladd, insadd);
		connection.query(sqladd, function(err, result) {
			res.sendStatus(200);
		});
	}
  });
});

app.delete('/admin/statuses', function (req, res) {
  var est_id = req.body.establishment_id;
  var beer_id = req.body.beer_id;

  var sql = "DELETE FROM statuses WHERE establishment_id = ? AND beer_id = ? LIMIT 1";
  var inserts = [est_id, beer_id];

  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, result) {
	if (result.affectedRows == 1) {
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
  });
});
