//api key1 user location fsq3ci0ruJBDLJjjrt0Gs6k1QbXF760Tk8QqOAZ2MUiSq6c=

document.addEventListener("DOMContentLoaded", function () {
    // Create a Leaflet map
    var map = L.map("map");

    // OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function getUserLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;

                // Set the map view to users location
                map.setView([userLat, userLng], 13);

                // Marker at the users location
                var userMarker = L.marker([userLat, userLng]).addTo(map);
                userMarker.bindPopup("You Are Here").openPopup();

                // Call the placeSearch function to fetch nearby coffee shops
                placeSearch(userLat, userLng)
                    .then(function (data) {
                        //display nearby coffee shops
                        data.response.forEach(function (place) {
                            var lat = place.location.lat;
                            var lng = place.location.lng;
                            var name = place.name;
                            var address = place.location.address;

                            // Add markers for coffee shops
                            var coffeeShopMarker = L.marker([lat, lng]).addTo(map);
                            coffeeShopMarker.bindPopup(name + "<br>" + address);
                        });
                    })
                    .catch(function (error) {
                        console.error("Error fetching nearby coffee shops:", error);
                    });
            }, function (error) {
                console.error("Error getting user location:", error);
            });
        } else {
            alert("Geolocation is not available in your browser.");
        }
    }

    // Call the function to get the users location and set the map view
    getUserLocation();

    async function placeSearch(userLat, userLng) {
        try {
            const searchParams = new URLSearchParams({
                query: 'coffee',
                ll: `${userLat},${userLng}`,
                open_now: 'false',
                sort: 'DISTANCE'
            });
            
            // CORS proxy URL
            const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
            
            //Foursquare API URL
            const foursquareUrl = "https://api.foursquare.com/v3/places/search?${searchParams}";
            
            const results = await fetch(
                corsProxyUrl + foursquareUrl,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'fsq3ci0ruJBDLJjjrt0Gs6k1QbXF760Tk8QqOAZ2MUiSq6c=', 
                    }
                }
            );
            const data = await results.json();
            console.log(data); 
            return data;
        } catch (err) {
            console.error("Error fetching nearby coffee shops:", err);
        }
    }
    
});




