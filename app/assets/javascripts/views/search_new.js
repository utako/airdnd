window.AirDnd.Views.searchNew = Backbone.View.extend({
  template: JST["search/new"],

  className: "search-container",

  events: {
    "submit form": "submit"
  },

  initialize: function() {
    $('#content').keydown(function (e) {
      if (e.which == 13 && $('#pac-input:visible').length) return false;
    });

  },

  render: function() {

    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
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

    var input = this.$el.find('#pac-input');
    input = input[0];
    var options = { types: ['(cities)'] };
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    // var searchBox = new google.maps.places.SearchBox(input);

    $('#pac-input').on('click', function() {$('#pac-input').popover('show')});
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
    var inputData = $(event.currentTarget).serializeJSON()["request"];
    var searchParams = this.compactObject(inputData);
    AirDnd.Routers.AppRouter.searchParams = searchParams;
    Backbone.history.navigate("#/search", {trigger: true});
  },

  compactObject : function(object) {
    var clone = _.clone(object);
    _.each(clone, function(value, key){
      if (value === "") {
        delete clone[key];
      }
    });
    return clone;
  },
});
