
var ipAddress = "http://173.230.142.215:3000/admin";
var adminToken = "";  // Needs to be set with valid token
var adminAccessStr = "/?access_token="+adminToken;

var executeAdminBeers = true,
    executeAdminEstablisments = true,
    executeAdminStatus = true,
    executePosts = true,
    executePuts = true,
    executeDeletes = false;   // false so nothing is deleted on accident. Set to true to test deletion


var beerURL = ipAddress+'/beers'+adminAccessStr;
var establishmentURL = ipAddress+'/establishments'+adminAccessStr;
var statusURL = ipAddress+'/statuses'+adminAccessStr;

var chakram = require('chakram'),
    expect = chakram.expect;

if(executeAdminBeers){
  Admin_Beers();
}
if(executeAdminEstablisments){
  Admin_Establishments();
}
if(executeAdminStatus){
  Admin_Status();
}

function Admin_Beers (argument) {
  describe("Admin Beers", function () {

    // ******************************************************************************************
    RunPostTest("Post Beer",beerURL,
      {
        "name": "Ricky IPA",
        "brewery": "Ball n Chain Buds",
        "ibu": "40",
        "abv": "5.6",
        "limited_release": "1",
        "description": "An IPA that you can't get drunk on",
        "rate_beer_id": "5551234"
      }
    );

    RunPostTest("Post Beer - Out of order",beerURL,
      {
        "description": "An IPA that you can't get drunk on",
        "name": "Ricky IPA",
        "limited_release": "1",
        "abv": "5.6",
        "brewery": "Ball n Chain Buds",
        "rate_beer_id": "5551234",
        "ibu": "40",
      }
    );

    RunPostTest("Post Beer - Incomplete",beerURL,
      {
        "name": "Ricky IPA",
        "ibu": "40",
        "description": "An IPA that you can't get drunk on",
      }
    );

    RunPostTest("Post Beer - Invalid",beerURL,
      {
        "name": "Ricky IPA bad",
        "brewery": "Ball n Chain Buds",
        "ibu": "4fdsgs",
        "abv": "dsheeieh",
        "limited_release": "1gdas",
        "description": "An IPA that you can't get drunk on",
        "rate_beer_id": "5551234ssf "
      }
    );
    // ******************************************************************************************

    // ******************************************************************************************
    RunPutTest("Put Beer",beerURL,
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
    );

    RunPutTest("Put Beer - Out of order",beerURL,
      {
        "rate_beer_id": "5551234",
        "limited_release": "1",
        "id": "1",
        "ibu": "40",
        "description": "An IPA that you can't get drunk on",
        "name": "Ricky IPA",
        "brewery": "Ball n Chain Buds",
        "abv": "5.6",        
      }
    );

    RunPutTest("Put Beer - Incomplete",beerURL,
      {
        "name": "Ricky IPA",
        "ibu": "40",
        "description": "An IPA that you can't get drunk on",
        "rate_beer_id": "5551234"
      }
    );

    RunPutTest("Put Beer - Invalid",beerURL,
      {
        "id": "afdgdas",
        "name": "R dsa fda",
        "brewery": "Ball n Chain Buds",
        "ibu": "dsgahe",
        "abv": "fewfd",
        "limited_release": "tredst",
        "description": "An IPA that you can't get drunk on",
        "rate_beer_id": "5551234"
      }
    );
    // ******************************************************************************************

    // ******************************************************************************************
    RunDeleteTest("Delete Beer", beerURL,
      {
        "id": "1",
        "name": "Ricky IPA",
        "brewery": "Ball n Chain Buds"
      }
    );
    RunDeleteTest("Delete Beer - Out of order",beerURL,
      {
        "brewery": "Ball n Chain Buds",
        "name": "Ricky IPA",  
        "id": "1",
      }
    );

    RunDeleteTest("Delete Beer - Incomplete",beerURL,
      {
        "name": "Ricky IPA",
      }
    );

    RunDeleteTest("Delete Beer - Invalid",beerURL,
      {
        "id": "test324",
        "name": "Ricky IPA",
        "brewery": "Ball n Chain Buds"
      }
    );
    // ******************************************************************************************

  });
}

