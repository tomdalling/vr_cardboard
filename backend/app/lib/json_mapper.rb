class JSONMapper < TypeMapper
  def self.call(*args)
    @singleton ||= new
    @singleton.map(*args)
  end

  def_mapping(Order) do |order|
    {
      id: order.id,
      items: map(order.items),
      adjustments: map(order.adjustments),
      total: order.total,
    }
  end

  def_mapping(Product) do |product|
    {
      id: product.id,
      title: product.title,
      price: product.price,
    }
  end

  def_mapping(Item) do |item|
    {
      id: item.id,
      quantity: item.quantity,
      product: map(item.product),
    }
  end

  def_mapping(Adjustment) do |adj|
    {
      description: adj.description,
      amount: adj.amount,
    }
  end

  def_mapping(Hash) do |hash|
    hash.map{ |key, value| [key, map(value)] }.to_h
  end

  def_mapping(ActiveRecord::Relation) do |relation|
    map(relation.to_a)
  end

  def_mapping(Array) do |array|
    array.map { |element| map(element) }
  end
end
