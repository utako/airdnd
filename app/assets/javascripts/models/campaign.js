window.AirDnd.Models.Campaign = Backbone.Model.extend({
  urlRoot: 'api/campaigns',

  photos: function() {
    if (!this._photos) {
      this._photos = new AirDnd.Collections.CampaignPhotos([], {
        campaign: this
      });
    }
    return this._photos;
  },

  host: function() {
    if (!this._host) {
      this._host = new AirDnd.Models.Host([], {
        campaign: this
      });
    }
    return this._host;
  },

  parse: function(response) {
    if (response.photos) {
      this.photos().set(response.photos, { parse: true });
      delete response.photos;
    }
    if (response.host) {
      this.host().set(response.host, { parse: true });
      delete response.host;
    }
    return response;
  },

})


window.AirDnd.Models.Campaign.gameStyles = ["Dungeons&Dragons 5E",
  "Dungeons&Dragons 4E", "Dungeons&Dragons 3.5E", "Dungeons&Dragons 3E",
  "Shadowrun", "Exalted", "Other"];
window.AirDnd.Models.Campaign.gameSystems = ["Hack and Slash", "Pure Roleplay",
  "Other"];
window.AirDnd.Models.Campaign.settings = ["Áereth", "Al-Qadim",
  "Birthright", "Blackmoor", "Council of Wyrms", "Dark Sun", "Domains of Divinity",
  "Dragonlance", "Dreadmire", "Eberron", "Forgotten Realms", "Greyhawk",
  "Jakandor", "Kerell", "Kingdoms of Kalamar", "Lankhmar", "Masque of the Red Death",
  "Mystara", "Pelinore", "Planescape", "Ptolus", "Ravenloft", "Rokugan",
  "Spelljammer", "Teatrail Falls", "Wilderlands of High Fantasy", "Other"];
window.AirDnd.Models.Campaign.numPlayers = ["1 Player", "2 Players", "3 Players", "4 Players",
  "5 Players", "6 Players", "7 Players", "8 Players", "9 Players",
  "10 Players", "11 Players", "12 Players", "13 Players", "14 Players",
  "15 Players", "16+ Players"];
