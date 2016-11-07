angular.module('weather').service("MainService", MainService);

MainService.$inject = ['$http','$q'];

function MainService($http,$q) {
    
    var service = this;
    
    service.getWeather = function() {
        
        return $q(function(resolve,reject){
            $http.get('/api/OR/Portland').then(function(response){
                
               //resolve(response); 
               
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
        
        var resp = data.current_observation;
        
        
        return {
            image: resp.icon_url,
            last_updated: resp.observation_time,
            precip: resp.precip_today_string,
            weather: resp.weather,
            temp: resp.tempurature_string,
            wind: resp.wind_string,
            feels_like: resp.feelslike_string,
            url: resp.forecast_url,
            wind_dir: resp.wind_dir
        };
        
    }
    
}