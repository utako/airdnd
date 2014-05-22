window.AirDnd.Views.searchNew = Backbone.View.extend({
  template: JST["search/new"],

  events: {
    "submit form": "submit"
  },

  render: function() {
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;
    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers
    });
    this.$el.html(renderedContent);
    return this;
  },

  submit: function(event) {
    event.preventDefault();
    var inputData = $(event.currentTarget).serializeJSON()["campaign"];
    var newCampaign = new AirDnd.Models.Campaign(inputData);
    newCampaign.save({}, {
      success: function(response) {
        var id = response.get("id");
        AirDnd.Collections.campaigns.add(newCampaign);
        Backbone.history.navigate("#/campaigns/"+id, {trigger: true});
      }
    });
  },
});
