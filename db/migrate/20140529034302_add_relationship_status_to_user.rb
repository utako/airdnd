class AddRelationshipStatusToUser < ActiveRecord::Migration
  def change
    add_column :users, :relationship_status, :string
  end
end
