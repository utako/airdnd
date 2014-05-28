window.AirDnd.Collections.CampaignJoinRequests = Backbone.Collection.extend({
  url: 'api/campaign_join_requests',
  model: AirDnd.Models.CampaignJoinRequest,

  initialize: function(model, options) {
  },

});

window.AirDnd.Collections.campaignJoinRequests = new AirDnd.Collections.CampaignJoinRequests();
