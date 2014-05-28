# == Schema Information
#
# Table name: campaign_photos
#
#  id          :integer          not null, primary key
#  campaign_id :integer          not null
#  photo_url   :string(255)      not null
#

class CampaignPhoto < ActiveRecord::Base
  validates :photo_url, :campaign_id, presence: true
  belongs_to :campaign, class_name: "Campaign"
end
