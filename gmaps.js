var directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
var directionsService = new google.maps.DirectionsService();
var map;
var marker;
$(window).load(function() {
    var marker;
    var myOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(55.75, 37.62)
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directions"));

    $("#routeMode").on("change", function() { calcRoute(); });
    $("#routeGo").on("click", function() { calcRoute(); });
    $("#routeClear").on("click", function() { directionsDisplay.setDirections({ routes: [] }); });

        // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': pos}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        map.setZoom(11);
                        marker = new google.maps.Marker({
                            position: pos,
                            map: map
                        });
                        //infowindow.setContent(results[1].formatted_address);
                        //infowindow.open(map, marker);
                        map.setCenter(pos);
                        $("#routeFrom").val(results[0].formatted_address);
                        console.log(results);
                    }
                } else {
                    alert("Geocoder failed due to: " + status);
                }
            });

            /*var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
            });

            map.setCenter(pos);*/
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }
    function calcRoute() {
        var request = {
            origin: $("#routeTo").val(),
            destination: $("#routeFrom").val(),
            travelMode: google.maps.TravelMode[$("#routeMode").val()]
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                marker.setMap(null);
            }
        });
    }
});