function Admin_Establishments (argument) {
  describe("Admin Establishments", function () {
    
    // ******************************************************************************************
    RunPostTest("Post Establishments",establishmentURL,
      {
        "name": "Some Random Pub",
        "address": "44 Court Street, Athens, OH 45701",
        "lon": "123.4567",
        "lat": "456.7890"
      }
    );

    RunPostTest("Post Establishments - Out of order",establishmentURL,
      {
        "lat": "456.7890",
        "address": "44 Court Street, Athens, OH 45701",
        "lon": "123.4567",
        "name": "Some Random Pub",
      }
    );

    RunPostTest("Post Establishments - Incomplete",establishmentURL,
      {
        "name": "Some Random Pub",
        "lat": "456.7890"
      }
    );

    RunPostTest("Post Establishments - Invalid",establishmentURL,
      {
        "name": 27343,
        "address": "44 Court Street, Athens, OH 45701",
        "lon": "1fdsgss",
        "lat": "456dgsdhssdh"
      }
    );
    // ******************************************************************************************

    // ******************************************************************************************
    RunPutTest("Put Establishments",establishmentURL,
      {
        "id": "1",
        "name": "Some Random Pub",
        "address": "44 Court Street, Athens, OH 45701",
        "lon": "123.4567",
        "lat": "456.7890"
      }
    );

    RunPutTest("Put Establishments - Out of order",establishmentURL,
      {
        "address": "44 Court Street, Athens, OH 45701",
        "lon": "123.4567",
        "id": "1",
        "name": "Some Random Pub",
        "lat": "456.7890"      
      }
    );

    RunPutTest("Put Establishments - Incomplete",establishmentURL,
      {
        "id": "1",
        "lon": "123.4567",
        "lat": "456.7890"
      }
    );

    RunPutTest("Put Establishments - Invalid",establishmentURL,
      {
        "id": "fdshagfdsa",
        "name": "Some Random Pub",
        "address": "44 Court Street, Athens, OH 45701",
        "lon": "Hi",
        "lat": "Bye"
      }
    );
    // ******************************************************************************************

    // ******************************************************************************************
    RunDeleteTest("Delete Establishments", establishmentURL,
      {
        "id": "1",
        "name": "Some Random Pub",
        "address": "44 Court Street, Athens, OH 45701"
      }
    );
    RunDeleteTest("Delete Establishments - Out of order",establishmentURL,
      { 
        "address": "44 Court Street, Athens, OH 45701",
        "name": "Some Random Pub",
        "id": "1",
      }
    );

    RunDeleteTest("Delete Establishments - Incomplete",establishmentURL,
      {
        "address": "44 Court Street, Athens, OH 45701"
      }
    );

    RunDeleteTest("Delete Establishments - Invalid",establishmentURL,
      {
        "id": "reywyrewyui",
        "name": 2374291,
        "address": "44 Court Street, Athens, OH 45701"
      }
    );
    // ******************************************************************************************

  });
}

function Admin_Status (argument) {
  describe("Admin Status", function () {
    
    // ******************************************************************************************
    RunPostTest("Post Status",statusURL,
      {
        "establishment_id": "1",
        "beer_id": "1",
        "status": "tapped"
      }
    );

    RunPostTest("Post Status - Out of order",statusURL,
      {
        "status": "tapped",
        "beer_id": "1",
        "establishment_id": "1",
      }
    );

    RunPostTest("Post Status - Incomplete",statusURL,
      {
        "beer_id": "1",
        "status": "tapped"
      }
    );

    RunPostTest("Post Status - Invalid",statusURL,
      {
        "establishment_id": "Ricky",
        "beer_id": "4",
        "status": "Kegstand In Progress"
      }
    );
    // ******************************************************************************************

    // ******************************************************************************************
    RunPutTest("Put Status",statusURL,
      {
        "establishment_id": "1",
        "beer_id": "1",
        "status": "empty"
      }
    );

    RunPutTest("Put Status - Out of order",statusURL,
      {
        "status": "empty",
        "beer_id": "1",
        "establishment_id": "1",
      }
    );

    RunPutTest("Put Status - Incomplete",statusURL,
      {
        "establishment_id": "1",
        "status": "empty"
      }
    );

    RunPutTest("Put Status - Invalid",statusURL,
      {
        "establishment_id": "1",
        "beer_id": "Blah",
        "status": "Rolling down Jeff Hill"
      }
    );
    // ******************************************************************************************

    // ******************************************************************************************
    RunDeleteTest("Delete Status", statusURL,
      {
        "establishment_id": "1",
        "beer_id": "1",
      }
    );
    RunDeleteTest("Delete Status - Out of order",statusURL,
      { 
        "beer_id": "1",
        "establishment_id": "1",
      }
    );

    RunDeleteTest("Delete Status - Incomplete",statusURL,
      {
        "beer_id": "1",
      }
    );

    RunDeleteTest("Delete Status - Invalid",statusURL,
      {
        "establishment_id": "Jackie O's",
        "beer_id": "Razz Wheat",
      }
    );
    // ******************************************************************************************

  });
}


function RunPostTest (Title,url,DataJSON,expectedJSON){
  if(executePosts){
    it(Title, function () {
        var response = chakram.post(url,DataJSON);
        TypicalResponse(response,this,expectedJSON);
        return chakram.wait();
      }
    );
  }
}

function RunPutTest (Title,url,DataJSON,expectedJSON){
  if(executePuts){
    it(Title, function () {
        var response = chakram.put(url,DataJSON);
        TypicalResponse(response,this,expectedJSON);
        return chakram.wait();
      }
    );
  }
}

function RunDeleteTest (Title,url,DataJSON,expectedJSON){
  if(executeDeletes){
    it(Title, function () {
        var response = chakram.delete(url,DataJSON);
        TypicalResponse(response,this,expectedJSON);
        return chakram.wait();
      }
    );
  }
}

function TypicalResponse (response,obj,expectedJSON) {
  expect(response).to.have.status(200);
  obj.timeout(10000);
  if(expectedJSON!=undefined) expect(response).to.comprise.of.json(expectedJSON);
  // expect(response).to.have.header("content-type", "application/json");
};