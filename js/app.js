//define the map
var map;

// Create a new blank array for all the listing markers. create the Infowindow
var markers = [];
var largeInfowindow;

// function initMap() {
// 	// Constructor creates a new map - only center and zoom are required.
// 	map = new google.maps.Map(document.getElementById('map'), {
// 	  center: {lat: 22.5838528, lng: 113.8870562},
// 	  zoom: 13
// 	});

//     largeInfowindow = new google.maps.InfoWindow();
//     var bounds = new google.maps.LatLngBounds(); 

// //     var marker1 = new google.maps.Marker({
// // 	position: locations[0].location,
// // 	title: locations[0].title,
// // 	animation: google.maps.Animation.DROP
// // });
    
//     // The following group uses the location array to create an array of markers on initialize.
//     for (var i = 0; i < myViewModel.places.length; i++) {
//       // Get the position from the location array.
//       var position = myViewModel.places[i].loc;
//       var title = myViewModel.places[i].title;
//       var id = myViewModel.places[i].id;
//       console.log(myViewModel.places[i]);
//       // Create a marker per location, and put into markers array.
//       var marker = new google.maps.Marker({
//         position: position,
//         title: title,
//         animation: google.maps.Animation.DROP,
//         id: i
//       });
//       console.log(marker.id);
//       // Push the marker to our array of markers.
//       markers.push(marker);
//       // Create an onclick event to open an infowindow at each marker.
//       marker.addListener('click', function() {
//         populateInfoWindow(this, largeInfowindow);
//       });

//     };

//     // This function will loop through the markers array and display them all.
//     function showListings() {
//       var bounds = new google.maps.LatLngBounds();
//       var mapSearchResults = myViewModel.searchResults().map(function(e) {
//       	return e.title.toLowerCase();
//       });
//       // Extend the boundaries of the map for each marker and display the marker
//       for (var i = 0; i < markers.length; i++) {
//       	if(mapSearchResults.indexOf(markers[i].title.toLowerCase()) >= 0) {
// 	        markers[i].setMap(map);
//         	bounds.extend(markers[i].position);
//       	} else {
//       		markers[i].setMap(null);
//       	}
//       }
//       map.fitBounds(bounds);
//     }

//     showListings();
//     document.getElementById('search').addEventListener('keyup', showListings);
// };

