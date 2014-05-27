window.AirDnd.Views.searchShow = Backbone.CompositeView.extend({
  template: JST["search/show"],

  className: "search-show",

  initialize: function(options) {
    this.resizeContent();
    this.listenTo(this.collection, "sync", this.render);
    this.listenTo(this.collection, "add", this.addCampaignPreview);
    this.unparsedParams = options.searchParams;
    this.searchParams = this.parseParams(options.searchParams);
    if (_.isEmpty(this.searchParams)) {
      campaigns = this.collection;
    } else {
      campaigns = this.filterResults(this.searchParams, this.collection);
    }
    campaigns.each(this.addCampaignPreview.bind(this));

  },

  render: function() {
    var view = this;
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;
    // var campaigns;

    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers,
      searchParams: this.unparsedParams,
    });

    this.$el.html(renderedContent);
    this.renderSubviews();
    var input = this.$el.find('#pac-input');
    input = input[0];
    var options = { types: ['geocode'] };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    var searchBox = new google.maps.places.SearchBox(input);
    this.initializeMap();
    $('.location').keyup(function() {view.filterByLocation()});
    $('#style').change(function() {view.filterByChange()});
    $('#system').change(function() {view.filterByChange()});
    $('#setting').change(function() {view.filterByChange()});
    $('#players').change(function() {view.filterByChange()});
    return this;
  },

  filterByLocation: function () {
    this.removeAllSubviews();
    var searchLocation = event.currentTarget.value;
    this.unparsedParams['location'] = searchLocation;
    this.searchParams = this.parseParams(this.unparsedParams);
    if (_.isEmpty(this.searchParams)) {
      campaigns = this.collection;
    } else {
      campaigns = this.filterResults(this.searchParams, this.collection);
    }
    campaigns.each(this.addCampaignPreview.bind(this));
    this.render();
    $('.location').focus().val(searchLocation);
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
    campaigns.each(this.addCampaignPreview.bind(this));
    this.render();
  },

  addCampaignPreview: function(campaign) {
    var campaignPreview = new AirDnd.Views.campaignPreview({
      model: campaign,
    });
    this.addSubview(".campaign-previews", campaignPreview);
    campaignPreview.render();
  },

  filterResults: function(params, campaigns) {
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
    var parsedParams = [];
    $.each(params, function(index, value) {
      var tempObj = {};
      if (index==="num_members"){
        tempObj[index] = parseInt(value);
      } else {
        tempObj[index]= value;
      }
      parsedParams.push(tempObj);
    });
    return parsedParams;
  },

  initializeMap: function() {
    var map;
    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(37.76, -122.41)
    };
    var canvas = this.$el.find('#map-canvas')[0];
    map = new google.maps.Map(canvas, mapOptions);
  },

  resizeContent: function() {
    var newHeight = window.innerHeight - 50;
    $('#content').css({height: newHeight + "px"})
  },


});
