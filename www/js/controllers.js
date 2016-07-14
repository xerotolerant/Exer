angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  $scope.newEvent = true;
  firebase.database().ref("events/").on('value', function(snapshot){
    $scope.events = snapshot.val();
    console.log(snapshot.val());
  });
  $scope.createEvent = function(title, location){
    console.log(title + " " + location);
    var exerEvent = {
      title: title,
      location: {
        name: location
      }
    }
    console.log("Creating event");
    firebase.database().ref('events/').push(exerEvent);
  };



})

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
  $scope.settings = {
    enableFriends: true
  };
})


.controller('LoginCtrl', function($scope, $location) {

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
  $scope.createUser = function(email, password){

    console.log("Creating user");
    console.log("email: " + email);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
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
});