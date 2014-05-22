class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.integer :user_id, null: false
      t.string :location, null: false
      t.string :type, null: false
      t.boolean :public
      t.string :description
      t.text :rules
      t.integer :num_members, null: false

      t.timestamps
    end
    add_index :campaigns, :user_id
    add_index :campaigns, :location
    add_index :campaigns, :num_members
  end
end
