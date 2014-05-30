window.AirDnd.Views.campaignPreview = Backbone.CompositeView.extend({
  template: JST["campaigns/preview"],

  className: function() {
    return "campaign-preview campaign-preview-" + this.model.id;
  },

  initialize: function(options) {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function() {
    var photoURL = "";
    if (this.model.photos() && this.model.photos().length > 0) {
      photoURL = this.model.photos().models[0].get('photo_url');
    } else {
    }
    var renderedContent = this.template({
      campaign: this.model,
      photo_url: photoURL
    });
    this.$el.html(renderedContent);
    return this;
  },

});
