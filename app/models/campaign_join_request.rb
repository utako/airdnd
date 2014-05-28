# == Schema Information
#
# Table name: campaign_join_requests
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  campaign_id :integer          not null
#  status      :string(255)      default("pending"), not null
#  created_at  :datetime
#  updated_at  :datetime
#

class CampaignJoinRequest < ActiveRecord::Base
  belongs_to :campaign
  belongs_to :user, class_name: "User", foreign_key: :user_id
  has_one :host, through: :campaign, source: :user_id
end
