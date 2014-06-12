window.AirDnd.Views.mapShow = Backbone.CompositeView.extend({
  // template: JST["map_show"],
  
  id: "map-canvas",

  initialize: function(options) {
    this.searchCoords = options.searchCoords;
    this.showView = options.showView;
    this.showView.searchCoords = this.searchCoords;
    var view = this;
    var searchParamCoords = {};

    var canvas = this.$el[0];
    this.model.map = new google.maps.Map(canvas, this.model.mapOptions);
    var map = this.model.map;
    this.map = map;
    google.maps.event.addListener(map, 'dragend', function() {
      // view.initialCenter = [map.center.k, map.center.A];
      searchParamCoords.latW = map.getBounds().Ba.k;
      searchParamCoords.longS = map.getBounds().qa.j;
      searchParamCoords.latE = map.getBounds().Ba.j;
      searchParamCoords.longN = map.getBounds().qa.k;
      view.showView.filterByLocation(searchParamCoords);
    });
    this.markers = [];
  },

  render: function() {

    this.removeMarkers();
    if (!jQuery.isEmptyObject(this.showView.markerLocations)) {
      this.makeMarkers();
    }
    var view = this;
    _.defer(function () {
      google.maps.event.trigger(view.map, 'resize');
    });
    return this;
  },

  makeMarkers: function() {
    console.log('make markers');
    console.log(this.showView.markerLocations);
    var view = this;
    
    _.each(this.showView.markerLocations, function(value, key) {
      var pos = new google.maps.LatLng(value[0], value[1]);
      var title = "campaign-" + key;
      var marker = new google.maps.Marker({
        map: view.map,
        position: pos,
        title: title
      });
      view.markers.push(marker);
      view.bindMarkerEvents(marker, key, view.map)
    });
  },

  updateMarkers: function() {
    this.removeMarkers();
    this.makeMarkers();
    this.render();
  },
  
  removeMarkers: function() {
    var newMarkers = [];//this.markers.slice(0);
    _.each(this.markers, function(marker) {
      window.m1 = marker;
      marker.setMap(null);
      //newMarkers.splice(newMarkers.indexOf(marker), 1)
    });
    this.markers = newMarkers;
  },

  bindMarkerEvents: function(marker, key, map) {
    console.log('bind marker events');
    var view = this;
    var elementSelector = '.campaign-preview-' + key;
    google.maps.event.addListener(marker, 'mouseover', function() {
      $('.search-results').animate({
        scrollTop: $(elementSelector).offset().top - $('.campaign-previews').offset().top
      }, 750);
      $(elementSelector).addClass('campaign-preview-glow');
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
      $(elementSelector).removeClass('campaign-preview-glow');
    });
    $(elementSelector).hover(function(){
      $(elementSelector).addClass('campaign-preview-glow');
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }, function(){
      $(elementSelector).removeClass('campaign-preview-glow');
      marker.setAnimation(null);
    });
  },

});
