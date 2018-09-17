module AdjustmentsForOrder
  extend self

  STANDARD_SHIPPING = 3000
  FREE_SHIPPING_MIN_UNITS = 10

  BULK_DISCOUNT_MIN_UNITS = 21
  BULK_DISCOUNT = 0.1

  def call(order)
    [shipping(order), bulk_discount(order)].compact
  end

  def shipping(order)
    cost = (order.total_units >= FREE_SHIPPING_MIN_UNITS ? 0 : STANDARD_SHIPPING)
    Adjustment.new(description: "Shipping", amount: cost)
  end

  def bulk_discount(order)
    if order.total_units >= BULK_DISCOUNT_MIN_UNITS
      discount = (-1.0 * BULK_DISCOUNT * order.total_before_adjustments).round
      Adjustment.new(description: "Bulk discount", amount: discount)
    else
      nil
    end
  end
end
