class ChangeItemsIntoBridgingTable < ActiveRecord::Migration[5.2]
  def change
    add_index :items, [:product_id, :order_id], unique: true
  end
end
