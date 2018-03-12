// global ko
// (function() {
	function viewModel() {
		var self = this;
		self.items = [ { Name: "Park Ave Penthouse" , Id: 0}, { Name: "Chelsea Loft" , Id: 1}, { Name: "Union Square Open Floor Plan" , Id: 2}, { Name: "East Village Hip Studio" , Id: 3}, { Name: "TriBeCa Artsy Bachelor Pad" , Id: 4}, { Name: "Chinatown Homey Space" , Id: 5} ];
		self.Query = ko.observable('');
	  	self.searchResults = ko.computed(function() {
		    var q = self.Query().toLowerCase();
		    if(!q) {
		    	return self.items;
		    } else {
		    	    return self.items.filter(function(i) {
				      return i.Name.toLowerCase().indexOf(q) != -1;
				    });
		    }

		});

	}


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


// })();

