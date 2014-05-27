# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  session_token   :string(255)      not null
#  password_digest :string(255)      not null
#  email           :string(255)      not null
#  age             :integer
#  gender          :string(255)
#  about           :text
#  phone_number    :string(255)
#  verified        :boolean          default(FALSE)
#  created_at      :datetime
#  updated_at      :datetime
#

class User < ActiveRecord::Base
  attr_reader :password
  validates :email, :password_digest, :session_token, presence: true
  validates :password, length: { minimum: 6, allow_nil: true }
  validates :verified, inclusion: { in: [true, false] }
  before_validation :ensure_session_token

  has_many :hosted_campaigns, class_name: "Campaign", foreign_key: :user_id
  has_one :profile_picture, class_name: "Photo", foreign_key: :user_id

  def self.find_by_credentials(creds)
    @user = User.find_by_email(creds[:email])
    return @user if @user.try(:is_password?, creds[:password])
    nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end

  def ensure_session_token
    self.session_token ||= SecureRandom.hex
  end

  def reset_session_token!
    self.session_token = SecureRandom.hex
    self.save!
    session_token
  end
end
