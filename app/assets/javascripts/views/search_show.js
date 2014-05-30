window.AirDnd.Views.searchShow = Backbone.CompositeView.extend({
  template: JST["search/show"],

  className: "search-show",

  initialize: function(options) {
    this.count = 0;
    console.log('initial');
    var view = this;
    this.resizeContent();
    this.markerLocations = {};
    this.listenTo(this.collection, "all", this.render);
    this.listenTo(this.collection, "add", this.addCampaignPreview);
    this.unparsedParams = options.searchParams;
    this.searchParams = this.parseParams(options.searchParams);
    if (_.isEmpty(this.searchParams)) {
      campaigns = this.collection;
    } else {
      campaigns = this.filterResults(this.searchParams, this.collection);
    }
    campaigns.each(this.addCampaignPreview.bind(this));
    this.initialSearchLocation = options.searchParams.location;
    // delete options.searchParams['location'];
    this.searchParamCoords = {};
    // this.initializeMap([37.757444, -122.447016]);
  },

  render: function() {
    console.log('render');
    var view = this;
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;

    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers,
      searchParams: this.unparsedParams,
    });

    this.$el.html(renderedContent);
    this.renderSubviews();
    this.delegateEvents();
    // var input = this.$el.find('#pac-input');
    // input = input[0];
    // var options = { types: ['geocode'] };
    // var autocomplete = new google.maps.places.Autocomplete(input, options);
    // var searchBox = new google.maps.places.SearchBox(input);
    var initialSearchLocation = this.initialSearchLocation;
    // var searchCoords = this.searchCoords;
    if (!initialSearchLocation) {
      view.initializeMap([37.757444, -122.447016]);
    } else {
      if (this.searchCoords) {
        view.initializeMap(this.searchCoords);
      } else {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': initialSearchLocation}, function(results, status) {
          var searchCoords = [results[0].geometry.location.k, results[0].geometry.location.A];
          view.searchCoords = searchCoords;
          view.initializeMap(searchCoords);
        });
      }
    }
    this.markerLocations = {};
    // $('.location').keyup(function() {view.filterByLocation()});
    $('#style').change(function() {view.filterByChange()});
    $('#system').change(function() {view.filterByChange()});
    $('#setting').change(function() {view.filterByChange()});
    $('#players').change(function() {view.filterByChange()});
    return this;
  },

  filterByLocation: function (coords) {
    console.log('filter by location');
    var view = this;
    this.removeAllSubviews();
      var campaigns = this.collection.filter(function(campaign) {
      var campLat = campaign.get('latitude');
      var campLong = campaign.get('longitude');
      return ((campLat > coords.latW && campLat < coords.latE) && (campLong > coords.longS && campLong < coords.longN));
    });
    var newCampaignCollection = new AirDnd.Collections.Campaigns(campaigns);
    var filteredCampaignCollection = this.filterResults(this.searchParams, newCampaignCollection);
    filteredCampaignCollection.each(this.addCampaignPreview.bind(this));
    var view = this;
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;

    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers,
      searchParams: this.unparsedParams,
    });

    this.$el.html(renderedContent);
    this.renderSubviews();
    console.log('omg');
    console.log(this.searchCoords);
    var searchCoords = this.searchCoords;
    console.log(searchCoords);
    var map;
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(searchCoords[0], searchCoords[1])
    };
    var canvas = this.$el.find('#map-canvas')[0];
    map = new google.maps.Map(canvas, mapOptions);
    this.addListeners(map);
    this.makeMarkers();
    this.initialSearchLocation = searchCoords;
    this.render();
    // var searchLocation = event.currentTarget.value;
    // this.unparsedParams['location'] = searchLocation;
    // this.searchParams = this.parseParams(this.unparsedParams);
    // if (_.isEmpty(this.searchParams)) {
    //   campaigns = this.collection;
    // } else {
    //   campaigns = this.filterResults(this.searchParams, this.collection);
    // }
    // $('.location').focus().val(searchLocation);
  },

  filterByChange: function () {
    var newSearchVal = event.currentTarget.value;
    var newSearchSubject = event.currentTarget.name;
    this.removeAllSubviews();
    this.unparsedParams[newSearchSubject] = newSearchVal;
    this.searchParams = this.parseParams(this.unparsedParams);
    if (_.isEmpty(this.searchParams)) {
      campaigns = this.collection;
    } else {
      campaigns = this.filterResults(this.searchParams, this.collection);
    }
    console.log('filter by change');
    campaigns.each(this.addCampaignPreview.bind(this));
    this.render();
  },

  addCampaignPreview: function(campaign) {
    console.log('add campaign preview');

    var campaignID = campaign.id;
    this.markerLocations[campaignID] = [parseFloat(campaign.get('latitude')), parseFloat(campaign.get('longitude'))];
    var campaignPreview = new AirDnd.Views.campaignPreview({
      model: campaign,
    });
    this.addSubview(".campaign-previews", campaignPreview);
    campaignPreview.render();
  },

  filterResults: function(params, campaigns) {
    console.log('filter results');
    if (_.keys(params).length === 0) {
      return campaigns;
    }
    else if (_.keys(params).length > 0) {
      var newCollection = new AirDnd.Collections.Campaigns();
      campaigns = campaigns.where(params[0]);
      newCollection.add(campaigns);
      return this.filterResults(params.slice(1), newCollection);
    }
  },

  parseParams: function(params) {
    console.log('parse params');
    var parsedParams = [];
    $.each(params, function(index, value) {
      var tempObj = {};
      if (index === "num_members"){
        tempObj[index] = parseInt(value);
        parsedParams.push(tempObj);
      } else if (value === "") {
      } else {
        tempObj[index]= value;
        parsedParams.push(tempObj);
      }
    });
    return parsedParams;
  },


  initializeMap: function(searchCoords) {
    console.log(searchCoords);
    console.log('lol');
    var view = this;
    var map;
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(searchCoords[0], searchCoords[1])
    };
    var canvas = this.$el.find('#map-canvas')[0];
    map = new google.maps.Map(canvas, mapOptions);
    this.mapObject = map;
    this.searchCoords = searchCoords;
    var searchParamCoords = {};

    google.maps.event.addListener(map, 'dragend', function() {
      view.searchCoords = [map.center.k, map.center.A];
      console.log(this.searchCoords);
      searchParamCoords.latW = map.getBounds().Ba.k;
      searchParamCoords.longS = map.getBounds().ra.j;
      searchParamCoords.latE = map.getBounds().Ba.j;
      searchParamCoords.longN = map.getBounds().ra.k;
      view.filterByLocation(searchParamCoords);
    });
    debugger 
    if (this.count === 0 && map.getBounds()) {
      console.log(this.count);
      this.count ++;
      view.searchCoords = [map.center.k, map.center.A];
      google.maps.event.addListener(map, 'idle', function() {
        searchParamCoords.latW = map.getBounds().Ba.k;
        searchParamCoords.longS = map.getBounds().ra.j;
        searchParamCoords.latE = map.getBounds().Ba.j;
        searchParamCoords.longN = map.getBounds().ra.k;
        view.filterByLocation(searchParamCoords);
      });
    }

    // this.makeMarkers();
    _.each(this.markerLocations, function(value, key) {
      var pos = new google.maps.LatLng(value[0], value[1]);
      var title = "campaign-" + key;
      var marker = new google.maps.Marker({
        map: map,
        position: pos,
        title: title
      });
      view.bindMarkerEvents(marker, key, map);
    });
  },

  addListeners: function(map) {
    var view = this;
    if (this.count === 0 && map.getBounds()) {
      console.log(this.count);
      this.count ++;
      view.searchCoords = [map.center.k, map.center.A];
      google.maps.event.addListener(map, 'dragend', function() {
        searchParamCoords.latW = map.getBounds().Ba.k;
        searchParamCoords.longS = map.getBounds().ra.j;
        searchParamCoords.latE = map.getBounds().Ba.j;
        searchParamCoords.longN = map.getBounds().ra.k;
        view.filterByLocation(searchParamCoords);
      });
    }
  },

  makeMarkers: function() {
    console.log('make markers');
    var view = this;
    _.each(this.markerLocations, function(value, key) {
      var pos = new google.maps.LatLng(value[0], value[1]);
      var title = "campaign-" + key;
      var marker = new google.maps.Marker({
        map: view.mapObject,
        position: pos,
        title: title
      });
      view.bindMarkerEvents(marker, key, view.mapObject)
    });
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

  resizeContent: function() {
    var newHeight = window.innerHeight - 50;
    $('#content').css({height: newHeight + "px"})
  },


});
