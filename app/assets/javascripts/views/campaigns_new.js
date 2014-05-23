window.AirDnd.Views.campaignsNew = Backbone.View.extend({
  template: JST["campaigns/new"],

  events: {
    "submit form": "submit"
  },

  render: function() {
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var renderedContent = this.template({
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
    });
    var firstDate;
    var view = this;
    this.$el.html(renderedContent);
    var $startDate = this.$el.find('#start_date');
    var startDate = $startDate.datepicker({
      onRender: function(date) {
      return date.valueOf() < now.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function(event) {
      startDate.hide();
      firstDate = startDate.date;
      var $endDate = view.$el.find('#end_date');
      $endDate.data('datepicker').onRender = function(date) {
        return date.valueOf() < firstDate ? 'disabled' : '';
      };
    }).data('datepicker');


    var $endDate = this.$el.find('#end_date');
    var endDate = $endDate.datepicker({
      onRender: function(date) {
      return date.valueOf() < now.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function(event) {
      endDate.data('datepicker').hide();
        // return false;
    });


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
