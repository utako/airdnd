window.AirDnd.Views.gamesShow = Backbone.CompositeView.extend({
  template: JST["games/show"],

  className: "games-show",

  initialize: function(options) {
    this.listenTo(this.collection, "sync", this.addFilteredCampaignPreviews);
    this.searchParams = this.parseParams(options.searchParams);
    this.addFilteredCampaignPreviews();
  },

  render: function() {
    var gameStyles = AirDnd.Models.Campaign.gameStylesOptions;
    var gameSystems = AirDnd.Models.Campaign.gameSystemsOptions;
    var settings = AirDnd.Models.Campaign.settingsOptions;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;

    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers,
    });

    this.$el.html(renderedContent);
    this.renderSubviews();

    return this;
  },

  addFilteredCampaignPreviews: function() {
    var campaigns = this.filterResults(this.searchParams, this.collection);
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

});
