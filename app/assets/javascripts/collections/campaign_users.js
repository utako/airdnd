window.AirDnd.Collections.CampaignUsers = Backbone.Collection.extend({
  url: 'api/campaign_users',
  model: AirDnd.Models.CampaignUser,

  initialize: function(model, options) {
  },

  getOrFetch: function(id) {
    var model;
    var users = this;
    if (model = this.get(id)) {
      return model;
    } else {
      model = new AirDnd.Models.CampaignUser({ id: id });
      model.fetch({
        success: function () { users.add(model) }
      });
      return model;
    }
  },

});

window.AirDnd.Collections.campaignUsers = new AirDnd.Collections.CampaignUsers();
