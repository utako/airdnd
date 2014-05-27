window.AirDnd = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new window.AirDnd.Routers.AppRouter();
    Backbone.history.start();
  },


};

Backbone.CompositeView = Backbone.View.extend({

  addSubview: function(selector, subview) {
    var selectorSubviews =
      this.subviews()[selector] || (this.subviews()[selector] = []);
    selectorSubviews.push(subview);
    var $selectorEl = this.$(selector);
    $selectorEl.append(subview.$el);
  },

  removeSubview: function(selector, subview) {
    var selectorSubviews =
      this.subviews()[selector] || (this.subviews()[selector] = []);
    var subviewIndex = selectorSubviews.indexOf(subview);
    selectorSubviews.splice(subviewIndex, 1);
    subview.remove();
  },

  removeAllSubviews: function(selector) {
    this._subviews = {};
  },

  renderSubviews: function() {
    var view = this;

    _(this.subviews()).each(function (selectorSubviews, selector) {
      var $selectorEl = view.$(selector);
      $selectorEl.empty();

      _(selectorSubviews).each(function (subview) {
        $selectorEl.append(subview.render().$el);
        subview.delegateEvents();
      });
    });
  },

  subviews: function() {
    if (!this._subviews) {
      this._subviews = {};
    }
    return this._subviews;
  },


});
