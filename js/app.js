var viewModel = {
  items: [ { Name: "Park Ave Penthouse" , Id: 0}, { Name: "Chelsea Loft" , Id: 1}, { Name: "Union Square Open Floor Plan" , Id: 2}, { Name: "East Village Hip Studio" , Id: 3}, { Name: "TriBeCa Artsy Bachelor Pad" , Id: 4}, { Name: "Chinatown Homey Space" , Id: 5} ]
};

viewModel.Query = ko.observable('');

viewModel.searchResults = ko.computed(function() {
    var q = viewModel.Query();
    return viewModel.items.filter(function(i) {
      return i.Name.toLowerCase().indexOf(q) >= 0;
    });
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

//list toggle bounce
var list0 = document.getElementById('foo0');
var list1 = document.getElementById('foo1');
var list2 = document.getElementById('foo2');
var list3 = document.getElementById('foo3');
var list4 = document.getElementById('foo4');
var list5 = document.getElementById('foo5');

function addBounceListener() {
	list0.addEventListener('click', function() {
		toggleBounce(0);
	});

	list1.addEventListener('click', function() {
		toggleBounce(1);
	});

	list2.addEventListener('click', function() {
		toggleBounce(2);
	});

	list3.addEventListener('click', function() {
		toggleBounce(3);
	});

	list4.addEventListener('click', function() {
		toggleBounce(4);
	});

	list5.addEventListener('click', function() {
		toggleBounce(5);
	});

}
