angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  var myUserId = firebase.auth().currentUser.uid;
  //get device current location
  navigator.geolocation.getCurrentPosition(function(position){
    console.log(position);
    $scope.currentPosition = position;
  }), function(error){
    console.log(error.code, error.message);
    console.log("Failed to detect location");
  };//get device current location

  //Show newEvent in view
  $scope.newEvent = true;

  //update scope on events change
  firebase.database().ref("events/").on('value', function(snapshot){
    $scope.events = snapshot.val();
    //console.log(snapshot.val());

  });//update scope on events change

  //update scope on subscribedEvents value change
  firebase.database().ref("users/" + myUserId + "/subscribedEvents").on('value', function(snapshot){

    console.log(snapshot.val());
    $scope.subscribedEvents = snapshot.val();
  });//update scope on subscribedEvents change

  $scope.createEvent = function(title, locationName, geoposition){
    console.log(title + " " + locationName);
    console.log("geoposition: ", geoposition.coords )
    var exerEvent = {
      title: title,
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
  };// createEvent

  $scope.subscribe = function(eventId){
    console.log(eventId);

    firebase.database().ref("users/" + myUserId + "/subscribedEvents/" + eventId).set({eventId : eventId}).then(function(){
      console.log("event added");
    }).catch(function(error){
      console.log(error.code + error.message);
    });
  }; //subscribe

  //Validate event
  $scope.validateEvent = function(eventId){
    //get event location
    firebase.database().ref("events/" + eventId).once("value").then(function(snapshot){
      var eventLocation = snapshot.val().location.geoposition;
      console.log(eventLocation);
      console.log($scope.currentPosition);
      var eventDistance = distance(eventLocation.latitude, eventLocation.longitude, $scope.currentPosition.coords.latitude, $scope.currentPosition.coords.longitude);
      console.log("Event distance: "+ eventDistance);
      //Start QR code scanner if within
      if (eventDistance < 0.3) {
        //scan qr code
        try{
        cordova.plugins.barcodeScanner.scan(
          function(result){

            if (result.text == eventId) {
              firebase.database().ref("users/" + myUserId + "/subscribedEvents/" + eventId).update({validated : true}).then(function(){
                console.log("Event validated");
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
};//validateEvent
})//DashCtrl

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})


.controller('AccountCtrl', function($scope) {
  var myUserId = firebase.auth().currentUser.uid;
  //console.log(myUserId);
  $scope.user = firebase.auth().currentUser;
  firebase.database().ref("users/" + myUserId).once('value').then(function(snapshot){
    console.log(snapshot);
    $scope.user.role = snapshot.val().userRole;
    
  }).catch(function(error){
    console.log(error);
  });
  console.log($scope.user);

  $scope.settings = {
    enableFriends: true
  };
})


.controller('LoginCtrl', function($scope, $location) {
/*
  $scope.facebookLogin = function(){
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope = ("user_birthday");
    firebase.auth().signInWithredirect(provider).then(function(result){
      var token = result.credential.accessToken;
      user = result.user;
    });
  }; //facebookLogin
  */
  $scope.oldUser = true;
  $scope.switch = function(){
    $scope.loggedIn = true;
    $scope.oldUser = false;
  };

  firebase.auth().onAuthStateChanged(function(user){
    if (user) {
      $scope.loggedIn = true;
      console.log($scope.loggedIn);
        console.log("Logged In");
        $location.path("/tab/dash");
    } else {
      $scope.loggedIn = false;
      console.log($scope.loggedIn);
      console.log("Logged Out");
    };

  });


  $scope.logoutUser = function(){
    firebase.auth().signOut().then(function(){
      console.log("Debug: Signed Out");
      $scope.loggedIn = false;
    });
  }
  $scope.createUser = function(email, password, userRole, username){

    console.log("Creating user");
    console.log(userRole);
    console.log("email: " + email);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
      console.log("create user role");
      user.updateProfile({
        displayName: username
      });
      firebase.database().ref("users/" + user.uid).set({userRole: userRole});

    }).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });



  };
  $scope.loginUser = function(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
      $scope.loggedIn = true;
      console.log(user);
    }).catch(function(error){
      console.log(error.code);
      console.log(error.message);
    });
  };
});//LoginCtrl
