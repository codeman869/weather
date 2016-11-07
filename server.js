//Setup

var express = require('express');
var app = express();

var mongoose = require("mongoose");
mongoose.connect(process.env.mongo_uri);


var morgan = require("morgan");
var bodyParser = require("body-parser");

var methodOverride = require("method-override");
var http = require('http');



//Config

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({'extended': 'true'}));

app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

app.listen(process.env.PORT);

console.log('Magic happening on port 8080');

var schema = new mongoose.Schema(
    {
        image: String,
        last_updated: String,
        precip: String,
        weather: String,
        temp: String,
        wind: String,
        feels_like: String,
        url: String,
        wind_dir: String
    }, 
    {
        timestamps: true
    });

var Condition = mongoose.model('Condition', schema);

app.get('/api/:state/:city', function(req, res){
    
    var state = req.params.state;
    var city = req.params.city;
    
    var options = {
        host: 'api.wunderground.com',
        path: '/api/'+ process.env.api_key+'/conditions/q/'+state+'/'+city+'.json',
        method: 'GET',
        
    };
    
    var query = Condition.find().sort({"createdAt":-1}).limit(1).exec(function(error,result){
            
        var current = result[0];    
        
        //console.log(current);
        
        var currentDate = new Date();
        var time = (1 * 60 * 60 * 1000);
        //time = 1;
        var expiration = new Date(currentDate.getTime() - time);
        console.log(error);
        if (!error && current != null && current.createdAt > expiration ){
            console.log('returning current result');
            res.json(current);
            
        } else {
            //console.log('Else condition!');
            http.request(options, function(res2) {
                //console.log('sending http request');
                res2.setEncoding('utf8');
                var data;
                res2.on('data', function(chunk){
                //console.log('Body: '+chunk);
                    data = chunk;
                });
        
                res2.on('end', function(){
                //console.log('No more data'); 
                
                var response = JSON.parse(data);
           
                var observation = response.current_observation;
           
                var newCondition = new Condition({
                        image: observation.icon_url,
                        last_updated: observation.observation_time,
                        precip: observation.precip_today_string,
                        weather: observation.weather,
                        temp: observation.tempurature_string,
                        wind: observation.wind_string,
                        feels_like: observation.feelslike_string,
                        url: observation.forcast_url,
                        wind_dir: observation.wind_dir
                });
           
           
                //console.log("New Condition:" + newCondition);
                newCondition.save();
           
                res.json(newCondition);
            });
        
            }).end();
    
        }
        
    });
    
   
    
});

app.get('/favicon.ico', function(req,res){
    
    res.send(200);
});

app.get('*', function (req,res) {
   
    res.sendFile('./public/index.html');
   
});

