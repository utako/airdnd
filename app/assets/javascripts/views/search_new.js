window.AirDnd.Views.searchNew = Backbone.View.extend({
  template: JST["search/new"],

  className: "search-container",

  events: {
    "submit form": "submit"
  },

  initialize: function() {

  },

  render: function() {
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    var gameStyles = AirDnd.Models.Campaign.gameStylesOptions;
    var gameSystems = AirDnd.Models.Campaign.gameSystemsOptions;
    var settings = AirDnd.Models.Campaign.settingsOptions;
    var numPlayers = AirDnd.Models.Campaign.numPlayers;
    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      numPlayers: numPlayers
    });
    this.$el.html(renderedContent);
    var $startDate = this.$el.find('#start_date');
    var startDate = $startDate.datepicker({
      onRender: function(date) {
      return date.valueOf() < now.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function(event) {
      startDate.hide();
    }).data('datepicker');
    var $endDate = this.$el.find('#end_date');
    var endDate = $endDate.datepicker({
      onRender: function(date) {
      return date.valueOf() < now.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function(event) {
      endDate.hide();
    }).data('datepicker');
    return this;
  },

  submit: function(event) {
    event.preventDefault();
    debugger
    var inputData = $(event.currentTarget).serializeJSON()["request"];
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
