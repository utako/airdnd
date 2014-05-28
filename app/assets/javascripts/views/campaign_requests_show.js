window.AirDnd.Views.campaignRequestShow = Backbone.CompositeView.extend({
  template: JST["campaigns/request"],

  className: "campaign-request",

  initialize: function(options) {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function() {
    var user;
    if (this.model.users().length > 0) {
      photoURL = this.model.users().models[0].get('photo_url');
    }
    var renderedContent = this.template({
      campaign: this.model,
      photo_url: photoURL
    });
    this.$el.html(renderedContent);
    return this;
  },

});
