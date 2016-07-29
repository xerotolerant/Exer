angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $firebaseObject, $timeout, User) {

  $scope.newEvent = false;
  $scope.events = User.events;
  $scope.subscribedEvents = User.subscribedEvents;

  updateUserData()
  function updateUserData(){
    console.log(User.userData.userRole)
    if(User.userData.userRole == null){
      $timeout(updateUserData, 5000)
    }else if (User.userData.userRole == "validator") {
      $scope.player = false;
    }else {
      $scope.player = true;
    }

  }


  var latLng = {lat: 10.51499342546846, lng: -61};
    $scope.latLng = latLng;
    updateLocation = function(){
      $scope.latLng = latLng;
    }

  //get device current location
  navigator.geolocation.getCurrentPosition(function(position){
    console.log(latLng);
    latLng.lat = position.coords.latitude;
    latLng.lng =  position.coords.longitude;

  }), function(error){
    console.log(error.code, error.message);
    console.log("Failed to detect location");
  };//get device current location




  $scope.subscribe = function(eventId){
    User.subscribe(eventId)
  }; //subscribe
  //Validate event
  $scope.validateEvent = function(eventId, currentPosition){
    User.validateEvent(eventId, User.currentUser.uid, currentPosition);
  };//validateEvent
})//DashCtrl

.controller('ChatsCtrl', function($scope, Chats, $timeout, $state, KandyChat) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.logData = function(){console.log($scope.directory)};
  refreshDirectory();
  function refreshDirectory(){
    $scope.directory = KandyChat.directory();
    $scope.currentChatUser = KandyChat.currentChatUser();
    $timeout(refreshDirectory, 500);
  }

  $scope.setCurrentChatUser = function(contact){
    KandyChat.setCurrentChatUser(contact);
  }

  $scope.sendMessage = function(message){
    kandy.messaging.sendIm($scope.currentChatUser.full_user_id, message,
      function(s){
        console.log("Message Successfully Sent");

      },
      function(e){console.log("there was an error: ", e)}
    )
    console.log(message);
  }
  /*
  $scope.Conversations = [];
  $scope.messages = [];
  $scope.friends = [];
  $scope.directory = KandyChat.directory;

  $scope.currentUser = KandyChat.currentChatUser;
  $scope.logData = function(){
    console.log(KandyChat.directory);
    console.log($scope.directory);
  }
  $scope.getConversations = function(conversationArray){

    kandy.messaging.getConversations(
      function(conversations){
        conversationArray = conversations;
        console.log(conversations);
       },
      function(e){console.log(e)}
    )
  }
  $scope.setCurrentChat = function(user){
    console.log("User: ", user);
    KandyChat.currentChatUser = user;
    $state.go('chatScreen');
    $scope.currentChatUser = user;

    $scope.logData = function(){
      console.log($scope.directory);
    }
  }

  kandy.addressBook.retrieveDirectory(
    function(directory){console.log("directory retrieved"); console.log(directory); KandyChat.directory = directory; $scope.directory = directory; $timeout()},
    function(){console.log("failed")}
  )

  $scope.sendIm = function(){
    var message = "hello Kheenan";

    kandy.messaging.sendIm(
      'user1@raiora.hotmail.com',
      message ,
      function(s){console.log("message sent", s)},
      function(e){console.log("sending failed", e)}
    );
  }
  */
})
.controller('chatScreenCtrl', function($scope, User) {
  if(User.userData.userRole == "validator"){
    console.log("I'm a Validator - chat");
    $scope.player = false;
  }else{
    console.log("I'm just a player - chat");
    $scope.player = true;
  }

})
.controller('membersListCtrl', function($scope) {

})

.controller('clubDetailsCtrl', function($scope, Club){
  console.log("Details here");
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);

})


.controller('AccountCtrl', function($scope, $firebaseObject, User, $ionicPopup, $state) {

  $scope.userData = User.userData;
  $scope.user = User.currentUser;
  $scope.users = User.allUsers;
  $scope.settings = {
    enableFriends: true
  };

  if(User.userData.userRole == "validator"){
    $scope.player = false;
  }else{
    $scope.player = true;
  }
  $scope.events = User.events;
  console.log("Events");
  console.log(User.events);
  $scope.logoutUser = function(){
    firebase.auth().signOut().then(function(){
      console.log("Debug: Signed Out");
      $scope.loggedIn = false;
    });
  }
  $scope.members = {};

  $scope.createClub = function(name, location, members, clubDescription){
    User.createClub(name, location, members, clubDescription);
    //console.log(members);
  }

  $scope.logoutUser = User.logout;
})//AccountCtrl

