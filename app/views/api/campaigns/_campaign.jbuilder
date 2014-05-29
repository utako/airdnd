json.extract! campaign, :id, :user_id, :title, :location, :game_style, :game_system, :setting, :description, :latitude, :longitude, :rules, :num_members, :start_date, :end_date, :public, :created_at, :updated_at
json.photos campaign.photos
json.host campaign.host
json.users campaign.users
json.join_requests campaign.join_requests
