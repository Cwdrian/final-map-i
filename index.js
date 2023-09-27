//api key1 user location fsq3ci0ruJBDLJjjrt0Gs6k1QbXF760Tk8QqOAZ2MUiSq6c=
//api key2 locations fsq359ekcA18E4r5ucGwxI18STvGRVqdzExKo2YsFZMZ4/I=

document.addEventListener("DOMContentLoaded", function () {
    // Create a Leaflet map
    var map = L.map("map");

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to get the user's location and set the map view
    function getUserLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                // Set the map view to the user's location
                map.setView([userLat, userLng], 13);

                // Add a marker at the user's location with a popup
                var userMarker = L.marker([userLat, userLng]).addTo(map);
                userMarker.bindPopup("You Are Here").openPopup();

                // Fetch nearby businesses from Foursquare using API key1
                var apiKey1 = "fsq3ci0ruJBDLJjjrt0Gs6k1QbXF760Tk8QqOAZ2MUiSq6c=";
                var foursquareUrl = "https://api.foursquare.com/v2/venues/explore" +
                    "?ll=" + userLat + "," + userLng +
                    "&radius=1000" +  // You can adjust the radius as needed
                    "&client_id=" + apiKey1 +
                    "&client_secret=" + apiKey2 +
                    "&v=20230901";  // Use the current date as the version

                // Fetch and process nearby venues
                fetch(foursquareUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        // Process the data and display nearby businesses on the map
                        var venues = data.response.groups[0].items;
                        venues.forEach(function (venue) {
                            var lat = venue.venue.location.lat;
                            var lng = venue.venue.location.lng;
                            var name = venue.venue.name;
                            var address = venue.venue.location.address;

                            // Add markers for nearby businesses
                            var businessMarker = L.marker([lat, lng]).addTo(map);
                            businessMarker.bindPopup(name + "<br>" + address);
                        });
                    })
                    .catch(function (error) {
                        console.error("Error fetching nearby businesses:", error);
                    });
            }, function (error) {
                console.error("Error getting user location:", error);
            });
        } else {
            alert("Geolocation is not available in your browser.");
        }
    }

    // Call the function to get the user's location and set the map view
    getUserLocation();
});



