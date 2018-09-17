class ChangeOrderTotalDefault < ActiveRecord::Migration[5.2]
  def change
    change_column_default :orders, :total, 0
  end
end
