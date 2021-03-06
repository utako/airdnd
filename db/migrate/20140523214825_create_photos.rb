class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :photo_url, null: false
      t.integer :user_id, null: false
      t.timestamps
    end
    add_index :photos, :user_id
    add_index :photos, :photo_url
  end
end
