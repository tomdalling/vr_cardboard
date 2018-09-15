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
      #order.adjustments = []
      order.total = calculate_total(order)
    end
  end

  def build_items(collection)
    params.fetch(:items, []).each do |attrs|
      collection.build(attrs)
    end
  end

  def calculate_total(order)
    gross = order.items
      .map { |i| i.product.price * i.quantity }
      .sum

    adj = 0 #order.adjustments.map(&:amount).sum

    gross - adj
  end
end
