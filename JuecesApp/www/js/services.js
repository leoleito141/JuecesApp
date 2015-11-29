
app
.factory('dataFactory', ['$http', function($http) {
    var dataFactory = {};    
    const dominio = "https://sgem.com/rest/";

    dataFactory.getStatus = function () {

        console.log($location.absUrl());
        return $http.get(dominio+'UsuarioService/status/', {
            headers: { 'Rol' : 'ADMIN'} 
        });
    };
           
    dataFactory.getDataTenant = function(tenant){
   
	   	return $http.get(dominio+'EventoMultiService/obtenerDataTenant/'+tenant)
		       	.then(function (response) {

		       		localStorage.setItem("tenantActual", JSON.stringify(response.data));
		       				       		
		                 console.log("Entre get Data tenant");
		                 console.log(response);
		                 console.log(response.status);
		                 console.log(response.headers);
		                 console.log(response.config);
		                 return response; 
		                 
	             }).error(function(response){
		             	console.log(response); 
		        });
	         		 
	    };
		
		
	dataFactory.listarCompetenciasPendientes = function(tenantId,juezID){
    	  return $http.get(dominio+'CompetenciaService/listarCompetenciasPendientes/'+tenantId+'/'+juezID , 
          			{headers: { 'Rol' : 'JUEZ'} 
    	  }); 	
    };
    
    dataFactory.altaResultado = function(resultado){
        return $http.post(dominio+'CompetenciaService/guardarResultado', resultado,
        		{headers: { 'Rol' : 'JUEZ'}
        });       	
    };	
		
		
    
    return dataFactory;
}])

.factory('datos',[ function() {
	   
	var datos = {};   
    var participantes = [];
	var posiciones = [];
	var competencia = {};
	
    
    datos.setPosiciones = function(posiciones){
    	datos.posiciones = posiciones;
      };

	datos.getPosiciones = function() {
          return datos.posiciones;
      };
      
    datos.setParticipantes = function(participantes) {
          datos.participantes = participantes;
      };
	datos.getParticipantes = function() {
          return datos.participantes;
      };
	  
	  datos.setCompetencia = function(competencia) {
          datos.competencia = competencia;
      };
	datos.getCompetencia = function() {
          return datos.competencia;
      };
	  
    
    return datos;
}]);  

