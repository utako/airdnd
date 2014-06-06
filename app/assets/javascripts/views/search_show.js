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
    this.initialSearchCoords = options.searchParams.location || [37.7833, -122.4167];
    this.searchParamCoords = {};
    this.listenTo(this.collection, "sync add", (function() {
      this.addMapShow(this.initialSearchCoords)
    }).bind(this));
    this.addFilters();
    this.filterByLocation(this.initialSearchCoords);
  },

  render: function() {
    console.log('render');
    var view = this;
    var renderedContent = this.template({});
    this.map;
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
    console.log('filter by location');
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
    console.log('add campaign preview');

    var campaignID = campaign.id;
    this.markerLocations[campaignID] = [parseFloat(campaign.get('latitude')), parseFloat(campaign.get('longitude'))];
    var campaignPreview = new AirDnd.Views.campaignPreview({
      model: campaign,
    });
    this.addSubview(".campaign-previews", campaignPreview);
    campaignPreview.render();
  },
  
  addMapShow: function(searchCoords) {
    console.log('map show');
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
    if (_.isEmpty(this.searchParams)) {
      campaigns = this.collection;
    } else {
      campaigns = this.filterResults(this.searchParams, this.collection);
    }
    campaigns.each(this.addCampaignPreview.bind(this));
    this.mapShow.makeMarkers();
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

  resizeContent: function() {
    var newHeight = window.innerHeight - 50;
    $('#content').css({height: newHeight + "px"})
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


});
