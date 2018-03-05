var viewModel = {
  items: [ { Name: "Apple part" }, { Name: "Apple sauce" }, { Name: "Apple juice" }, { Name: "Pear juice" }, { Name: "Pear mush" }, { Name: "Something different" } ]
};

viewModel.Query = ko.observable('');

viewModel.searchResults = ko.computed(function() {
    var q = viewModel.Query();
    return viewModel.items.filter(function(i) {
      return i.Name.toLowerCase().indexOf(q) >= 0;
    });
});

ko.applyBindings(viewModel);

