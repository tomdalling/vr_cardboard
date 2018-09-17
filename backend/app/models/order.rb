class Order < ApplicationRecord
  has_many :items
  has_many :adjustments

  scope :unconfirmed, -> { where(confirmed: false) }

  def total_units
    items.map(&:quantity).sum
  end

  def total_before_adjustments
    items.map(&:line_total).sum
  end

  def total_adjustments
    adjustments.map(&:amount).sum
  end

  def calculate_total
    total_before_adjustments + total_adjustments
  end

  def merge_item(new_item)
    existing_item = items.find_by(product_id: new_item.product_id)
    if existing_item
      # update quantity of existing item
      existing_item.update(quantity: existing_item.quantity + new_item.quantity)
      existing_item
    else
      # create new item
      items << new_item
      new_item
    end
  end
end
