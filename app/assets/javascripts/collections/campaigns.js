window.AirDnd.Collections.Campaigns = Backbone.Collection.extend({
  url: 'api/campaigns',
  model: AirDnd.Models.Campaign,

  getOrFetch: function(id) {
    var model;
    var campaigns = this;
    if (model = this.get(id)) {
      model.fetch();
      return model;
    } else {
      model = new AirDnd.Models.Campaign({ id: id });
      model.fetch({
        success: function () { campaigns.add(model) }
      });
      return model;
    }
  },


});

window.AirDnd.Collections.campaigns = new AirDnd.Collections.Campaigns();
