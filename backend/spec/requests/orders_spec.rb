require 'rails_helper'

RSpec.describe '/orders' do
  specify 'POST /orders' do
    post '/orders', params: {
      order: {
        items: [
          { product_id: 100, quantity: 10 },
          { product_id: 200, quantity: 20 },
        ],
      },
    }

    expect(response).to be_created
    expect(response).to contain_json({
      success: true,
      payload: {
        id: an_instance_of(Integer),
        items: [
          {
            id: an_instance_of(Integer),
            quantity: 10,
            product: { id: 100, title: "High Quality", price: 2000 },
          }, {
            id: an_instance_of(Integer),
            quantity: 20,
            product: { id: 200, title: "Premium", price: 3000 },
          },
        ],
        total: 80000,
=begin
        adjustments: [
          { name: "Shipping", amount: 0 },
          { name: "Bulk discount", amount: -8000 },
        ],
        total: 72000,
=end
      },
    })
  end
end
