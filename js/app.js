//define the map
var map;

// Create a new blank array for all the listing markers. create the Infowindow
var markers = [];
var largeInfowindow;

//cors anywhere
var corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
var yelpError = '<div id="yelp-content">The Yelp rating cannot be displayed right now.\nPlease try again later.</div>';

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
};


// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: '深圳 流塘阳光', location: {lat: 22.581396, lng: 113.889256}, Id: 0, type: 'house', ypid : ''},
  {title: '深圳 中粮锦云', location: {lat: 22.584436, lng: 113.886998}, Id: 1, type: 'house', ypid : ''},
  {title: '深圳 西城丰和家园', location: {lat: 22.585969597476446, lng: 113.87833871100531}, Id: 2, type: 'house', ypid : ''},
  {title: '深圳 雍和园', location: {lat: 22.587446, lng: 113.886689}, Id: 3, type: 'house', ypid : ''},
  {title: '深圳 泰华明珠', location: {lat: 22.581921, lng: 113.8829523}, Id: 4, type: 'house', ypid : ''},
  {title: '深圳 金海华府', location: {lat: 22.582552, lng: 113.8928995}, Id: 5, type: 'coffee', ypid : ''},
  {title: '深圳 中熙 香槟山花园', location: {lat: 22.594685, lng: 113.882703}, Id: 6, type: 'house', ypid : ''},
  {title: '深圳 地铁12号线 流塘站', location: {lat: 22.583520, lng: 113.889244}, Id: 7, type: 'subway', ypid : ''},
  {title: '深圳 地铁12号线 上川站', location: {lat: 22.575976, lng: 113.897464}, Id: 8, type: 'subway', ypid : ''},
  {title: '深圳 地铁12号线 宝安客运中心站', location: {lat: 22.5902229, lng: 113.8835803}, Id: 9, type: 'subway', ypid : ''},
  {title: '深圳 凤凰天誉', location: {lat: 22.595899, lng: 113.878355}, Id: 10, type: 'newhouse', ypid : ''},
  {title: '龍景軒-香港 Lung King Heen', location: {lat: 22.286636, lng: 114.156623}, Id: 11, type: 'chinese', ypid : '龍景軒-香港'},
  {title: '志魂-香港 Sushi Shikon', location: {lat: 22.285092, lng: 114.152089}, Id: 12, type: 'sushi', ypid : '志魂-香港'},
  {title: '唐閣-香港 Tang Court', location: {lat: 22.296392, lng: 114.169746}, Id: 13, type: 'chinese', ypid : '唐閣-香港'},
  {title: '廚魔-香港-2 Bo Innovation', location: {lat: 22.276227, lng: 114.171086}, Id: 14, type: 'bar', ypid : '廚魔-香港-2'},
  {title: '香港 LAtelier de Joël Robuchon', location: {lat: 22.2816084286963, lng: 114.157826442636}, Id: 15, type: 'french', ypid : 'l-atelier-de-joël-robuchon-香港-3'},
  {title: '香港 8 1/2 Otto e Mezzo BOMBANA', location: {lat: 22.281508, lng: 114.158365}, Id: 16, type: 'italian', ypid : '8-1-2-otto-e-mezzo-bombana-香港'},
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
  },
  french: {
    icon: iconBase + 'pal2/icon32.png'
  }, 
  italian: {
    icon: iconBase + 'pal2/icon63.png'
  },  
  chinese: {
    icon: iconBase + 'pal2/icon27.png'
  },
  sushi: {
    icon: iconBase + 'pal3/icon29.png'
  },
  bar: {
    icon: iconBase + 'pal2/icon19.png'
  },      
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

  	//控制menu的css
  	self.menuIsOpen = ko.observable(false);

  	//toggle menu显示的function
  	self.menuToggle = function() {
  		self.menuIsOpen(!self.menuIsOpen());
  	};

  	//关闭menu的function
  	self.menuClose = function() {
  		self.menuIsOpen(false);
  	};
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

		//Foursquare API 
		var clientId = 'QRDYBWLOQAW5XYCNVKDCU2KVUYBK3KECVCOS5RGCQODZAHPI'; 
		var clientSecret = 'EUOFJ3QL5T4T0Z1CEOOGDFPP21AD1VJRIWYTXCYDRD4RBMQV';

		//url to get request from foursquare data
		var requestURL = `https://api.foursquare.com/v2/venues/search?ll=${this.loc.lat},${this.loc.lng}&client_id=${clientId}&client_secret=${clientSecret}&v=20170801&query=${this.title}`;


		
		//function to add api content to data
		this.addFourSquareData = function(res) {
			console.log(res.response.venues[0]);
			pl.category = res.response.venues[0].categories.length === 1 ? res.response.venues[0].categories[0].name : 'N/A';
			pl.formattedPhone = res.response.venues[0].contact.formattedPhone ? res.response.venues[0].contact.formattedPhone : 'N/A';
			pl.id = res.response.venues[0].id;
			pl.title += res.response.venues[0].categories.length === 1 ? ` (${res.response.venues[0].categories[0].shortName})` : ` (no category from FourSquare)`;

			if(!res.response.venues[0]) {
				pl.infoContent += `<div>FourSquare: No data from FourSquare</div>`;
			} else {
				if(res.response.venues[0].url) {
					pl.infoContent += `<div>FourSquare Content: category: ${pl.category}/ phone: ${pl.formattedPhone} <a href=${res.response.venues[0].url}>${res.response.venues[0].url}</a> </div>`;
				} else {
					pl.infoContent += `<div>FourSquare: category: ${pl.category}/ phone: ${pl.formattedPhone} <a href="#">No FourSquare Url</a></div>`;
				}
	
			}

		};

		//fetch to get request to api
		fetch(requestURL).then(response => response.json()).then(pl.addFourSquareData).catch(function(e) {pl.infoContent+=`FourSquare Fetch error: ${e}`});

		//yelp api data
		var term = '';
		pl.ypid = data.ypid;
		var yelpUrl = 'https://cors-anywhere.herokuapp.com/' + 'https://api.yelp.com/v3/businesses/' + pl.ypid;
		var myYelpSecret = '6omr7-7C49v8GwsXDe0DdzfHcN1b6A1B4QBVaxjQOQaz-QiWeeeymAor8vKvw9Xgl6ulBXmOS08yE76nVKfu1HXupzlYjX3bOhyvXwR5HRg4-b5VqGKNQogAZD2nWnYx';
		var yelpInit = {       
			"async": true,
		  	"crossDomain": true,
		    "method": "GET",
		    "headers": {
		    	"authorization": "Bearer " + myYelpSecret,
		    	"cache-control": "no-cache" 
			}
		};

		this.addYelpData = function(res) {
			if(res.error) {
				pl.infoContent += `<div>Yelp Content: ${res.error.description}</div>`;
			} else {
				console.log(res);
				//用户自己的位置
				var venue = "22.584436,113.886998";
				pl.img = res.image_url;
				pl.reviewCount = res.review_count;
				pl.address = res.location.display_address[1];
				pl.city = res.location.city;
				pl.yelpUrl = res.url;
				pl.phoneNum = res.display_phone;
				pl.price = res.price;
				pl.rating = res.rating;
				pl.is_open_now = res.hours[0].is_open_now;
				pl.status = pl.is_open_now ? '营业中' : '商家休息';
				pl.infoContent += `<div id="yelpContent">
									<h3 id="placeName">${res.name}</h3>
									<img src="img/small_${pl.rating}.png"></img>
									<span>(${pl.reviewCount})</span>
									<img id="yelp-img" src=${pl.img}>
									<p id="contact" class="phone"><a href="tel: +${pl.phoneNum}">联系 ${pl.phoneNum}</a></p>
									<p id="address" class="address"><a href="https://www.google.com/maps/dir/${venue}/${pl.address}${pl.city}">导航到 ${pl.address}</a></p>
									<p id="price">价位：${pl.price} </p>
									<p id="status">营业状态： ${pl.status}<p>
									<p>Yelp 页面 <a href=${pl.yelpUrl}>传送门</a></p>
								   </div>`;
			}
			
		};

		fetch(yelpUrl,yelpInit).then(function(response) {
		  return response.json();
		})
		.then(pl.addYelpData).catch(function(e) {
			pl.infoContent += `<div>Yelp Content ${e}</div>`;
		});

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




//yelp search
// var term = "Lung King Heen ";
// var latitude = 22.3363232; 
// var longitude = 114.0153456;
// var myurl = 'https://cors-anywhere.herokuapp.com/' + 'https://api.yelp.com/v3/businesses/search?' + 'latitude=' + latitude + '&longitude=' + longitude + '&term=' + term;
// var myInit = {       
// 	"async": true,
//   	"crossDomain": true,
//     "method": "GET",
//     "headers": {
//     	"authorization": "Bearer " + '6omr7-7C49v8GwsXDe0DdzfHcN1b6A1B4QBVaxjQOQaz-QiWeeeymAor8vKvw9Xgl6ulBXmOS08yE76nVKfu1HXupzlYjX3bOhyvXwR5HRg4-b5VqGKNQogAZD2nWnYx',
//     	"cache-control": "no-cache" 
// 	}
// };
// fetch(myurl,myInit)
// .then(function(response) {
//   return response.json();
// })
// .then(function(res) {
//   console.log(res);
// });

