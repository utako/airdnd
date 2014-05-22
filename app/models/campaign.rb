# == Schema Information
#
# Table name: campaigns
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  location    :string(255)      not null
#  type        :string(255)      not null
#  public      :boolean
#  description :string(255)
#  rules       :text
#  num_members :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Campaign < ActiveRecord::Base
  validates :title, :host, :location, :setting, :game_style, :game_system, 
    :num_members, presence: true
  belongs_to :host, class_name: "User", foreign_key: :user_id
end
