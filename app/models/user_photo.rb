class UserPhoto < ActiveRecord::Base
  validates :photo_url, :user_id, presence: true
  belongs_to :user, class_name: "User", foreign_key: :user_id
end
