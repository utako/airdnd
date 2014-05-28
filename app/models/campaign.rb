# == Schema Information
#
# Table name: campaigns
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  location    :string(255)      not null
#  public      :boolean
#  description :string(255)
#  rules       :text
#  num_members :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#  title       :string(255)      not null
#  game_style  :string(255)      not null
#  game_system :string(255)      not null
#  setting     :string(255)
#  start_date  :datetime
#  end_date    :datetime
#

class Campaign < ActiveRecord::Base
  validates :title, :host, :location, :setting, :game_style, :game_system,
    :num_members, presence: true
  belongs_to :host, class_name: "User", foreign_key: :user_id
  has_many :photos, class_name: "CampaignPhoto"
  has_many :join_requests, class_name: "CampaignJoinRequest", foreign_key: :campaign_id
  has_many :users, through: :join_requests, source: :user
end
