window.AirDnd.Views.campaignMemberShow = Backbone.CompositeView.extend({
  template: JST["campaigns/member_show"],

  className: "member-show",

  initialize: function(options) {
    // this.listenTo(this.model, "sync", this.render);
  },

  render: function() {
    var renderedContent = this.template({
      user: this.model,
    });
    this.$el.html(renderedContent);
    return this;
  },

});
