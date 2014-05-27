class CreateCampaignPhotosTable < ActiveRecord::Migration
  def change
    create_table :campaign_photos do |t|
      t.integer :campaign_id, null: false
      t.string :photo_url, null: false
    end
    add_index :campaign_photos, :campaign_id
    add_index :campaign_photos, :photo_url
  end
end
