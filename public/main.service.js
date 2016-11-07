angular.module('weather').service("MainService", MainService);

MainService.$inject = ['$http','$q'];

function MainService($http,$q) {
    
    var service = this;
    
    service.getWeather = function() {
        
        return $q(function(resolve,reject){
            $http.get('/api/OR/Portland').then(function(response){
                
               //resolve(response); 
               //console.log(response.data);
               var data = processResponse(response.data);
               
               resolve(data);
               
            }, function(error){
                
                reject(error);
            });
        });
        
    }
    
    function processResponse(data) {
        //console.log(data);
        //var parsedData = JSON.parse(data);
        
        //var resp = data.current_observation;
        
        //console.log(data);
        
        var returnValue = {
            image: data.icon_url,
            last_updated: data.observation_time,
            precip: data.precip_today_string,
            weather: data.weather,
            temp: data.tempurature_string,
            wind: data.wind_string,
            feels_like: data.feelslike_string,
            url: data.forecast_url,
            wind_dir: data.wind_dir
        };
        
        
       // console.log(data);
        return data;
    }
    
}