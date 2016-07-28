angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('exerConsol.store', {
    url: '/page10',
    views: {
      'tab2': {
        templateUrl: 'templates/store.html',
        controller: 'storeCtrl'
      }
    }
  })

  .state('exerConsol.cart', {
    url: '/cart',
    views: {
      'tab2': {
        templateUrl: 'templates/cart.html',
        controller: 'cartCtrl'
      }
    }
  })

  .state('eventList', {
    url: '/eventList',
    templateUrl: 'templates/eventList.html',
    controller: 'eventListCtrl'
  })

  .state('validatorEventList', {
    url: '/validatorEventList',
    templateUrl: 'templates/validatorEventList.html',
    controller: 'validatorEventListCtrl'
  })

  .state('exerConsol.clubList', {
    url: '/page15',
    views: {
      'tab3': {
        templateUrl: 'templates/clubList.html',
        controller: 'clubListCtrl'
      }
    }
  })

  .state('exerConsol.feed', {
    url: '/feed',
    views: {
      'tab7': {
        templateUrl: 'templates/feed.html',
        controller: 'feedCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.productDetails'
      2) Using $state.go programatically:
        $state.go('exerConsol.productDetails');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab7/productDetails
      /exerConsole/tab2/productDetails
      /exerConsole/tab3/productDetails
  */
  .state('exerConsol.productDetails', {
    url: '/productDetails',
    views: {
      'tab7': {
        templateUrl: 'templates/productDetails.html',
        controller: 'productDetailsCtrl'
      },
      'tab2': {
        templateUrl: 'templates/productDetails.html',
        controller: 'productDetailsCtrl'
      },
      'tab3': {
        templateUrl: 'templates/productDetails.html',
        controller: 'productDetailsCtrl'
      }
    }
  })

  .state('exerConsol.clubDetails', {
    url: '/clubDetails',
    views: {
      'tab3': {
        templateUrl: 'templates/clubDetails.html',
        controller: 'clubDetailsCtrl'
      }
    }
  })

  .state('exerConsol.checkInMyEvents', {
    url: '/checkIn',
    views: {
      'tab1': {
        templateUrl: 'templates/checkInMyEvents.html',
        controller: 'checkInMyEventsCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.eventInfo'
      2) Using $state.go programatically:
        $state.go('exerConsol.eventInfo');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab1/eventInfo
      /exerConsole/tab7/eventInfo
  */
  .state('exerConsol.eventInfo', {
    url: '/eventInfo',
    views: {
      'tab1': {
        templateUrl: 'templates/eventInfo.html',
        controller: 'eventInfoCtrl'
      },
      'tab7': {
        templateUrl: 'templates/eventInfo.html',
        controller: 'eventInfoCtrl'
      }
    }
  })

  .state('eventConfirmation', {
    url: '/eventConfirmation',
    templateUrl: 'templates/eventConfirmation.html',
    controller: 'eventConfirmationCtrl'
  })

  .state('createEvent', {
    url: '/createEvent',
    templateUrl: 'templates/createEvent.html',
    controller: 'createEventCtrl'
  })

  .state('makeBooking', {
    url: '/makeBooking',
    templateUrl: 'templates/makeBooking.html',
    controller: 'makeBookingCtrl'
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.scanQR'
      2) Using $state.go programatically:
        $state.go('exerConsol.scanQR');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab1/ScanQR
      /exerConsole/tab7/ScanQR
  */
  .state('exerConsol.scanQR', {
    url: '/ScanQR',
    views: {
      'tab1': {
        templateUrl: 'templates/scanQR.html',
        controller: 'scanQRCtrl'
      },
      'tab7': {
        templateUrl: 'templates/scanQR.html',
        controller: 'scanQRCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.chat'
      2) Using $state.go programatically:
        $state.go('exerConsol.chat');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab4/chat
      /exerConsole/tab7/chat
  */
  .state('exerConsol.chat', {
    url: '/chat',
    views: {
      'tab4': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      },
      'tab7': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.membersList'
      2) Using $state.go programatically:
        $state.go('exerConsol.membersList');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab4/membersList
      /exerConsole/tab7/membersList
  */
  .state('exerConsol.membersList', {
    url: '/membersList',
    views: {
      'tab4': {
        templateUrl: 'templates/membersList.html',
        controller: 'membersListCtrl'
      },
      'tab7': {
        templateUrl: 'templates/membersList.html',
        controller: 'membersListCtrl'
      }
    }
  })

  .state('exerConsol.profile', {
    url: '/profile',
    views: {
      'tab3': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.otherUserProfile'
      2) Using $state.go programatically:
        $state.go('exerConsol.otherUserProfile');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab4/otherUserProfile
      /exerConsole/tab7/otherUserProfile
  */
  .state('exerConsol.otherUserProfile', {
    url: '/otherUserProfile',
    views: {
      'tab4': {
        templateUrl: 'templates/otherUserProfile.html',
        controller: 'otherUserProfileCtrl'
      },
      'tab7': {
        templateUrl: 'templates/otherUserProfile.html',
        controller: 'otherUserProfileCtrl'
      }
    }
  })

  /* 
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='exerConsol.chatScreen'
      2) Using $state.go programatically:
        $state.go('exerConsol.chatScreen');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /exerConsole/tab4/page18
      /exerConsole/tab7/page18
  */
  .state('exerConsol.chatScreen', {
    url: '/page18',
    views: {
      'tab4': {
        templateUrl: 'templates/chatScreen.html',
        controller: 'chatScreenCtrl'
      },
      'tab7': {
        templateUrl: 'templates/chatScreen.html',
        controller: 'chatScreenCtrl'
      }
    }
  })

  .state('exerConsol', {
    url: '/exerConsole',
    templateUrl: 'templates/exerConsol.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/exerConsole/feed')

  

});