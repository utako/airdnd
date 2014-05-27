class CampaignPhoto < ActiveRecord::Base
  validates :photo_url, :campaign_id, presence: true
  belongs_to :campaign, class_name: "Campaign"
end