.controller('FeedCtrl', function($scope, User){
  //console.log("Feed controller in a gear");
  console.log(User.userData);
  console.log(User.userData.userRole);

  if(User.userData.userRole == "validator"){
    console.log("I'm a Validator - Feed");
    $scope.player = false;
  }else{
    console.log("I'm just a player - Feed");
    $scope.player = true;
  }
})

.controller('StoreCtrl', function($scope, User){
  //console.log("Store controller in a gear");
  if(User.userData.userRole == "validator"){
    console.log("I'm a Validator - Store");
    $scope.player = false;
  }else{
    console.log("I'm just a player - Store");
    $scope.player = true;
  }

})

.controller('ClubsCtrl', function($scope, Club, User){
  $scope.clubs = Club.clubs;
  if(User.userData.userRole == "validator"){
    console.log("I'm a Validator - clubs");
    $scope.player = false;
  }else{
    console.log("I'm just a player - clubs");
    $scope.player = true;
  }
  console.log($scope.clubs);
  var userID = User.currentUser.uid;
  $scope.request = function(request, userID){
      console.log(request);
      var club = {}
      club[request];
      console.log(club);
  }
})


.controller('CreateEventCtrl', function($scope, User){

  var latLng = {lat: 10.51499342546846, lng: -61};
    $scope.latLng = latLng;
    updateLocation = function(){
      $scope.latLng = latLng;
    }

    var mapOptions = {
      center: latLng,
      zoom: 8

    };
    var marker;


    //Render map
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);




    //get device current location
    navigator.geolocation.getCurrentPosition(function(position){
      console.log(latLng);
      latLng.lat = position.coords.latitude;
      latLng.lng =  position.coords.longitude;
      map.setCenter(latLng);


    }), function(error){
      console.log(error.code, error.message);
      console.log("Failed to detect location");
    };//get device current location

    navigator.geolocation.watchPosition(function(position){
      console.log(latLng);
      latLng.lat = position.coords.latitude;
      latLng.lng =  position.coords.longitude;
      map.setCenter(latLng);
    }, function(error){
      console.log(error.code);
      console.log(error.message);
    });


    //Show newEvent in view
    $scope.toggleNewEvent = function(){
      $scope.newEvent = !$scope.newEvent;
      console.log($scope.newEvent);
      $timeout(function(){
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        google.maps.event.addListenerOnce(map, "idle", function(){
          marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: latLng
          });
        });
      });

      google.maps.event.addListener(map, "click", function(event){
        latLng.lat = event.latLng.lat();
        latLng.lng = event.latLng.lng();
        marker.setPosition(event.latLng);
        map.setCenter(event.latLng);
        $timeout(updateLocation());
      })

    }



  $scope.createEvent = function(title, description, locationName, geolocation, points, date, time, cost) {
    User.createEvent(title, description, locationName, geolocation, points, date, time, cost);
  }
})


.controller('LoginCtrl', function($scope, $state, $location, Club) {
  $scope.changeLocation = function(){
    console.log("Changing View");
    $state.go("tab.chats");

  }
  $scope.request = {};
  $scope.clubs = Club.clubs;


  firebase.auth().onAuthStateChanged(function(user){
    if (user) {
      $scope.loggedIn = true;
      //console.log($scope.loggedIn);
        console.log("Logged In");
        $state.go("tab.dash");
    } else {
      $scope.loggedIn = false;
      //console.log($scope.loggedIn);
      console.log("Logged Out");
    };

  });
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


  $scope.createUser = function(email, password, userRole, username, request){

    console.log("Creating user");
    console.log(request);
    console.log(userRole);
    console.log("email: " + email);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
      console.log("create user role");
      user.updateProfile({
        displayName: username
      });
      firebase.database().ref("users/" + user.uid).set({userRole: userRole, username: username});
      Club.joinRequest(request, user.uid);

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
      //$state.go('tab.chats');
    }).catch(function(error){
      console.log(error.code);
      console.log(error.message);
    });
  };
});//LoginCtrl
