var viewModel = {
  items: [ { Name: "Park Ave Penthouse" , Id: 0}, { Name: "Chelsea Loft" , Id: 1}, { Name: "Union Square Open Floor Plan" , Id: 2}, { Name: "East Village Hip Studio" , Id: 3}, { Name: "TriBeCa Artsy Bachelor Pad" , Id: 4}, { Name: "Chinatown Homey Space" , Id: 5} ]
};

viewModel.Query = ko.observable('');

viewModel.searchResults = ko.computed(function() {
    var q = viewModel.Query().toLowerCase();
    if(!q) {
    	return viewModel.items;
    } else {
    	    return viewModel.items.filter(function(i) {
		      return i.Name.toLowerCase().indexOf(q) != -1;
		    });
    }

});

ko.applyBindings(viewModel);

//menu controll
var menu = document.querySelector('#menu');
var map = document.querySelector('.map');
var drawer = document.querySelector('.filter');

menu.addEventListener('click', function(e) {
	drawer.classList.toggle('open');
	e.stopPropagation();
});
map.addEventListener('click', function() {
	drawer.classList.remove('open');
});


