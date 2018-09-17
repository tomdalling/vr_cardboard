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

  describe 'POST /orders' do
    it 'works' do
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
        data: {
          id: an_instance_of(Integer),
          confirmed: false,
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

    it 'renders error messages' do
      post '/orders', params: {
        order: {
          items: [
            { product_id: 'hello', quantity: 'hello' }
          ]
        }
      }

      expect(response.status).to eq(422)
      expect(response).to contain_json({
        errors: ["Items is invalid"],
      })
    end
  end

  specify 'POST /orders/:id/confirm' do
    unconfirmed = orders(:unconfirmed)

    post("/orders/#{unconfirmed.id}/confirm")

    expect(response).to be_ok
    expect(unconfirmed.reload.confirmed).to be(true)
  end
end
