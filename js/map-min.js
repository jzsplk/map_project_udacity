function initMap(){function e(){for(var e=new google.maps.LatLngBounds,n=myViewModel.searchResults().map(function(e){return e.title.toLowerCase()}),o=0;o<markers.length;o++)n.indexOf(markers[o].title.toLowerCase())>=0?(markers[o].setMap(map),e.extend(markers[o].position)):markers[o].setMap(null);map.fitBounds(e)}console.log("maps-API has been loaded, ready to use"),map=new google.maps.Map(document.getElementById("map"),{center:{lat:40.7413549,lng:-73.9980244},zoom:13}),largeInfowindow=new google.maps.InfoWindow;for(var n=new google.maps.LatLngBounds,o=2;o<locations.length;o++){var a=locations[o].location,t=locations[o].title,i=new google.maps.Marker({position:a,title:t,animation:google.maps.Animation.DROP,id:o});markers.push(i),i.addListener("click",function(){populateInfoWindow(this,largeInfowindow)})}e(),document.getElementById("search").addEventListener("keyup",e)}function toggleBounce(e){for(var n=2;n<markers.length;n++)e==markers[n].id?null!==markers[n].getAnimation()?(markers[n].setAnimation(null),largeInfowindow.close()):(markers[n].setAnimation(google.maps.Animation.BOUNCE),populateInfoWindow(markers[n],largeInfowindow)):markers[n].setAnimation(null)}function populateInfoWindow(e,n){n.marker!=e&&(n.marker=e,n.setContent("<div>"+e.title+"</div>"),n.open(map,e),n.addListener("closeclick",function(){n.setMarker=null}))}function addMarker(e){e.marker=new google.maps.Marker({position:e.loc,title:e.title,animation:google.maps.Animation.DROP,id:e.Id})}var map,markers=[],largeInfowindow;