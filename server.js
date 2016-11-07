//Setup

var express = require('express');
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/weather');


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

app.get('/api/:state/:city', function(req, res){
    
    var state = req.params.state;
    var city = req.params.city;
    
    var options = {
        host: 'api.wunderground.com',
        path: '/api/'+ process.env.api_key+'/conditions/q/'+state+'/'+city+'.json',
        method: 'GET',
        
    };
    
    
    http.request(options, function(res2) {
        //console.log('STATUS' + res2.statusCode);
       // console.log('Headers:' + JSON.stringify(res2.headers));
        res2.setEncoding('utf8');
        var data;
        res2.on('data', function(chunk){
            //console.log('Body: '+chunk);
            data = chunk;
        });
        
        res2.on('end', function(){
           //console.log('No more data'); 
           
           var response = JSON.parse(data);
           
           //console.log(data);
           
           res.json(response);
        });
        
    }).end();
    
    
    
});





app.get('*', function (req,res) {
    console.log('Request received: '+req);
    res.sendFile('./public/index.html');
    //res.render('test');
});

