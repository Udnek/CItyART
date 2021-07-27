// Center of the map
var center = [55.751244, 37.618423];

// Init the map
var map = L.map('map').setView(center, 10);


// Set up the OSM layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

//function image(url, lat, lng){
//
//    imageBounds = [[lat, lng], [lat+0.1,lng+0.2]];
//    
//    L.imageOverlay(url, imageBounds).addTo(map);    
//}

////////////

function addMarker(coords, imgratio, cityurl){

    if (imgratio >= 1){
        isize = [200*imgratio, 200];
        asize = [0, 200]
    }else{
        isize = [200, 200/imgratio];
        asize = [0, 200/imgratio]
    };

    cityicon = L.icon({
        iconUrl: cityurl,
        shadowUrl: null,
        iconSize: isize,
        iconAnchor: asize,
        //popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });


    marker = L.marker(coords, {icon: cityicon}).addTo(map);
    marker.on("click", function(){
        map.removeLayer(this);
        console.log('marker removed')
    })
    console.log('marker created')
};

//////////////////

map.on('click', function(e){
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;

    
    const http = new XMLHttpRequest();
    geturl = "/latlng?lat=" + (lat).toString() + "&lng=" + (lng).toString();
    console.log("sending to server...")
    http.open('GET', geturl, true);
    http.onload = () => {
        city = (JSON.parse(http.responseText).city);

        cityurl = JSON.parse(http.responseText).url;

        citylat = city.lat;
        citylng = city.lon;
        
        var imagew = (JSON.parse(http.responseText).imgsize.w);
        var imageh = (JSON.parse(http.responseText).imgsize.h);
        
        imgratio = parseFloat(imagew / imageh);

        console.log(JSON.parse(http.responseText).city);
        console.log(JSON.parse(http.responseText).url);
        console.log("image ratio", imgratio);

        addMarker([citylat, citylng], imgratio, cityurl);
    };
     
    http.send();
});