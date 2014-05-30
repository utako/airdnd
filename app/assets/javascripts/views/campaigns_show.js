window.AirDnd.Views.campaignsShow = Backbone.CompositeView.extend({
  template: JST["campaigns/show"],

  className: "campaigns-show",

  initialize: function() {
    this.listenTo(this.model, "sync", this.render);
    this.listenTo(this.model.photos(), "add sync", this.render);
    this.listenTo(this.model.requests(), "add", this.render);
    this.listenTo(this.model.users(), "sync", this.render);
    this.listenTo(this.model.users(), "add", this.addUser);
    this.model.users().each(this.addUser.bind(this));
  },

  events: function() {
    if (this.model.get('user_id') === currentUserId) {
      return {
        "click .filepicker-btn" : "filepickerModal",
        "click .thumbnail": "toggleMainPhoto",
        "mouseenter .editable-attr": "toggleElement",
        "mouseleave .editable-attr": "toggleElement",
        "click #campaign-title": "editTitle",
        "submit #edit-pref-form": "editPreferences",
        "click #campaign-description": "editDescription",
        "click #campaign-rules": "editRules",
        "click #requests-btn": "toggleJoinRequests",
        "click #approve-request": "approveJoinRequest",
        "click #deny-request": "denyJoinRequest"
      };
    } else {
      return {
        "click .thumbnail": "toggleMainPhoto",
        "click #campaign-join": "submitCampaignJoinRequest"
      }
    }
  },


  render: function() {
    var photoURLs = [];
    if (this.model.photos() && this.model.photos().length > 0) {
      for (var i=0; i<this.model.photos().length; i++) {
        photoURLs.push(this.model.photos().models[i].get('photo_url'));
      }
    }
    var gameStyles = AirDnd.Models.Campaign.gameStyles;
    var gameSystems = AirDnd.Models.Campaign.gameSystems;
    var settings = AirDnd.Models.Campaign.settings;
    var startDate = moment(this.model.get('start_date')).format('LL');
    var endDate = moment(this.model.get('end_date')).format('LL');
    var joinRequest = this.model.requests().findWhere({user_id: currentUserId});
    var users = this.model.users();
    var approvedRequests = this.model.approvedRequests();
    var renderedContent = this.template({
      campaign: this.model,
      photo_urls: photoURLs,
      gameStyles: gameStyles,
      gameSystems: gameSystems,
      settings: settings,
      startDate: startDate,
      endDate: endDate,
      joinRequest: joinRequest,
      users: users,
      approvedRequests: approvedRequests
    });
    this.$el.html(renderedContent);
    this.renderSubviews();
    this.delegateEvents();
    var input = this.$el.find('#pac-input');
    input = input[0];
    var autocomplete = new google.maps.places.Autocomplete(input, {});
    var searchBox = new google.maps.places.SearchBox((input));

    Holder.run();
    var view = this;
    this.removeAllSubviews();
    this.model.users().each(this.addUser.bind(this));
    approvedRequests.forEach(function(request) {
      view.addApprovedRequest(request)
    });

    return this;
  },

  filepickerModal: function() {
    filepicker.setKey(filepickerAPIKey);
    var campaign = this.model;
    var view = this;
    filepicker.pick( function (InkBlob) {
        return view.setPhotoURL(InkBlob.url);
    });
  },

  toggleMainPhoto: function(event) {
    var photoURL = $(event.currentTarget.children).attr('src')
    $('#main-photo').attr('src', photoURL);
  },

  submitCampaignJoinRequest: function(event) {
    var view = this;
    var userID = currentUserId;
    var campaignID = this.model.id;
    var inputData = {"campaign_join_request": {"campaign_id": campaignID, "user_id": userID}}
    var newRequest = new AirDnd.Models.CampaignJoinRequest(inputData);
    this.model.requests().create(newRequest, {
      success: function(response) {
        view.render();
      }
    })
  },

  approveJoinRequest: function(event) {
    var view = this;
    var userID = $(event.currentTarget).parent().data('user-id');
    var joinRequest = this.model.requests().where({user_id: userID})[0];
    $('#request-response').replaceWith("<div id='request-response'><h5>Request approved!</h5></div>");
    joinRequest.set('status', 'approved');
    joinRequest.save({}, {
      success: function() {
        view.render();
      }
    });

  },

  denyJoinRequest: function(event) {
    var userID = $(event.currentTarget).parent().data('user-id');
    var joinRequest = this.model.requests().where({user_id: userID})[0];
    $('#request-response').replaceWith("<div id='request-response'><h5>Request approved!</h5></div>");
    joinRequest.set('status', 'denied');
    joinRequest.save();
  },

  addUser: function(user) {
    var userPreview = new AirDnd.Views.campaignUserPreview({
      model: user,
      collection: this.model.requests()
    });
    this.addSubview('.user-previews', userPreview);
    userPreview.render();
  },

  addApprovedRequest: function(request) {
    var users = this.model.users();
    var requestUserID = request.get('user_id');
    var user = users.getOrFetch(requestUserID);
    if (user.get('email')) {
      var memberShowView = new AirDnd.Views.campaignMemberShow({
        model: user
      });
      this.addSubview('.approved-members', memberShowView);
      memberShowView.render();
    } else {
    }
  },

  editTitle: function(event) {
    var view = this;
    $('#campaign-title').replaceWith("<input id='campaign-title-form' class='form-control input-lg' type='text' value='" + this.model.escape('title') + "'>");
    $('#campaign-title-form').blur(event, function(event) { view.submitTitleChange(event)});
  },

  submitTitleChange: function($event) {
    var view = this;
    var newTitle = $event.currentTarget.value;
    this.model.set('title', newTitle);
    this.model.save({}, {
      success: function(response) {
        $('#campaign-title-form').replaceWith("<div id='campaign-title'><h1 class='show'>" + view.model.escape('title') + "</h1><h1 class='hide'>" + view.model.escape('title') + "<button class='glyph-button btn btn-md btn-default edit-campaign-md' id='edit-title'><span class='glyphicon glyphicon-pencil'></span></button></h1></div>");
      }
    });
  },

  editPreferences: function(event) {
    event.preventDefault();
    var view = this;
    var $inputData = $(event.currentTarget).serializeJSON()['campaign'];
    $('#editCampaignPrefModal').modal('hide');
    $('#editCampaignPrefModal').on('hidden.bs.modal', function() {
      view.model.set($inputData);
      view.model.save({}, {
        success: function(response) {
          console.log("yay");
        }
      });
    });
  },

  editDescription: function(event) {
    var view = this;
    $('#campaign-description').replaceWith("<textarea id='campaign-description-form' class='form-control'>" + view.model.escape('description') + "</textarea>");
    $('#campaign-description-form').blur(event, function(event) { view.submitDescriptionChange(event) });
  },

  submitDescriptionChange: function($event) {
    $event.preventDefault();
    var newDescription = $event.currentTarget.value;
    this.model.set('description', newDescription);
    this.model.save({}, {
      success: function(response) {
        $('#campaign-description-form').replaceWith("<div id='campaign-description' class='editable-attr'><% if (!campaign.get('description')) { %><p style='color: grey'>Add your description here.<button class='glyph-button btn btn-xs btn-default edit-campaign-md' id='edit-description'><span class='glyphicon glyphicon-pencil'></span></button></p><% } else { %><p class='show'><%= campaign.escape('description') %></p><p class='hide'><%= campaign.escape('description') %><button class='glyph-button btn btn-xs btn-default edit-campaign-md' id='edit-description'><span class='glyphicon glyphicon-pencil'></span></button></p><% }%></div>")
      }
    });
  },

  editRules: function(event) {
    var view = this;
    $('#campaign-rules').replaceWith("<textarea id='campaign-rules-form' class='form-control'>" + view.model.escape('rules') + "</textarea>");
    $('#campaign-rules-form').blur(event, function(event) { view.submitRulesChange(event) })
  },

  submitRulesChange: function($event) {
    event.preventDefault();
    var newRules = $event.currentTarget.value;
    this.model.set('rules', newRules);
    this.model.save({}, {
      success: function(response) {
        $('#campaign-rules-form').replaceWith("<div id='campaign-rules' class='editable-attr'><% if (!campaign.get('rules')) { %><p style='color: grey'>Add your rules here.<button class='glyph-button btn btn-xs btn-default edit-campaign-md' id='edit-rules'><span class='glyphicon glyphicon-pencil'></span></button></p><% } else { %><p class='show'><%= campaign.escape('rules') %></p><p class='hide'><%= campaign.escape('rules') %><button class='glyph-button btn btn-xs btn-default edit-campaign-md' id='edit-rules'><span class='glyphicon glyphicon-pencil'></span></button></p><% }%></div>");
      }
    });
  },

  toggleElement: function(event) {
    $(event.currentTarget).children().toggleClass("show hide")
  },

  toggleJoinRequests: function(event) {
    $(event.currentTarget.parentElement.parentElement).children().toggleClass("show hide")
  },

  setPhotoURL: function(photoURL) {
    var view = this;
    var campaignID = this.model.id;
    var inputData = {"campaign_photo": {"campaign_id": campaignID, "photo_url": photoURL}}
    var newCampaignPhoto = new AirDnd.Models.CampaignPhoto(inputData);
    this.model.photos().create(newCampaignPhoto, {
      success: function(response) {
        view.render();
      }
    })
  }

});
