window.AirDnd.Views.filtersShow = Backbone.CompositeView.extend({
  template: JST["search/filters"],

  initialize: function(options) {
    this.gameStyles = options.gameStyles;
    this.gameSystems = options.gameSystems;
    this.settings = options.settings;
    this.numPlayers = options.numPlayers;
    this.searchParams = options.searchParams;
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function() {
    var renderedContent = this.template({
      gameStyles: this.gameStyles,
      gameSystems: this.gameSystems,
      settings: this.settings,
      numPlayers: this.numPlayers,
      searchParams: this.searchParams
    });
    this.$el.html(renderedContent);
    return this;
  },

});
