class CreateUserPhotos < ActiveRecord::Migration
  def change
    create_table :user_photos do |t|
      t.integer :user_id, null: false
      t.string :photo_url, null: false
    end
    add_index :user_photos, :user_id
    add_index :user_photos, :photo_url
  end
end
