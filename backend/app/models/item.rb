class Item < ApplicationRecord
  belongs_to :product
  belongs_to :order

  def line_total
    product.price * quantity
  end
end
