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
    _.each(this.subviews(), function(selectorSubviews, selector) {
      selectorSubviews.forEach(function(subview) {
        subview.remove();
      })
    })
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
  
  removeSubviewsForSelector: function (renderSelector) {
    var view = this;
    $(renderSelector).empty();
    // _(this.subviews()[renderSelector]).each(function (selectorSubview) {
    //   var $selectorEl = view.$(renderSelector);
    //   $selectorEl.append(selectorSubview.render().$el);
    //   selectorSubview.delegateEvents();
    // });
  },

  subviews: function() {
    if (!this._subviews) {
      this._subviews = {};
    }
    return this._subviews;
  },


});
