class CreateAdjustments < ActiveRecord::Migration[5.2]
  def change
    create_table :adjustments do |t|
      t.references :order
      t.string :description
      t.integer :amount
    end
  end
end