//toogleBounce的功能,切换marker的动画效果
function toggleBounce(id) {
	for(var i = 0; i < markers.length; i++) {
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
    infowindow.setContent('<div>' + myViewModel.places[marker.id].title + ' '+ myViewModel.places[marker.id].infoContent + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}

// //function to add marker to place
// function addMarker(geo) {
// 	geo.marker = new google.maps.Marker({
//         position: geo.loc,
//         title: geo.title,
//         animation: google.maps.Animation.DROP,
//         id: geo.Id
//       });
// }


// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: '流塘阳光', location: {lat: 22.5838528, lng: 113.8870562}, Id: 0},
  {title: '中粮锦云', location: {lat: 22.584436, lng: 113.886998}, Id: 1},
  {title: '西城丰和家园', location: {lat: 22.585969597476446, lng: 113.87833871100531}, Id: 2},
  {title: '雍和园', location: {lat: 22.587564, lng: 113.8844623}, Id: 3},
  {title: '泰华明珠', location: {lat: 22.581921, lng: 113.8829523}, Id: 4},
  {title: '金海华府', location: {lat: 22.582552, lng: 113.8928995}, Id: 5}
];





function viewModel() {
	var self = this;

	self.places = ko.observableArray([]);
	self.Query = ko.observable('');
  	self.searchResults = ko.computed(function() {
	    var q = self.Query().toLowerCase();
	    // if(q == null) {
	    // 	console.log(self.places());
	    // 	return self.places();
	    // } else {
	    // 	    return self.places().filter(function(i) {
			  //     return i.title.toLowerCase().indexOf(q) != -1;
			  //   });
	    // }
	    return self.places().filter(function(i) {
			      return i.title.toLowerCase().indexOf(q) != -1;
			    });
	});
	console.log(self.searchResults());

	//init map
	self.initMap = function() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 22.5838528, lng: 113.8870562},
		zoom: 13
		});
	};

	//create places with locations data.
	self.createPlaces = function() {
		locations.forEach(function(loc) {
			self.places().push(new Place(loc));
		});
	};

    // This function will loop through the markers array and display them all.
    self.showMarker = function() {
      var bounds = new google.maps.LatLngBounds();
 	  var q = self.Query().toLowerCase();

      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < self.places().length; i++) {
      	var placeTitle = self.places()[i].title.toLowerCase();
      	var placeCategory = self.places()[i].category.toLowerCase();
      	if(placeTitle.indexOf(q) > -1 || placeCategory.indexOf(q) > -1) {

	        self.places()[i].marker().setMap(map);
        	bounds.extend(markers[i].position);
      	} else {
      		self.places()[i].marker().setMap(null);
      	}
      }
      map.fitBounds(bounds);
    };

    //creatlisenter 

    //markerclick function
    self.markerClick = function(place) {
    	if(place.marker().getAnimation() !== null) {
    		place.marker().setAnimation(null);
    		largeInfowindow.close();
    	} else {
    		place.marker().setAnimation(google.maps.Animation.BOUNCE);
    		self.populateInfoWindow(place.marker(), largeInfowindow);
    	}
    };

    self.addMarkerLiscener = function() {
    	self.places().forEach(function(place) {
    		place.marker().addListener('click', function() {
    			self.markerClick(place);
    		});
		});
    };
	//toogleBounce的功能,切换marker的动画效果
	self.toggleBounce =function(id) {
		for(var i = 0; i < markers.length; i++) {
			if(id == markers[i].id) {
				if(markers[i].getAnimation() !== null) {
					markers[i].setAnimation(null);
					largeInfowindow.close();
				} else {
					markers[i].setAnimation(google.maps.Animation.BOUNCE);
					self.populateInfoWindow(markers[i], largeInfowindow);
				}
				
			} else {
				markers[i].setAnimation(null);
			}
		}
	};

	//populateInfoWindow
	self.populateInfoWindow = function(marker, infowindow) {
	  // Check to make sure the infowindow is not already opened on this marker.
	  if (infowindow.marker != marker) {
	    infowindow.marker = marker;
	    infowindow.setContent('<div>' + myViewModel.places()[marker.id].title + ' '+ myViewModel.places[marker.id].infoContent + '</div>');
	    infowindow.open(map, marker);
	    // Make sure the marker property is cleared if the infowindow is closed.
	    infowindow.addListener('closeclick',function(){
	      infowindow.setMarker = null;
	    });
	  }
	}

	//google load function,every function using Google api
	googleLoad = function() {
		largeInfowindow = new google.maps.InfoWindow();
    	var bounds = new google.maps.LatLngBounds(); 
    	self.initMap();
    	self.createPlaces();
		console.log(self.places());
		self.showMarker();
    	self.addMarkerLiscener();
    	document.getElementById('search').addEventListener('keyup', self.showMarker);

	};

	googleError = function() {
		console.log('error loading Google Maps. Please check you interenent connenction.');
	};

	//Place model
	var Place = function(data) {
		var pl = this;
		var marker;

		this.title = data.title;
		this.loc = data.location;
		this.Id = data.Id;
		this.category = '';
		this.formattedPhone = '';
		this.infoContent = '';
		this.id = '';

		var clientId = 'QRDYBWLOQAW5XYCNVKDCU2KVUYBK3KECVCOS5RGCQODZAHPI'; 
		var clientSecret = 'EUOFJ3QL5T4T0Z1CEOOGDFPP21AD1VJRIWYTXCYDRD4RBMQV';

		//url to get request from foursquare data
		var requestURL = `https://api.foursquare.com/v2/venues/search?ll=${this.loc.lat},${this.loc.lng}&client_id=${clientId}&client_secret=${clientSecret}&v=20170801&query=${this.title}`;

		//function to add api content to data
		this.addData = function(res) {
			console.log(res.response.venues[0]);
			pl.category = res.response.venues[0].categories ? res.response.venues[0].categories[0].name : 'N/A';
			pl.formattedPhone = res.response.venues[0].contact.formattedPhone ? res.response.venues[0].contact.formattedPhone : 'N/A';
			pl.infoContent += `<div>FourSquare: category: ${pl.category}/ phone: ${pl.formattedPhone}</div>`;
			pl.id = res.response.venues[0].id;
			pl.title += res.response.venues[0].categories[0].name;

		};

		//fetch to get request to api
		fetch(requestURL).then(response => response.json()).then(pl.addData).catch(function(e) {pl.infoContent+=`${e}`});

		
		//make a marker from the location
		marker = new google.maps.Marker({
	        position: pl.loc,
	        title: pl.title,
	        animation: google.maps.Animation.DROP,
	        id: pl.Id
	      });

		markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        // marker.addListener('click', self.markerClick(pl));
		pl.marker = ko.observable(marker);
	};


};


var myViewModel = new viewModel();

ko.applyBindings(myViewModel);

//menu controll
var menu = document.querySelector('#menu');
var map = document.querySelector('.map');
var drawer = document.querySelector('.filter');
var search = document.querySelector('.form-control');

menu.addEventListener('click', function(e) {
	drawer.classList.toggle('open');
	search.classList.toggle('open');
	e.stopPropagation();
});
map.addEventListener('click', function() {
	drawer.classList.remove('open');
	search.classList.remove('open');
});





