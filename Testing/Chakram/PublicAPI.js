
var ipAddress = "http://173.230.142.215:3000"

var executeGetBeers = true,
    executeGetEstablisments = true,
    executeTastes = true,
    executeFavorites = true,
    executePutReport = true;

var getEstablishmentResultsJSON = {"establishments":[{"address":"25 Campbell St. Athens, Ohio United States 45701 ","beer_statuses":[{"id":4,"status":"untapped"},{"id":6,"status":"empty-reported"}],"id":41,"lat":39.3318,"lon":-82.0907,"name":"Jackie O's Taproom"},{"address":"24 West Union, Athens, OH 45701","beer_statuses":[{"id":2,"status":"untapped"},{"id":6,"status":"empty-reported"}],"id":42,"lat":39.3276,"lon":-82.1023,"name":"Jackie O's"},{"address":"14 N Court St Athens, Ohio","beer_statuses":[{"id":1,"status":"tapped"}],"id":43,"lat":39.3296,"lon":-82.1011,"name":"Red Brick"},{"address":"234 W Washington St Athens, Ohio","beer_statuses":[{"id":6,"status":"empty"}],"id":39,"lat":39.3322,"lon":-82.1103,"name":"West End Cider House"},{"address":"27 Brown Avenue Athens, OH 45701","beer_statuses":[{"id":6,"status":"tapped"}],"id":40,"lat":39.3338,"lon":-82.1089,"name":"Ricky's House"}]};

// This response varies due to favorite and taste count changes
// Commented out to ignore value. Schema is checked to verify existance
var getBeersResultsJSON = {"beers":[{"id":1,"name":"Ricky's Porter #3","brewery":"Ball n Chain Buds","ibu":40,"abv":5.6,"limited_release":1,"description":"An IPA that does not judge","rate_beer_id":"5551234",
//"taste_count":3,"favorite_count":2
},{"id":2,"name":"Ricky Wheat #2","brewery":"Ball n Chain Buds","ibu":45,"abv":4.6,"limited_release":1,"description":"An DPA that does not judge","rate_beer_id":"5551232",
//"taste_count":2,"favorite_count":12
},{"id":4,"name":"Ricky IPA #1","brewery":"Ball n Chain Buds","ibu":35,"abv":3.6,"limited_release":1,"description":"An OPA thats not going to get you drunk","rate_beer_id":"5550231",
//"taste_count":4,"favorite_count":0
},{"id":6,"name":"Ricky's Wheat","brewery":"Homebrew","ibu":35,"abv":5.6,"limited_release":1,"description":"Brief description","rate_beer_id":"317414",
//"taste_count":1,"favorite_count":1
}]};


var chakram = require('chakram'),
    expect = chakram.expect;


function TypicalResponse (response,obj,expectedJSON) {
  expect(response).to.have.status(200);
  obj.timeout(10000);
  if(expectedJSON!=undefined) expect(response).to.comprise.of.json(expectedJSON);
  // expect(response).to.have.header("content-type", "application/json");
};

function RunGetTest (Title,url,DataJSON,expectedJSON) {
  it(Title, function () {
      var response = chakram.get(url);
      TypicalResponse(response,this,expectedJSON);
      return chakram.wait();
    }
  );
}


function GetBeers () {
  describe("Get Beers", function () {
    it("I need some beers", function () {
      var response = chakram.get(ipAddress+"/beers");
      // This response varies due to favorite and taste count changes
      TypicalResponse(response,this,getBeersResultsJSON);
      expect(response).to.have.schema("beers",{
          "required": [
              "id", 
              "name", 
              "brewery",
              "ibu",
              "abv",
              "limited_release",
              "description",
              "rate_beer_id",
              "taste_count",
              "favorite_count"
          ]
      });
      return chakram.wait();
    });
  });
}

function GetEstablishments () {
  describe("Get Establishments", function () {

    RunGetTest("Who has beer?", ipAddress+"/establishments",getEstablishmentResultsJSON);


    RunGetTest("Who has beer near me?",ipAddress+'/establishments?parameters='+
      {
        "lat": "39.43",
        "lon": "-79.5",
        "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
        "age":  "34"
      }
      ,getEstablishmentResultsJSON
    );

    RunGetTest("Who has beer near me? - Out of order",ipAddress+'/establishments?parameters='+
      {
        "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
        "lon": "-79.5",
        "age":  "34",
        "lat": "39.43"
      }
      ,getEstablishmentResultsJSON
    );

    RunGetTest("Who has beer near me? - Incomplete",ipAddress+'/establishments?parameters='+
      {
        "age":  "34",
        "lat": "39.43"
      }
      ,getEstablishmentResultsJSON
    );

    RunGetTest("Who has beer near me? - Invalid",ipAddress+'/establishments?parameters='+
      {
        "lat": "48.3334",
        "lon": "Somewhere west",
        "device_guid": "3943-34-34ggsed3232-325325-352",
        "age":  "Oldddddd"
      }
      ,getEstablishmentResultsJSON
    );

    it("Hey, do you have any beer left?", function () {
      var establishment_id = 3;
      var response = chakram.get(ipAddress+'/establishment/'+establishment_id+'/beer_statuses');
      var expected = {"beer_statuses":[{"id":6,"status":"empty-reported"},{"id":4,"status":"untapped"}]};
      TypicalResponse(response,this,expected);
      expect(response).to.have.schema("beer_statuses",{
          "required": [
              "id", 
              "status", 
          ]
      });
      return chakram.wait();
    });

  });
}

