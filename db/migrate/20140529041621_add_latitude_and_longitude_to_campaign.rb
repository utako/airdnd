class AddLatitudeAndLongitudeToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :latitude, :float
    add_column :campaigns, :longitude, :float
  end
end
