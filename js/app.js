var viewModel = {
  items: [ { Name: "Park Ave Penthouse" }, { Name: "Chelsea Loft" }, { Name: "Union Square Open Floor Plan" }, { Name: "East Village Hip Studio" }, { Name: "TriBeCa Artsy Bachelor Pad" }, { Name: "Chinatown Homey Space" } ]
};

viewModel.Query = ko.observable('');

viewModel.searchResults = ko.computed(function() {
    var q = viewModel.Query();
    return viewModel.items.filter(function(i) {
      return i.Name.toLowerCase().indexOf(q) >= 0;
    });
});

ko.applyBindings(viewModel);

