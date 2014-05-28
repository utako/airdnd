window.AirDnd.Collections.CampaignUsers = Backbone.Collection.extend({
  url: 'api/campaign_users',
  model: AirDnd.Models.CampaignUser,

  initialize: function(model, options) {
  },

});

window.AirDnd.Collections.campaignUsers = new AirDnd.Collections.CampaignUsers();
