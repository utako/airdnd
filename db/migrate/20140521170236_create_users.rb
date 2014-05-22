class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :session_token, null: false
      t.string :password_digest, null: false
      t.string :email, null: false
      t.integer :age
      t.string :gender
      t.text :about
      t.string :phone_number
      t.boolean :verified, default: false

      t.timestamps
    end
    add_index :users, :email	
  end
end
