var map;

var options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

function getLocationInfo(lat, long, callback) {
   
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyDyCNhsk7JcLFjb-PXyjprSUZIil7VBgqg';
    var async = true;
    

    request.open(method, url, async);
    request.responseType = 'json';
    request.send();


    request.onload = function() {
        if(request.readyState == 4 && request.status == 200){
            var data = request.response;
            callback(data);
        } else {
            alert(`Error ${request.status}: ${request.statusText}`); 
        }    
    };
   
    request.onerror = function() {
        alert("Request failed");
    };
    
}

function markNewLocation() {
    var search_term = document.getElementById("search_field").value;

    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + search_term + '&key=AIzaSyDyCNhsk7JcLFjb-PXyjprSUZIil7VBgqg';
    var async = true
    
    request.open(method, url, async);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        if(request.readyState == 4 && request.status == 200) {
            var data = request.response;
            var lat = data.results[0].geometry.location.lat;
            var long = data.results[0].geometry.location.lng;
            var coords = {lat: lat, lng: long};

            var marker = new google.maps.Marker({position: coords, map:map});

            var infoWindow = new google.maps.InfoWindow;
            infoWindow.setPosition(coords);
            infoWindow.setContent(data.results[0].formatted_address);
            infoWindow.open(map);

        } else {
            alert(`Error ${request.status}: ${request.statusText}`);
        }
    };

    request.onerror = function() {
        alert("Request Failed");
    };
}

function createMap(lat, long) {
    getLocationInfo(lat, long, function(location_data){
        var crds = {lat: lat, lng: long};
       
        var address = location_data.results[0].formatted_address;
        

        map = new google.maps.Map(document.getElementById('map'), {center: crds, zoom:7});

        var marker = new google.maps.Marker({position: crds, map:map})

        var infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(crds);
        infoWindow.setContent();
        infoWindow.open(map);

        document.getElementById('go_button').onclick = function() {
            markNewLocation();
        };
    });
    
    
}

function success(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude
    createMap(lat, long);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}


function initMap() {    
    navigator.geolocation.getCurrentPosition(success, error, options);        
}