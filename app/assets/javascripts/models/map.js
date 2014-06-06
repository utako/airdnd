window.AirDnd.Models.Map = Backbone.Model.extend({
  
  initialize: function (options) {
    this.searchCoords = options.searchCoords || [37.7833, -122.4167];
    this.mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(this.searchCoords[0], this.searchCoords[1])
    }    
  },
  
})