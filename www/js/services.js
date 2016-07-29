angular.module('starter.services', [])
.service("User", function($firebaseObject, $ionicPopup, $state, $timeout){


  //get User Data from firebase
  this.currentUser = firebase.auth().currentUser;
  //get User role from firebase database
  var currentUserDataRef = firebase.database().ref("users/" + this.currentUser.uid);
  this.userData = $firebaseObject(currentUserDataRef);

  //get user subscribedEvents
  var subscribedEventsRef = firebase.database().ref("users/" + this.currentUser.uid + "/subscribedEvents");
  this.subscribedEvents = $firebaseObject(subscribedEventsRef);

  var allUsersRef = firebase.database().ref("users/");
  this.allUsers = $firebaseObject(allUsersRef);

  //Get Events data from firebase
  this.eventRef = firebase.database().ref("events");
  this.events = $firebaseObject(this.eventRef);

  this.logout = function() {
    var confirmed = $ionicPopup.confirm({
      title: "Are you Sure?",
      okText: "Logout",
      okType : "button-assertive"
    })

    if (confirmed){
      firebase.auth().signOut().then(function(){
        console.log("Debug: Signed Out");
        $state.go("login");
      });
    }else {
      alert("Doing Nothing");
    }
  }


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
    //console.log("geoposition: ", geoposition.coords )
    var exerEvent = {
      title: title,
      points:parseInt(points),
      date: date,
      time: time,
      location: {
        name: locationName,
        geoposition: {
          latitude: geoposition.lat,
          longitude: geoposition.lng
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
      var eventDistance = distance(eventLocation.latitude, eventLocation.longitude, currentPosition.lat, currentPosition.lng);
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
                $ionicPopup.alert({
                  title: "Congratulations!",
                  template: "You got " + userPoints.$value + " points!",
                  subtitle: "You got " + userPoints.$value + " points!"
                });
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
    }//Distance
  }//Validate  event

  this.createClub = function(name, locationName, members ){
    var exerClub = {
      name:name,
      members: members,
      location:{
        name:locationName
      }
    }
    firebase.database().ref('clubs/').push(exerClub);
    console.log("Club Created");
  }





})//User Service

.service('Chats', function($firebaseObject) {
  var currentUser = firebase.auth().currentUser;
  var userListRef = firebase.database().ref('users/userList');
  this.userList = $firebaseObject(userListRef);

  var friendListRef = firebase.database().ref('users/' + currentUser.uid + '/friends');
  this.friendList = $firebaseObject(friendListRef);
})


.service("Club", function($firebaseObject, $ionicPopup){

  var clubref = firebase.database().ref("clubs");
  this.clubs = $firebaseObject(clubref);

  //function to send request to joining clubs
  this.joinRequest = function(clubs, userID){
    if(clubs == null){
        console.log("Clubs is Empty");
    }else{
      console.log(clubs);
      for(var key in clubs){
        var request = {
            userID : userID,
            resposne : false

        };
        var club = {
            clubID: key,
            status: "Awaiting Response"
        };
        firebase.database().ref("clubs/"+ key + "/request/").push(request);
        firebase.database().ref("users/"+ userID + "/clubs/").push(club);
        console.log(key);
      }
    }
    //get all the clubs from the clubs object7
    //firebase.database().ref("clubs/" + + "/request/").push();



  }
})
.service("KandyChat", function($timeout, $firebaseObject, $firebaseArray, $timeout){

  kandy.setup({
    listeners: {
      message: onMessageReceived
    }
  });//kandy.setup

  function onMessageReceived(message){
    if (chats[chats.length - 1] !== message) {
      chats.$add(message);
    }
    //chats.$add(message);
    console.log(chats);
  }

  //chatsObject
  var chats = {};
  var getChats = function(){
    return chats
  }
  //User Kandy Credentials
  var currentUser = firebase.auth().currentUser;
  var kandyRef = firebase.database().ref("users/" + currentUser.uid + "/kandy");
  var directory = {};
  var factoryKandy = $firebaseObject(kandyRef);
  var currentChatUser = {};
  var kandyConversations = [];
  var chatMessages;
  //get messages for currentChatUser

  console.log(currentChatUser);

  //get User Kand credentials from firebase server
  factoryKandy.$loaded().then(function(data){
    kandy.login(
      "DAK38603c393d394a1ab1452c3b12a20cef",
       data.id,
       data.password,
       function(s){
         console.log("Kandy Login succesful");
         kandy.messaging.getConversations(
           function(conversations){kandyConversations = conversations},
           function(error){console.log(error)}
         );
         kandy.addressBook.retrieveDirectory(
           function(data){
             console.log("directory retrieved");
             //console.log(data);
             directory = data;
           },
           function(){console.log("failed")}
         )
       },
       function(e){console.log("Kandy Login failed")}
     );

  });//kandy Firebase object




  var setCurrentChatUser = function(contact){
    currentChatUser = contact;
  }


  return{
    directory: function(){return directory},
    setCurrentChatUser: setCurrentChatUser,
    currentChatUser: function(){return currentChatUser},
    chats: function(){return chats},
    kandyConversations: function(){return kandyConversations},
    currentUser: function(){return currentUser}
  }

});
