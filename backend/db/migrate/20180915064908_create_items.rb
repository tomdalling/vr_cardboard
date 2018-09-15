class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.references :order
      t.references :product
      t.integer :quantity
    end
  end
end
