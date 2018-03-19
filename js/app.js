//define the map
var map;

// Create a new blank array for all the listing markers. create the Infowindow
var markers = [];
var largeInfowindow;

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

//弹出信息框函数，populateInfoWindow
function populateInfoWindow(marker, infowindow) {
  	// Check to make sure the infowindow is not already opened on this marker.
  	if (infowindow.marker != marker) {
    	infowindow.marker = marker;
    	infowindow.setContent('<div>' + myViewModel.places()[marker.id].title + ' '+ myViewModel.places()[marker.id].infoContent + '</div>');
    	infowindow.open(map, marker);
    	// Make sure the marker property is cleared if the infowindow is closed.
    	infowindow.addListener('closeclick',function(){
      		infowindow.setMarker = null;
    	});
  	} else {
  	    infowindow.setContent('<div>' + myViewModel.places()[marker.id].title + ' '+ myViewModel.places()[marker.id].infoContent + '</div>');
    	infowindow.open(map, marker);
    	// Make sure the marker property is cleared if the infowindow is closed.
    	infowindow.addListener('closeclick',function(){
      		infowindow.setMarker = null;
    	});
  	}
}


// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: '流塘阳光', location: {lat: 22.581396, lng: 113.889256}, Id: 0, type: 'house'},
  {title: '中粮锦云', location: {lat: 22.584436, lng: 113.886998}, Id: 1, type: 'house'},
  {title: '西城丰和家园', location: {lat: 22.585969597476446, lng: 113.87833871100531}, Id: 2, type: 'house'},
  {title: '雍和园', location: {lat: 22.587446, lng: 113.886689}, Id: 3, type: 'house'},
  {title: '泰华明珠', location: {lat: 22.581921, lng: 113.8829523}, Id: 4, type: 'house'},
  {title: '金海华府', location: {lat: 22.582552, lng: 113.8928995}, Id: 5, type: 'coffee'},
  {title: '中熙 香槟山花园', location: {lat: 22.594685, lng: 113.882703}, Id: 6, type: 'house'},
  {title: '地铁12号线 流塘站', location: {lat: 22.583520, lng: 113.889244}, Id: 7, type: 'subway'},
  {title: '地铁12号线 上川站', location: {lat: 22.575976, lng: 113.897464}, Id: 8, type: 'subway'},
  {title: '地铁12号线 宝安客运中心站', location: {lat: 22.5902229, lng: 113.8835803}, Id: 9, type: 'subway'},
  {title: '凤凰天誉', location: {lat: 22.595899, lng: 113.878355}, Id: 10, type: 'newhouse'}
];

//自定义icon for google map
var iconBase = 'http://maps.google.com/mapfiles/kml/';
var icons = {
  house: {
    icon: iconBase + 'pal3/icon56.png'
  },
  newhouse: {
    icon: iconBase + 'pal3/icon21.png'
  },  
  subway: {
    icon: iconBase + 'pal5/icon15.png'
  },
  coffee: {
    icon: iconBase + 'pal2/icon62.png'
  }
};

//viewModel for the app
function viewModel() {
	var self = this;

	//places为经过fetch网络数据的地点data，searchResults为搜索筛选之后的data
	self.places = ko.observableArray([]);
	// self.filteredPlaces = ko.observableArray([]);
	
  	self.searchResults = ko.pureComputed(function() {
	    var query = self.Query().toLowerCase();
	    if(!self.Query() && (self.places().length === 0) ) {
	    	return locations;
	    } else {
	    	return ko.utils.arrayFilter(self.places(), function(place) {
	    		return place.title.toLowerCase().indexOf(query) != -1;
	    	});
	    }
	});	
	//搜索关键词
  	self.Query = ko.observable('');

	// console.log(self.searchResults());

	//init map 初始化googlemap函数
	self.initMap = function() {
		map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 22.5838528, lng: 113.8870562},
		zoom: 13
		});
	};

	//create places with locations data.从locations建立places的函数
	self.createPlaces = function() {
		locations.forEach(function(loc) {
			self.places().push(new Place(loc));
		});
	};

    // This function will loop through the markers array and display them all.
    //根据搜索内容来选择显示符合的marker
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

    //markerclick function，点击marker出发动画以及弹出窗口的函数，点击toggle效果
    self.markerClick = function(place) {
    	if(place.marker().getAnimation() !== null) {
    		place.marker().setAnimation(null);
    		largeInfowindow.close();
    	} else {
    		place.marker().setAnimation(google.maps.Animation.BOUNCE);
    		populateInfoWindow(place.marker(), largeInfowindow);
    	}
    };

    //把点击marker的函数添加到marker上
    self.addMarkerLiscener = function() {
    	self.places().forEach(function(place) {
    		place.marker().addListener('click', function() {
    			self.markerClick(place);
    		});
		});
    };

	//（暂时未使用）toogleBounce的功能,切换marker的动画效果，目前实际使用的是全局定义的toggleBounce函数
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

	//（未实际使用）populateInfoWindow
	self.populateInfoWindow = function(marker, infowindow) {
	  // Check to make sure the infowindow is not already opened on this marker.
	  if (infowindow.marker != marker) {
	    infowindow.marker = marker;
	    infowindow.setContent('<div>' + myViewModel.places()[marker.id].title + ' '+ myViewModel.places()[marker.id].infoContent + '</div>');
	    infowindow.open(map, marker);
	    // Make sure the marker property is cleared if the infowindow is closed.
	    infowindow.addListener('closeclick',function(){
	      infowindow.setMarker = null;
	    });
	  }
	};

	//google load function,every function using Google api,之前出现google map undefined 现象，目前采用这种方式解决
	googleLoad = function() {
		largeInfowindow = new google.maps.InfoWindow();
    	var bounds = new google.maps.LatLngBounds(); 
    	self.initMap();
    	self.createPlaces();
		self.showMarker();
    	self.addMarkerLiscener();
    	document.getElementById('search').addEventListener('keyup', self.showMarker);
	};

	googleError = function() {
		console.log('error loading Google Maps. Please check you interenent connenction.');
	};

	//Place model ，地点的类
	var Place = function(data) {
		//save this of Place as pl
		var pl = this;
		var marker;

		this.title = data.title;
		this.loc = data.location;
		this.type = data.type;
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
			if(!res.response.venues[0]) {
				pl.infoContent += `<div>FourSquare: No data from FourSquare</div>`;
			} else {
				pl.category = res.response.venues[0].categories.length === 1 ? res.response.venues[0].categories[0].name : 'N/A';
				pl.formattedPhone = res.response.venues[0].contact.formattedPhone ? res.response.venues[0].contact.formattedPhone : 'N/A';
				pl.infoContent += `<div>FourSquare: category: ${pl.category}/ phone: ${pl.formattedPhone}</div>`;
				pl.id = res.response.venues[0].id;
				pl.title += res.response.venues[0].categories.length === 1 ? ` (${res.response.venues[0].categories[0].shortName})` : ` (no category from FourSquare)`;
			}

		};

		//fetch to get request to api
		fetch(requestURL).then(response => response.json()).then(pl.addData).catch(function(e) {pl.infoContent+=`FourSquare Fetch error: ${e}`});

		
		//make a marker from the location
		marker = new google.maps.Marker({
	        position: pl.loc,
	        title: pl.title,
	        animation: google.maps.Animation.DROP,
	        id: pl.Id,
	        icon: icons[pl.type].icon
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





