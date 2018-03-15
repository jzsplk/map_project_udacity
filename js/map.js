//define the map
var map;

// Create a new blank array for all the listing markers. create the Infowindow
var markers = [];
var largeInfowindow;
function initMap() {
	console.log('maps-API has been loaded, ready to use');
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 40.7413549, lng: -73.9980244},
	  zoom: 13
	});

    largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds(); 
    
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 2; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });

    }

	// This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    // function populateInfoWindow(marker, infowindow) {
    //   // Check to make sure the infowindow is not already opened on this marker.
    //   if (infowindow.marker != marker) {
    //     infowindow.marker = marker;
    //     infowindow.setContent('<div>' + marker.title + '</div>');
    //     infowindow.open(map, marker);
    //     // Make sure the marker property is cleared if the infowindow is closed.
    //     infowindow.addListener('closeclick',function(){
    //       infowindow.setMarker = null;
    //     });
    //   }
    // }

    // This function will loop through the markers array and display them all.
    function showListings() {
      var bounds = new google.maps.LatLngBounds();
      var mapSearchResults = myViewModel.searchResults().map(function(e) {
      	return e.title.toLowerCase();
      });
      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers.length; i++) {
      	if(mapSearchResults.indexOf(markers[i].title.toLowerCase()) >= 0) {
	        markers[i].setMap(map);
        	bounds.extend(markers[i].position);
      	} else {
      		markers[i].setMap(null);
      	}

      }
      map.fitBounds(bounds);
    }

    showListings();
    document.getElementById('search').addEventListener('keyup', showListings);


};

//toogleBounce的功能,切换marker的动画效果
function toggleBounce(id) {
	for(var i = 2; i < markers.length; i++) {
		if(id == markers[i].id) {
			if(markers[i].getAnimation() !== null) {
				markers[i].setAnimation(null);
				largeInfowindow.close();
			} else {
				markers[i].setAnimation(google.maps.Animation.BOUNCE);
				populateInfoWindow(markers[i], largeInfowindow);
			}
			
		} else {
			markers[i].setAnimation(null);
		}
	}
}

//populateInfoWindow
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

//function to add marker to place
function addMarker(geo) {
	geo.marker = new google.maps.Marker({
        position: geo.loc,
        title: geo.title,
        animation: google.maps.Animation.DROP,
        id: geo.Id
      });
}
	
