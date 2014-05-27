window.AirDnd.Collections.CampaignPhotos = Backbone.Collection.extend({
  url: 'api/campaign_photos',
  model: AirDnd.Models.CampaignPhoto,

  initialize: function(model, options) {
  },

});

window.AirDnd.Collections.campaignPhotos = new AirDnd.Collections.CampaignPhotos();
