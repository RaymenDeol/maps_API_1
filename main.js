var options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

function getCity(lat, long, callback) {
   
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDyCNhsk7JcLFjb-PXyjprSUZIil7VBgqg';
    var async = true;
    

    request.open(method, url, async);
    request.responseType = 'json';
    request.send();


    request.onload = function() {
        if(request.readyState == 4 && request.status == 200){
            data = request.response;
            callback(data);
        } else {
            alert(`Error ${request.status}: ${request.statusText}`); 
        }    
    };
  
        
    
    request.onprogress = function(event) {
        if (event.lengthComputable) {
        alert(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
        alert(`Received ${event.loaded} bytes`); 
        }
    
    };
    
    request.onerror = function() {
        alert("Request failed");
    };
    
}

function createMap(lat, long) {
    getCity(lat, long, function(location_data){
        var crds = {lat: lat, lng: long};

        var map = new google.maps.Map(document.getElementById('map'), {center: crds, zoom:7});

        var marker = new google.maps.Marker({position: crds, map:map});

        var infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(crds);
        infoWindow.setContent('Location Found');
        infoWindow.open(map);

        console.log(location_data.compound_code);
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