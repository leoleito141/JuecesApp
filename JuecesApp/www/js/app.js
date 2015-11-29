// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var app = angular.module('eventosSGEM', ['ionic','satellizer'] )

.run(function($ionicPlatform,$rootScope,$auth,$state) {
		
	$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }	
  });
  
/*  $ionicPlatform.registerBackButtonAction(function () {
	  if (!$auth.isAuthenticated()){ //&& $ionicHistory.currentStateName === 'someStateName'){
		$ionicNavBarDelegate.showBackButton(false);
		event.preventDefault();
		$state.go("login");
	  } else {
		$ionicHistory.goBack();
	  }
	}, 100);
  */
  
})

.config(function($authProvider,$stateProvider, $urlRouterProvider) {
 
	// Parametros de configuración
	$authProvider.loginUrl = "https://sgem.com/rest/UsuarioService/loginIonic";
	$authProvider.tokenName = "token";
	$authProvider.tokenPrefix = "myApp";
	
 
	  $stateProvider
	  .state('login', {
		url: '/',
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl',
		resolve: { 
	    	dataTenant: function(dataFactory,$ionicHistory,$ionicNavBarDelegate) {
    			/***** ESTO ESTARÍA BUENO IMPLEMENTARLO EN UN UTIL O FUNCION ****/

	    		if( localStorage.getItem("tenantActual") == null) {
	    			return dataFactory.getDataTenant("SOCHI");
	    			
	    		}else{
	    			return JSON.parse(localStorage.getItem("tenantActual"));
	    		}
			
	    		/**********************************************************/   
	    	}  
	    }

	  })
	  .state('resultado', {
		url: '/resultado',
		templateUrl: 'templates/resultado.html',
		controller: 'ResultadoCtrl',
		resolve: { 
	    	dataTenant: function(dataFactory) {
    			/***** ESTO ESTARÍA BUENO IMPLEMENTARLO EN UN UTIL O FUNCION ****/
	    		
	    		if( localStorage.getItem("tenantActual") == null) {
	    			return dataFactory.getDataTenant("SOCHI");
	    			
	    		}else{
	    			return JSON.parse(localStorage.getItem("tenantActual"));
	    		}
			
	    		/**********************************************************/   
	    	}  
	    }

	  })
	  
	   .state('competencias', {
		url: '/competencias',
		cache: false,
		templateUrl: 'templates/competencias.html',
		controller: 'ResultadoCtrl',
		 resolve: { 
	    	dataTenant: function(dataFactory) {
    			/***** ESTO ESTARÍA BUENO IMPLEMENTARLO EN UN UTIL O FUNCION ****/
	    		
	    		if( localStorage.getItem("tenantActual") == null) {
	    			return dataFactory.getDataTenant("SOCHI");
	    			
	    		}else{
	    			return JSON.parse(localStorage.getItem("tenantActual"));
	    		}
			
	    		/**********************************************************/   
	    	}  
	    }

	  });

 
  $urlRouterProvider.otherwise("/");
 
});




