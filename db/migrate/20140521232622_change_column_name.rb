class ChangeColumnName < ActiveRecord::Migration
  def change
    rename_column :campaigns, :campaign_setting, :setting
  end
end
