let ucsd_ltlng = {lat:32.88317815150233, lng:-117.24126615311246};
let map = null;
let currentPos = null;
let currentLoc = null;
let myLocCircle = null;
let infoWindow = null;
let trackInterval = null;

function initMap() {

    //Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: ucsd_ltlng,
        zoom: 14
    });

    infoWindow = new google.maps.InfoWindow;
    infoWindow.setOptions({maxWidth:100});

    getLocation();

    let input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    let autocomplete = new google.maps.places.Autocomplete(input, {placeIdOnly: true});
    autocomplete.bindTo('bounds', map);

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);

    autocomplete.addListener('place_changed', function() {
        let place = autocomplete.getPlace();

        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        
        destination = place.place_id;
        
        directionsService.route({
            origin: currentPos,
            destination: {'placeId': destination},
            travelMode: 'WALKING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function nextEvent() {
    
}

function constTrack() {
    trackInterval = setInterval(() => { getLocation(); }, 3000);
}

function stopTrack() {
    clearInterval(trackInterval);
}

function getLocation() {
    console.log("updating location!!");

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {

            currentPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            if (currentLoc == null) {
                currentLoc = new google.maps.Marker({
                    position: currentPos,
                    map: map,
                    title: "Current Location",
                    icon: "http://www.robotwoods.com/dev/misc/bluecircle.png"
                });

                myLocCircle = new google.maps.Circle({
                    strokeColor: '#009FFF',
                    strokeOpacity: 0.6,
                    strokeWeight: 1.5,
                    fillColor: '#009FFF',
                    fillOpacity: 0.25,
                    map: map,
                    center: currentPos,
                    radius: 20
                });
            } else {
                currentLoc.setPosition(currentPos);
                myLocCircle.setCenter(currentPos);
            }

            map.setCenter(currentPos);
            map.setZoom(18);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}