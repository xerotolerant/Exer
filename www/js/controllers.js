angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $firebaseObject, $timeout, User, KandyChat) {

  $scope.newEvent = false;
  $scope.events = User.events;
  $scope.subscribedEvents = User.subscribedEvents;

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





  //$scope.logData = function(){console.log($scope.directory)};
  //update view with controller data

  refreshDirectory();
  function refreshDirectory(){
    $scope.directory = KandyChat.directory();
    $scope.conversations = KandyChat.kandyConversations();
    //$scope.currentChatUser = KandyChat.currentChatUser();
    $timeout(refreshDirectory, 500);
  }
  $scope.logData = function(){
    console.log('Conversation: ', $scope.conversations);
    console.log("Directory: ", $scope.directory);

    console.log();
  }
  $scope.setCurrentChatUser = function(contact){
    KandyChat.setCurrentChatUser(contact);
  }

  $scope.hasConversation = function(conversations, contactID){
    //loop through objects in conversations array
    //if any object contains contactID under full_user_id return true
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].destination === contactID){
        return true
      }
    }
    return false
  }

  $scope.setCurrentChat = function(user){
    console.log("User: ", user);
    KandyChat.currentChatUser = user;
    $state.go('chatScreen');
    $scope.currentChatUser = user;
  }//setCurrentChat

})//ChatsCtrl
.controller('ChatScreenCtrl', function($scope, KandyChat, $timeout, $stateParams) {
  var recipientID = $stateParams.recipientID;
  console.log(recipientID);
  //get messages from Kandy
  kandy.messaging.getMessages(recipientID, {}, function(success){
    $scope.messages = success
  }, function(error){
    console.log(error);
  })//getMessages

  $scope.logMessages = function(){
    console.log($scope.chat);
    console.log(KandyChat.kandyConversations());
  }//logMessages



  function refreshDirectory(){
    $scope.directory = KandyChat.directory;
    //get current chatUser
    //$scope.currentChatUser = KandyChat.currentChatUser();
    $scope.chat = KandyChat.chats();
    $timeout(refreshDirectory, 500);
  }//refreshDirectory

  $scope.sendMessage = function(message){
    kandy.messaging.sendIm(recipientID, message,
      function(s){
        console.log("Message Successfully Sent");
        console.log(s);

        //KandyChat.addChat(s);
      },
      function(e){console.log("there was an error: ", e)}
    )
  }//sendMessage

})//ChatScreenCtrl
.controller('membersListCtrl', function($scope, KandyChat) {
  $scope.directory = KandyChat.directory();
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  //$scope.chat = Chats.get($stateParams.chatId);
})


.controller('AccountCtrl', function($scope, $firebaseObject, User, $ionicPopup, $state) {

  $scope.userData = User.userData;
  $scope.user = User.currentUser;
  $scope.users = User.allUsers;
  $scope.settings = {
    enableFriends: true
  };

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

  $scope.createClub = function(name, location, members){
    User.createClub(name, location, members);
    //console.log(members);
  }

  $scope.logoutUser = User.logout;
})//AccountCtrl

.controller('FeedCtrl', function($scope){
  //console.log("Feed controller in a gear");
})

.controller('StoreCtrl', function($scope){
  //console.log("Store controller in a gear");
})

.controller('ClubsCtrl', function($scope, Club){
  $scope.clubs = Club.clubs;
  console.log($scope.clubs);
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


.controller('LoginCtrl', function($scope, $state, $location, Club, $timeout) {

  /*function updateError() {
    $scope.error = $scope.error;
    $timeout(updateError, 500);
  }*/
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
      //console.log("Logged In");
        $state.go("tab.chats");
    } else {
      $scope.loggedIn = false;
      //console.log($scope.loggedIn);
      //console.log("Logged Out");
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



  $scope.logoutUser = function(){
    firebase.auth().signOut().then(function(){
      console.log("Debug: Signed Out");
      $scope.loggedIn = false;
    });
  }
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
      console.log($scope);
      $timeout(function(){$scope.errorMessage = error.message}, 500);

    });
  };
})//LoginCtrl

.controller('OtherUserProfileCtrl', function($scope, KandyChat, $state, $stateParams){
  $scope.userID = $stateParams.recipientID;
  console.log($scope.userID);


});
