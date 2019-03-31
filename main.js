var map;    //Global Variable for Google Map Object


var options = {                 //Global Variable for Google's getCurrentPosition function options parameter       
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

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

            createInfoWindow(lat, long);

        } else {
            alert(`Error ${request.status}: ${request.statusText}`);
        }
    };

    request.onerror = function() {
        alert("Request Failed");
    };
}

//This function creates a  Info Window at the coordinates specified. Info window includes the address in text.
function createInfoWindow(lat, long) {
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyDyCNhsk7JcLFjb-PXyjprSUZIil7VBgqg';
    var async = true;
    

    request.open(method, url, async);
    request.responseType = 'json';
    request.send();


    request.onload = function() {
        if(request.readyState == 4 && request.status == 200){
            var location_data = request.response;
            var address = location_data.results[0].formatted_address;
            var infoWindow = new google.maps.InfoWindow;
            infoWindow.setPosition({lat: lat, lng: long});
            infoWindow.setContent(address);
            infoWindow.open(map);

        } else {
            alert(`Error ${request.status}: ${request.statusText}`); 
        }    
    };
   
    request.onerror = function() {
        alert("Request failed");
    };
}

//This function creates a Map centered and pinned on the USERS LOCATION
function createMap(lat, long) {
        var crds = {lat: lat, lng: long};
       
        map = new google.maps.Map(document.getElementById('map'), {center: crds, zoom:7});

        //Pin the coordinates of the current user.
        var marker = new google.maps.Marker({position: crds, map:map});

        //Create a info window with the address using the current users coordinates
        createInfoWindow(lat, long);

        /*If user clicks button, pin the location specified in the input field
            and create a infowindow at that location with the address in text
            */
        document.getElementById('go_button').onclick = function() {
            markNewLocation();
        };
    
    
    
}

function success(position) {
    /* user lat and long values are extraced here, 
    instead of passing all of the position  data to the createMap function
    */
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