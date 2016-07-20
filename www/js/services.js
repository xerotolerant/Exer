angular.module('starter.services', [])
.service("User", function($firebaseObject){
  //service-wide variables

  //get User Data from firebase
  this.currentUser = firebase.auth().currentUser
  //get User role from firebase database
  var currentUserDataRef = firebase.database().ref("users/" + this.currentUser.uid);
  this.userData = $firebaseObject(currentUserDataRef);

  //get user subscribedEvents
  var subscribedEventsRef = firebase.database().ref("users/" + this.currentUser.uid + "/subscribedEvents");
  this.subscribedEvents = $firebaseObject(subscribedEventsRef);

  //Get Events data from firebase
  this.eventRef = firebase.database().ref("events");
  this.events = $firebaseObject(this.eventRef);


  //User points test
  var userPointsRef = firebase.database().ref("users/" + this.currentUser.uid + "/points/");

  var userPoints = $firebaseObject(userPointsRef);
  userPoints.$loaded().then(function(){console.log(userPoints)});
  //console.log(userInfo);

  //subscribe to events
  this.subscribe = function(eventId){
    firebase.database().ref("users/" + this.currentUser.uid + "/subscribedEvents/" + eventId).set({eventId : eventId}).then(function(){
      console.log("event added");
    }).catch(function(error){
      console.log(error.code + error.message);
    });
  };

  //create events
  this.createEvent = function(title, locationName, geoposition, points, date, time){
    console.log(title + " " + locationName);
    console.log("geoposition: ", geoposition.coords )
    var exerEvent = {
      title: title,
      points:points,
      date: date,
      time: time,
      location: {
        name: locationName,
        geoposition: {
          latitude: geoposition.coords.latitude,
          longitude: geoposition.coords.longitude
        }
      }
    }
    console.log("Creating event");
    firebase.database().ref('events/').push(exerEvent);
  };
  //validate events
  this.validateEvent = function(eventId, userId, currentPosition){
    //get event location
    firebase.database().ref("events/" + eventId).once("value").then(function(snapshot){
      var eventLocation = snapshot.val().location.geoposition;
      console.log(snapshot.val().points);
      console.log(currentPosition);
      var eventDistance = distance(eventLocation.latitude, eventLocation.longitude, currentPosition.coords.latitude, currentPosition.coords.longitude);
      console.log("Event distance: "+ eventDistance);
      //Start QR code scanner if within
      if (eventDistance < 0.3) {
        //scan qr code
        try{
        cordova.plugins.barcodeScanner.scan(
          function(result){
            console.log(result);
            if (result.text == eventId) {
              firebase.database().ref("users/" + userId + "/subscribedEvents/" + eventId).update({validated : true}).then(function(){
                console.log("Event validated");
              }).catch(function(error){
                console.log(error.code, error.message);
              });


              firebase.database().ref("users/"+ userId).update({points : userPoints.$value + snapshot.val().points}).then(function(){
                console.log("Points updated");
              }).catch(function(error){
                  console.log(error.code, error.message);
              });

            }
            else{
              alert("Invalid Code");
            }
          },
          function(error){
            alert("scanning failed: " + error);
          }

      );// barcodeScanner.scan
    }catch(error){
      console.log(error);
    }
  }else{
    alert("Cannot validate from this location");
  };
    });//test location



  function distance(lat1, lon1, lat2, lon2){
    var p = Math.PI/180;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
         c(lat1 * p) * c(lat2 * p) *
         (1 - c((lon2 - lon1) * p))/2;

     return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  }

  this.createClub = function(name, locationName ){
    var exerClub = {
      name:name,
      location:{
        name:locationName
      }
    }
    firebase.database().ref('clubs/').push(exerClub);
    console.log("Event Created");
  }

  var clubref = firebase.database().ref("clubs");
  this.clubs = $firebaseObject(clubref);

})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
