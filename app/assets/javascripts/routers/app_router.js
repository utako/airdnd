window.AirDnd.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "": "searchNew",
    "search": "searchShow",
    "games": "gamesShow",
    "campaigns/new": "campaignsNew",
    "campaigns/:id": "campaignsShow",
  },

  searchNew: function() {
    var newView = new AirDnd.Views.searchNew();
    this._swapView(newView);
    AirDnd.Collections.campaigns.fetch();
  },

  searchShow: function() {
    var searchParams = AirDnd.Routers.AppRouter.searchParams;
    delete AirDnd.Routers.AppRouter.searchParams;
    var showView = new AirDnd.Views.searchShow({
      collection: AirDnd.Collections.campaigns,
      searchParams: searchParams || {},
    });
    this._swapView(showView);
    AirDnd.Collections.campaigns.fetch();
  },

  gamesShow: function() {
    debugger
    var gamesView = new AirDnd.Views.gamesShow({
      collection: AirDnd.Collections.campaigns,
      searchParams: { user_id: currentUserId }
    });
    this._swapView(gamesView);
    AirDnd.Collections.campaigns.fetch();
  },

  campaignsIndex: function() {

  },

  campaignsNew: function() {
    var newView = new AirDnd.Views.campaignsNew();
    this._swapView(newView);
  },

  campaignsShow: function(id) {

    var showModel = AirDnd.Collections.campaigns.getOrFetch(id);
    var showView = new AirDnd.Views.campaignsShow({
      model: showModel
    });
    showView.removeAllSubviews;
    this._swapView(showView);
  },

  _swapView: function(view) {
    if (this.currentView) {
      this.currentView.remove();
    }
    this.currentView = view;
    $("#content").html(view.render().$el);
  },
});
