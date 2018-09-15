class Order < ApplicationRecord
  has_many :items
  has_many :adjustments

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
end
