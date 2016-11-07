angular.module('weather').controller('MainController', MainController);

MainController.$inject = ['MainService'];

function MainController(MainService) {
    
    var ctrl = this;
    
    //$scope.initial = 'Hello World';
    
    MainService.getWeather().then(function(response){
        
        ctrl.weather = response;
        
    }, function(error){
        
        console.log(error);
    });
    
}