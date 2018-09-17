# Recalculates all adjustments, and the total, within a transaction
module UpdateOrder
  extend self

  def self.call(order)
    Order.transaction do
      order.adjustments.delete_all
      yield(order)
      if order.valid?
        order.adjustments = AdjustmentsForOrder.(order)
        order.total = order.calculate_total
      end
      order.save
    end

    order
  end
end
