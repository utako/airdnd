class ChangeCampaign < ActiveRecord::Migration
  def change
    remove_column :campaigns, :type
    add_column :campaigns, :game_style, :string, {null: false}
    add_column :campaigns, :game_system, :string, {null: false}
    add_column :campaigns, :campaign_setting, :string
  end
end
