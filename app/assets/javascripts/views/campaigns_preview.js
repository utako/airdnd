window.AirDnd.Views.campaignPreview = Backbone.CompositeView.extend({
  template: JST["campaigns/preview"],

  className: "campaign-preview",

  initialize: function(options) {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function() {
    var photoURL = "";
    if (this.model.photos().length > 0) {
      photoURL = this.model.photos().models[0].get('photo_url');
    }
    var renderedContent = this.template({
      campaign: this.model,
      photo_url: photoURL
    });
    this.$el.html(renderedContent);
    return this;
  },

});
