window.AirDnd.Views.campaignsShow = Backbone.View.extend({
  template: JST["campaigns/show"],
  
  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
  },
  
  events: {
  },
  
  render: function() {
    var renderedContent = this.template({
      campaign: this.model
    });
    this.$el.html(renderedContent);
    return this;
  },
  
  submit: function(event) {
    event.preventDefault();
    var inputData = $(event.currentTarget).serializeJSON()["campaign"];
    var newCampaign = new AirDnd.Models.Campaign(inputData);
    newCampaign.save({}, {
      success: function(response) {
        var id = response.get("id");
        AirDnd.Collections.campaigns.add(newCampaign);
        Backbone.history.navigate("#/campaigns/"+id, {trigger: true});
      }
    });
  },
});