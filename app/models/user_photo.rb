# == Schema Information
#
# Table name: user_photos
#
#  id        :integer          not null, primary key
#  user_id   :integer          not null
#  photo_url :string(255)      not null
#

class UserPhoto < ActiveRecord::Base
  validates :photo_url, :user_id, presence: true
  belongs_to :user, class_name: "User", foreign_key: :user_id
end
