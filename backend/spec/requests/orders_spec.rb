require 'rails_helper'

RSpec.describe '/orders' do
  fixtures :products

  specify 'POST /orders' do
    post '/orders', params: {
      order: {
        items: [
          { product_id: 100, quantity: 11 },
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
            quantity: 11,
            product: { id: 100, title: "High Quality", price: 2000 },
          }, {
            id: an_instance_of(Integer),
            quantity: 20,
            product: { id: 200, title: "Premium", price: 3000 },
          },
        ],
        adjustments: [
          { description: "Shipping", amount: 0 },
          { description: "Bulk discount", amount: -8200 },
        ],
        total: 73800,
      },
    })
  end
end
