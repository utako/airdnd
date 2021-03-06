window.AirDnd.Views.searchShow = Backbone.CompositeView.extend({
  template: JST["search/show"],

  className: "search-show",

  initialize: function(options) {
    var view = this;
    this.resizeContent();
    this.markerLocations = {};
    this.listenTo(this.collection, "all", this.render);
    this.unparsedParams = options.searchParams;
    this.searchParams = this.parseParams(options.searchParams);
    if (_.isEmpty(this.searchParams)) {
      campaigns = this.collection;
    } else {
      campaigns = this.filterResults(this.searchParams, this.collection);
    }
    this.removeSubviewsForSelector('.campaign-previews');
    if (typeof options.searchParams.location !== 'undefined') {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({address: options.searchParams.location}, function(results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
           view.initialSearchCoords = {};
           var southWest = results[0].geometry.viewport.getSouthWest();
           var northEast = results[0].geometry.viewport.getNorthEast();
           view.initialSearchCoords.latW = southWest.lat();
           view.initialSearchCoords.longS = southWest.lng();
           view.initialSearchCoords.latE = northEast.lat();
           view.initialSearchCoords.longN = northEast.lng();
           view.initialCenter = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];   
         }
      });
    } else {      
      this.initialCenter = [37.7833, -122.4167];
      this.initialSearchCoords = {latW: 37.6933354, longS: -123.10777330000002, latE: 37.9297707, longN: -122.3279149};
    }
    this.searchParamCoords = {};
    this.listenTo(this.collection, "sync", (function() {
      this.addMapShow(this.initialCenter)
    }).bind(this));
    this.listenTo(this.collection, "sync", (function(collection) { collection.models.forEach(function(campaign) {this.addCampaignPreview})}));
    this.addFilters();
  },

  render: function() {
    var view = this;
    var renderedContent = this.template({});
    this.$el.html(renderedContent);
    this.renderSubviews();
    this.delegateEvents();

    $('#style').change(function() {view.filterByChange()});
    $('#system').change(function() {view.filterByChange()});
    $('#setting').change(function() {view.filterByChange()});
    $('#players').change(function() {view.filterByChange()});
    return this;
  },

  filterByLocation: function (coords) {
    
    var view = this;
    this.removeSubviewsForSelector('.campaign-previews');
    var campaigns = this.collection.filter(function(campaign) {
      var campLat = campaign.get('latitude');
      var campLong = campaign.get('longitude');
      return ((campLat > coords.latW && campLat < coords.latE) && (campLong > coords.longS && campLong < coords.longN));
    });
    var newCampaignCollection = new AirDnd.Collections.Campaigns(campaigns);
    var filteredCampaignCollection = this.filterResults(this.searchParams, newCampaignCollection);
    filteredCampaignCollection.each(this.addCampaignPreview.bind(this));
    var newCenter = [(coords.latW + coords.latE)/2, (coords.longS + coords.longN)/2];
    this.searchCoords = newCenter;
    if (typeof this.mapShow !== 'undefined') {
      this.mapShow.updateMarkers();
    }
  },
  
  addFilters: function() {
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;
    var filtersShow = new AirDnd.Views.filtersShow({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers,
      collection: this.collection,
      searchParams: this.searchParams
    })
    this.addSubview(".form-group", filtersShow);
    filtersShow.render();
  },
  
  addCampaignPreview: function(campaign) {
    var campaignID = campaign.id;
    this.markerLocations[campaignID] = [parseFloat(campaign.get('latitude')), parseFloat(campaign.get('longitude'))];
    var campaignPreview = new AirDnd.Views.campaignPreview({
      model: campaign,
    });
    this.addSubview(".campaign-previews", campaignPreview);
    campaignPreview.render();
  },
  
  addMapShow: function(searchCoords) {
    this.removeSubviewsForSelector('.campaign-previews');
    this.filterByLocation(this.initialSearchCoords);
    var map = new AirDnd.Models.Map({searchCoords: searchCoords});
    this.map = map;
    var mapShow = new AirDnd.Views.mapShow({
      model: map,
      searchCoords: searchCoords,
      showView: this
    });
    this.mapShow = mapShow;
    this.addSubview('.search-map', mapShow);    
    mapShow.render();
  },
  
  filterByChange: function () {
    this.markerLocations = {};
    var newSearchVal = event.currentTarget.value;
    var newSearchSubject = event.currentTarget.name;
    this.removeSubviewsForSelector('.campaign-previews');
    this.unparsedParams[newSearchSubject] = newSearchVal;
    this.searchParams = this.parseParams(this.unparsedParams);
    var searchParamCoords = {};
    var southWest = this.mapShow.model.map.getBounds().getSouthWest();
    var northEast = this.mapShow.model.map.getBounds().getNorthEast();
    searchParamCoords.latW = southWest.lat();
    searchParamCoords.longS = southWest.lng();
    searchParamCoords.latE = northEast.lat();
    searchParamCoords.longN = northEast.lng();
    var campaigns = this.filterByLocation(searchParamCoords);
    if (_.isEmpty(this.searchParams)) {
      campaigns = campaigns;
    } else {
      campaigns = this.filterResults(this.searchParams, campaigns);
    }
    typeof campaigns !== 'undefined' && campaigns.each(this.addCampaignPreview.bind(this));
    window.mapShow = this.mapShow;
    if (typeof this.mapShow !== 'undefined') {
      this.mapShow.updateMarkers();
    }
  },

  filterResults: function(params, campaigns) {
    params.forEach(function(param) {
      if (typeof param.location !== 'undefined') {
        params.splice(params.indexOf(param), 1)
      }
    });
    if (_.keys(params).length === 0) {
      return campaigns;
    }
    else if (typeof campaigns !== 'undefined' && _.keys(params).length > 0) {
      var newCollection = new AirDnd.Collections.Campaigns();
      if (_.keys(params[0])[0] === "num_members" && params[0].num_members === 16) {
        campaigns = campaigns.filter(function(campaign) {
          return (campaign.get('num_members') > 15);
        });
      } else {
        campaigns = campaigns.where(params[0]);
      }
      newCollection.add(campaigns);
      return this.filterResults(params.slice(1), newCollection);
    }
  },

  resizeContent: function() {
    var newHeight = window.innerHeight - 50;
    $('#content').css({height: newHeight + "px"})
  },

  parseParams: function(params) {
    var parsedParams = [];
    $.each(params, function(index, value) {
      var tempObj = {};
      if (value === "") {
      } else if (index === "num_members"){
        tempObj[index] = parseInt(value);
        parsedParams.push(tempObj);
      } else {
        tempObj[index]= value;
        parsedParams.push(tempObj);
      }
    });
    return parsedParams;
  },


});
