require 'rails_helper'

RSpec.describe '/orders' do
  fixtures :products, :orders

  specify 'GET /orders/current' do
    Order.delete_all

    expect {
      get '/orders/current'
    }.to change{ Order.count }.from(0).to(1)

    expect(response).to be_ok
    expect(response).to contain_json({
      data: {
        id: an_instance_of(Integer),
        confirmed: false,
        items: [],
        adjustments: [],
        total: 0,
      },
    })
  end

  specify 'POST /orders/:id/items' do
    order = orders(:unconfirmed)
    product = products(:premium)

    post "/orders/#{order.id}/items", params: {
      item: {
        product_id: product.id,
        quantity: 123,
      }
    }
    order.reload

    expect(order.items.first).to have_attributes(
      product_id: product.id,
      quantity: 123,
    )
    expect(order.adjustments).not_to be_empty

    expect(response).to contain_json(data: JSONMapper.(order))
  end

  specify 'POST /orders/:id/confirm' do
    unconfirmed = orders(:unconfirmed)

    post("/orders/#{unconfirmed.id}/confirm")

    expect(response).to be_ok
    expect(unconfirmed.reload.confirmed).to be(true)
  end
end
