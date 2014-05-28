window.AirDnd.Views.campaignUserPreview = Backbone.CompositeView.extend({
  template: JST["campaigns/user_preview"],

  className: "user-preview",

  initialize: function(options) {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.collection, "sync", this.render);
  },

  render: function() {
    var requestStatus = this.collection.where({user_id: this.model.id})[0].get('status');
    var renderedContent = this.template({
      user: this.model,
      createdAt: moment(this.model.get('created_at')).format('LL'),
      requestStatus: requestStatus
    });
    this.$el.html(renderedContent);
    return this;
  },

});
