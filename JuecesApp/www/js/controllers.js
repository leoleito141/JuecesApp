
app

.controller('ResultadoCtrl', ['$scope','$state','$auth','dataFactory','dataTenant','datos','$ionicHistory',
                                     function ($scope, $state, $auth, dataFactory, dataTenant,datos, $ionicHistory) {
										 
//$ionicNavBarDelegate

										 
										 
	 $scope.listCanSwipe = true;
	 
	
   const tipo_colectivo = "colectivo";
   const tipo_individual = "individual";
   
   $scope.nombreTenant = dataTenant.nombre_url;   
   $scope.mensajeValidacion = "";   
   
   $scope.competenciaSeleccionada = {};
   
   $scope.dataCompetencia = {};
   $scope.objetosCombo = [];   
   $scope.posiciones = [];
   
   $scope.estadisticas = [];
   $scope.estadistica = {};
   
									
	 if( datos != null && datos.getPosiciones() != null){
	 
		$scope.posiciones = datos.getPosiciones();
	
	 }
	 
	 if( datos != null && datos.getParticipantes() != null){
	
		$scope.objetosCombo = datos.getParticipantes();
		
	 }
	 if( datos != null && datos.getCompetencia() != null){
	 
		$scope.dataCompetencia = datos.getCompetencia();
		
	 }
									 

      
   var juez = (JSON.parse(localStorage.getItem("dataUsuario")));   	

   $scope.listarCompetenciasPendientes = function(){
	   dataFactory.listarCompetenciasPendientes(dataTenant.tenantId,juez.usuarioId).
	   		then(function (response, status, headers, config) {	
			
				$scope.competencias = response.data;			
//				console.log($scope.competencias);
				
			}).catch(function(response){
				$scope.mensajeValidacion = "Error obteniendo competencias pendientes.";
			});
	 
   };
  
   $scope.setCompetenciaSeleccionada = function(idCompetencia){
	   
	  
	
	   
	   if($scope.competencias.length != 0){
		   
		   $scope.limpiarDatos(true);
		   
		   var indice = -1;
		   for(var i = 0; i < $scope.competencias.length; i++) {
			    if ($scope.competencias[i].idCompetencia === idCompetencia) {
			    	indice = i;
			        break;
			    }
			}
		   $scope.competenciaSeleccionada = $scope.competencias[indice];
		   
		   if($scope.competenciaSeleccionada.tipoDeporte == 'individual'){//cargo deportistas
			 
			   for(var i = 0; i < $scope.competenciaSeleccionada.deportistas.length; i++) {				    
				    $scope.objetosCombo.push({'id': $scope.competenciaSeleccionada.deportistas[i].deportistaID, 
					   						'nombre' : $scope.competenciaSeleccionada.deportistas[i].nombre + " " + 
			   										   $scope.competenciaSeleccionada.deportistas[i].apellido
   											});
			   }
			   
			   for(var i = 0; i < $scope.objetosCombo.length; i++) {
				   $scope.posiciones.push(i+1);
			   }
			   
		   }else{//cargo paises
			   
			   var paises = [];
			   
			   for(var i = 0; i < $scope.competenciaSeleccionada.deportistas.length; i++) {				    
				   if(paises.indexOf($scope.competenciaSeleccionada.deportistas[i].comite.pais.pais) == -1){					   
					   paises.push($scope.competenciaSeleccionada.deportistas[i].comite.pais.pais);
				   }
			   }
			   
			   for(var i = 0; i < paises.length; i++) {				    
				  $scope.objetosCombo.push({ 'id' : (i+1),
					  						 'nombre' : paises[i] 
		  									});
			   }
			   
			   for(var i = 0; i < $scope.objetosCombo.length; i++) {
				   $scope.posiciones.push(i+1);
			   }
		   }
		   
		   $scope.estadistica.objeto = $scope.objetosCombo[0];
		   $scope.estadistica.posicion = $scope.posiciones[0];
		   
		    datos.setParticipantes($scope.objetosCombo);
		    datos.setPosiciones($scope.posiciones);
			datos.setCompetencia($scope.competenciaSeleccionada );
			   
		    $state.go('resultado');
		   

		   
	   }else{
		   $scope.mensajeValidacion = "No hay competencias!";
	   }
   };
   
   
   $scope.agregarEstadistica = function(){	 
	   if(!$scope.habilitar()){
		   		   
		   if($scope.dataCompetencia.tipoDeporte == tipo_individual){
			   var e = {};
			   e.tenantId = dataTenant.tenantId;
			   e.posicion = $scope.estadistica.posicion;
			   e.datoInformativo = $scope.estadistica.datoInformativo;		   			   
			   
			   for(var i = 0; i <  $scope.dataCompetencia.deportistas.length; i++) {	
				   var dep = $scope.dataCompetencia.deportistas[i];
				   if(dep.deportistaID == $scope.estadistica.objeto.id){
					   e.deportista = $scope.dataCompetencia.deportistas[i];			   
					   break;
				   }
			   }		   		  
			   
			   $scope.estadisticas.push(e);
			   
		   }else{			   
			   
			   for(var i = 0; i <  $scope.dataCompetencia.deportistas.length; i++) {					   
				   if($scope.dataCompetencia.deportistas[i].comite.pais.pais == $scope.estadistica.objeto.nombre){
					   var e = {};
					   e.tenantId = dataTenant.tenantId;
					   e.posicion = $scope.estadistica.posicion;
					   e.datoInformativo = $scope.estadistica.datoInformativo;
					   e.deportista = $scope.dataCompetencia.deportistas[i];		
					   $scope.estadisticas.push(e)
				   }				   
			   }	
			   
		   }
		   
		   //busco indice del objeto a remover en el combo.
		   for(var i = 0; i <  $scope.objetosCombo.length; i++) {	
			   var obj = $scope.objetosCombo[i];
			   if(obj.id == $scope.estadistica.objeto.id){		
				   $scope.objetosCombo.splice(i,1); // quito el participante que ya tiene la estadistica.	   
				   break;
			   }
		   }  		   
		   
		   var indicePos = $scope.posiciones.indexOf($scope.estadistica.posicion);	   
		   $scope.posiciones.splice(indicePos,1);// quito la posicion que ya tiene la estadistica.	
		   		   	   
		   if($scope.objetosCombo.length != 0){
			   $scope.estadistica.objeto = $scope.objetosCombo[0];
			   $scope.estadistica.posicion = $scope.posiciones[0];			   
			   $scope.estadistica.datoInformativo = null;	   
		   }else{
			   $scope.estadistica = {};
		   }
		   		   
	   }
   };
   
   
   
   $scope.altaResultado = function(){	 
	   if($scope.estadisticas.length != 0){
		   
		   var resultado = {};
		   
		   resultado.tenantId = dataTenant.tenantId;
		   resultado.estadisticas = $scope.estadisticas;
		   resultado.competencia = $scope.dataCompetencia;
		   
		   dataFactory.altaResultado(resultado).
		   		then(function (response, status, headers, config) {	
						
					console.log(response);
					$scope.estadisticas = [];
					$scope.limpiarDatos(false);
					
				}).catch(function(response){
					$scope.mensajeValidacion = "Error al agregar nuevo resultado.";
				}); 
					
		   
	   }else{
		   $scope.mensajeValidacion = "No hay estadisticas!";
	   }
	   
   };
   
   $scope.habilitar = function() {		  
	  if($scope.objetosCombo == undefined){
		  return false;
	  }
	  return ($scope.objetosCombo.length <= 0) || 
  			 ($scope.estadistica.datoInformativo == null || $scope.estadistica.posicion == null || $scope.estadistica.objeto == null);	
   };
   
   $scope.limpiarDatos = function(siguiente){
	   if(!siguiente && $scope.estadisticas.length == 0){
		   $scope.competenciaSeleccionada = {};	   
		   $scope.objetosCombo = [];   
		   $scope.posiciones = [];
		   $scope.estadisticas = [];
		   $scope.estadistica = {};
		   $scope.competencias = {};

		   $state.go('competencias');
	   }else if (siguiente){
		   $scope.competenciaSeleccionada = {};	   
		   $scope.objetosCombo = [];   
		   $scope.posiciones = [];
		   $scope.estadisticas = [];
		   $scope.estadistica = {};
	   }
   };
	
  $scope.logout = function() {  		
  		localStorage.removeItem("dataUsuario");
	    $auth.logout(); //Limpia localStorage y pone isAuthenticated en false
		
	    event.preventDefault();

		$ionicHistory.nextViewOptions({
		  disableAnimate: true,
		  disableBack: true
		});
	    $state.go('login');
			
		//$ionicNavBarDelegate.showBackButton(false);
    };
   
	  
  }])


 .controller('LoginCtrl', ['$scope','$state','$auth','dataFactory','dataTenant','$ionicHistory',
                                     function ($scope, $state, $auth, dataFactory, dataTenant,$ionicHistory) {
 
   const usuario_juez = "Juez";
   
   $scope.nombreTenant = dataTenant.nombre_url;
   $scope.usuario = {};
   
 //  $scope.mensajeValidacion = "";   
   
   $scope.loginUsuario = function () {
  	     
	   	 /*setTimeout( function(){	  */
	   		var usuario = $scope.usuario;
	     
	        $auth.login({
	            email: usuario.email,
	            password: btoa(usuario.password), // base 64
	            tenantId : dataTenant.tenantId
	        })
	        .then(function (data){           
	             $scope.usuario.password="";
	             
	             var payLoad = $auth.getPayload();             
	             var dataUsuario = payLoad.dataUsuario;
	            
	             // ver bien si es en el local o session...
	             localStorage.setItem("dataUsuario", JSON.stringify(dataUsuario));
				
				$ionicHistory.nextViewOptions({
				  disableAnimate: false,
				  disableBack: true
				});
				 
				 $state.go('competencias');
				 console.log("asdasd");
	         })
	         .catch(function(error){
	
	       		console.log(error);
	       		console.log(error.status);
	       		if(error.status == 404){
	       		  $scope.cargando = false;
//	       		  $scope.mensajeValidacion = "Email o contrase\u00F1a incorrecta.";
	       		}else{
	       		  $scope.cargando = false;
//	       		  $scope.mensajeValidacion = "Error al autenticar usuario.";
	       		}
	         });
	        
	    /*}, 1000); //espera 1 segundo*/
	};
   /*
	$scope.logout = function() {  		
  		localStorage.removeItem("dataUsuario");
	    $auth.logout(); //Limpia localStorage y pone isAuthenticated en false
	
	    event.preventDefault();
	    $state.go('login');
    };
     */ 
	  
  }]);

