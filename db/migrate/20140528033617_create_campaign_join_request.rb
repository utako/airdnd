class CreateCampaignJoinRequest < ActiveRecord::Migration
  def change
    create_table :campaign_join_requests do |t|
      t.integer :user_id, null: false
      t.integer :campaign_id, null: false
      t.string :status, null: false
      t.timestamps
    end
    add_index :campaign_join_requests, :user_id
    add_index :campaign_join_requests, :campaign_id
    add_index :campaign_join_requests, :status
  end
end
