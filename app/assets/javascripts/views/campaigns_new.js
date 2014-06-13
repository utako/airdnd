window.AirDnd.Views.campaignsNew = Backbone.View.extend({
  template: JST["campaigns/new"],
  className: "campaigns-new",

  initialize: function () {
    // google.maps.event.addDomListener(window, 'keydown', this.initializeMap);
  },


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

    this.$el.html(renderedContent);

    // Location input autocomplete

    var input = this.$el.find('#pac-input');
    input = input[0];
    var autocomplete = new google.maps.places.Autocomplete(input, {});
    var searchBox = new google.maps.places.SearchBox((input));

    //

    var firstDate;
    var view = this;

    var $startDate = this.$el.find('#start_date');
    var startDate = $startDate.datepicker({
      onRender: function(date) {
        return date.valueOf() < now.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function(ev) {
      if (ev.date.valueOf() > checkout.date.valueOf()) {
        var newDate = new Date(ev.date)
        newDate.setDate(newDate.getDate() + 1);
        checkout.setValue(newDate);
      }
      startDate.hide();
      view.$el.find('#end_date')[0].focus();
    }).data('datepicker');
    
    var checkout = this.$el.find('#end_date').datepicker({
      onRender: function(date) {
        return date.valueOf() <= startDate.date.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function(ev) {
      checkout.hide();
    }).data('datepicker');



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
        $('#newCampaignModal').modal('hide');
        $('#newCampaignModal').on('hidden.bs.modal', function() {
          Backbone.history.navigate("#/campaigns/"+id, {trigger: true});
        });
      }
    });
  },
});
