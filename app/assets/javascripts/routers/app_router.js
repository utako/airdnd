window.AirDnd.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "": "searchNew",
    "campaigns/new": "campaignsNew",
    "campaigns/:id": "campaignsShow",
  },

  searchNew: function() {
    var newView = new AirDnd.Views.searchNew();
    this._swapView(newView);
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
