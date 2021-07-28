const http = require("http");
const urlapi = require("url");
const fs = require("fs"); 
const url = require("url")
const path = require("path");
const nStatic = require("node-static");
const nearbyCities = require("nearby-big-cities");
const requestImageSize = require('request-image-size');
//const nearbyCities = require('find-nearest-cities');
var Scraper = require('images-scraper');

//const GoogleImages = require('google-images');
//const client = new GoogleImages('5e43258ecb0740378', 'AIzaSyDrA4s-ZTgImqEsqaxaxFYxCzSTckBXbuY');


const { Console } = require("console");
const google = new Scraper({
    puppeteer: {
      headless: true,
    },
  });


const filePath = path.join(__dirname, "lib/leaflet.html");
var allFileServer = new nStatic.Server(path.join(__dirname, "/"));

function index(req, res) {
    fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
        if (!err) {
            //console.log("HELOO")
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        } else {
            console.log(err);
        }
    });
}

function error404(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("404 Not Found :(");
}

function include(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return true;
        }
    }
    return false;
}

function api(req, res)
{
	var q = url.parse(req.url, true);
    var returncity = nearcity(parseFloat(q.query.lat), parseFloat(q.query.lng));

    returncity = returncity[0];

    rus = ["RU", "UA", "BY"];

    (async () => {
        //console.log(returncity.country);
        if (include(rus, returncity.country) != false ){
            art = " картина";
        }
        else{
            art = " painting";
        };

        while(true){
            try{
                resulturl = await google.scrape(returncity.name.toString() + art, 3);
                break;
            } catch(e){
                console.log("ERROR WHITH GOOGLE", e);
            };
            
        };
        
        for(i = 0; i<3; i++){
            try{
                returnurl = resulturl[i].url;
                resultsize = await requestImageSize(returnurl)
                break
    
            } catch(e){
                console.log("ERROR WHITH IMG")
            };
        };
        returnurl = resulturl[0].url

        returnimgsize = {w : resultsize.width, h : resultsize.height};

        console.log(art)

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({'city': returncity, 
                                'url': returnurl,
                                'imgsize' : returnimgsize}));
     })();
}

//function random(max) {
//    return Math.floor(Math.random() * max);
//  }


function nearcity(lat, lng){

    var query = {latitude: lat, longitude: lng};
    var cities = nearbyCities(query);
    //var cities = nearbyCities(lat, lng);

    return cities;
};

//async function search(name) {

  //  var result = await google.scrape(name, 1);
    //return r = Promise.resolve(result[0].url)

//}


//const search = async (name) => {
//    var result = await google.scrape(name, 1);
//    //console.log(result[0].url)
//    return result[0].url;
//};

//async function search(name){
//    return (async () => {
//        const result = await google.scrape(name, 1);
//        //console.log('results', result);
//        //console.log(result[0].url)
//        return result[0].url;
//      })();
//};

//console.log(cities[0]);
//var data = require("fs").readFileSync("WORLDCITIES.CSV", "utf8");
//data = data.split("\r\n");
//for (let i of data) { 
//    console.log(data[i]);
//}

function main(req, res) {

    var url = urlapi.parse(req.url);
    var pn = url.pathname;
    //console.log(pn)
    //console.log((pn === '/').toString())

    switch(true) {
        case pn === "/latlng":
            //index(req, res);
            api(req, res);
            //index(req, res);
            break;

        case pn === "/":
            index(req, res);
            break;

        case pn.startsWith("/"):
            allFileServer.serve(req, res);
            break;

        default:
            error404(req, res);
            break;
    }
}

var app = http.createServer(main);
app.listen(8080);
console.log("Listening on 8080");
