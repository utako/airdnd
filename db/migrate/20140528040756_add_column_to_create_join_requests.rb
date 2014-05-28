class AddColumnToCreateJoinRequests < ActiveRecord::Migration
  def change
    change_column :campaign_join_requests, :status, :string, default: "pending"
  end
end