// ******************************************************************************************
function Favorites () {
  describe("Post Favorites", function () {
    it("THIS IS MY FAVORITE BEER EVER!", function () {
      var response = chakram.post(ipAddress+'/favorite',
        {
          "beer_id": 2,
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
          "age":  43,
          "lat": "39.43",
          "lon": "-79.5",
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 2,
          //"count": 2,
          "like_type": "favorite"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });

    it("THIS IS MY FAVORITE BEER EVER! - Out of order", function () {
      var response = chakram.post(ipAddress+'/favorite',
        {
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
          "lon": "-79.5",
          "beer_id": 2,
          "age":  43,
          "lat": "39.43"
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 2,
          //"count": 2,
          "like_type": "favorite"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });

    it("THIS IS MY FAVORITE BEER EVER! - Incomplete", function () {
      var response = chakram.post(ipAddress+'/favorite',
        {
          "beer_id": 2,
          "lat": "39.43",
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 2,
          //"count": 2,
          "like_type": "favorite"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });

    it("THIS IS MY FAVORITE BEER EVER! - Invalid", function () {
      var response = chakram.post(ipAddress+'/favorite',
        {
          "beer_id": 2,
          "device_guid": "4sdey96-ef00-411b-8db2-04e65erwwthop85ed",
          "age":  "One Hunned",
          "lat": "ATHENS",
          "lon": "OHIO",
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 2,
          //"count": 2,
          "like_type": "favorite"
        };
      TypicalResponse(response,this,expected);

      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });
  });
}
// ******************************************************************************************

// ******************************************************************************************
function Tastes () {
  describe("Post Tastes", function () {
    it("Dude, let me taste your beer", function () {
      var response = chakram.post(ipAddress+'/taste',
        { 
          "beer_id": 6,
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
          "age":  35,
          "lat": "39.43",
          "lon": "-79.5",
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 6,
          //"count": 2,
          "like_type": "taste"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });

    it("Dude, let me taste your beer - Out of  order", function () {
      var response = chakram.post(ipAddress+'/taste',
        { 
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
          "lat": "39.43",
          "beer_id": 6,
          "lon": "-79.5",
          "age":  35,
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 6,
          //"count": 2,
          "like_type": "taste"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });

    it("Dude, let me taste your beer - Incomplete", function () {
      var response = chakram.post(ipAddress+'/taste',
        { 
          "beer_id": 6,
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
          "age":  35,
          "lat": "39.43",
          "lon": "-79.5",
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 6,
          //"count": 2,
          "like_type": "taste"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });

    it("Dude, let me taste your beer - Invalid", function () {
      var response = chakram.post(ipAddress+'/taste',
        { 
          "beer_id": 6,
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed",
          "age":  35,
          "lat": "39.43",
          "lon": "-79.5",
        }
      );

      // This response varies due to count changes
      var expected = 
        {
          "beer_id": 6,
          //"count": 2,
          "like_type": "taste"
        };
      TypicalResponse(response,this,expected);
      
      // Verifies that all response entries were received regardless of value
      expect(response).to.have.schema({
          "required": [
              "beer_id", 
              "count", 
              "like_type", 
          ]
      });
      return chakram.wait();
    });
  });
}
// ******************************************************************************************

function PutReport () {
  describe("Put Report", function () {
    it("Someone needs to know that this beer is out", function () {
      var response = chakram.put(ipAddress+'/report',
        {
          "beer_id": 6,
          "establishment_id": 4,
          "device_guid": "4e956896-ef00-411b-8db2-04e651a585ed"
        }
      );
      TypicalResponse(response,this);
      return chakram.wait();
    });
  });
}


if(executeGetBeers){
  GetBeers();
}

if(executeGetEstablisments){
  GetEstablishments();
}

if(executeTastes) {
    Tastes();
}

if(executeFavorites){
  Favorites();
}


if(executePutReport){
  PutReport();
}
