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
    UpdateOrder.(Order.new) do |order|
      build_items(order.items)
    end
  end

  def build_items(collection)
    params.fetch(:items, []).each do |attrs|
      collection.build(attrs)
    end
  end
end
