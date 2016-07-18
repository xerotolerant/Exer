angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $firebaseObject, User) {

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
  $scope.events = User.events;
  $scope.subscribedEvents = User.subscribedEvents;




  $scope.createEvent = function(title, locationName, geoposition){
    User.createEvent(title, locationName, geoposition);
  };// createEvent

  $scope.subscribe = function(eventId){
    User.subscribe(eventId)
  }; //subscribe
  //Validate event
  $scope.validateEvent = function(eventId, currentPosition){
    User.validateEvent(eventId, User.currentUser.uid, currentPosition);
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


.controller('AccountCtrl', function($scope, $firebaseObject, User) {

  $scope.userData = User.userData;
  $scope.user = User.currentUser;
  $scope.settings = {
    enableFriends: true
  };

  $scope.events = User.events;

})//AccountCtrl


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
  $scope.newUser = false;

  $scope.switch = function(){
    if($scope.oldUser){
      $scope.newUser = true;
      $scope.oldUser = false;
    }else{
      $scope.oldUser = true;
      $scope.newUser = false;
    }

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
