class AddNameOfAttrForFilckerUrlToUser < ActiveRecord::Migration
  def change
    add_column :users, :filepicker_url, :string
  end
end
