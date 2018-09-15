class CreateOrder
  def self.call(params)
    new(params).__send__(:call)
  end

  private

  attr_reader :params

  def initialize(params)
    @params = params
  end

  def call
    Order.transaction do
      new_order.tap do |order|
        order.save
      end
    end
  end

  def new_order
    Order.new.tap do |order|
      build_items(order.items)
      build_adjustments(order) if order.valid?
      order.total = order.calculate_total if order.valid?
    end
  end

  def build_items(collection)
    params.fetch(:items, []).each do |attrs|
      collection.build(attrs)
    end
  end

  def build_adjustments(order)
    order.adjustments.build(description: "Shipping", amount: shipping(order))
    if order.total_units > 30
      order.adjustments.build(description: "Bulk discount", amount: bulk_discount(order))
    end
  end

  def shipping(order)
    if order.total_units < 10
      3000
    else
      0
    end
  end

  def bulk_discount(order)
    (-0.1 * order.total_before_adjustments).round
  end
end
