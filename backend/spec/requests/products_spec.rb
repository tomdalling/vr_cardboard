require 'rails_helper'

RSpec.describe '/products' do
  skip 'GET /products' do
    response = get('/products')
    expect(response).to be_ok
    expect(response.body).to eq({
      success: true,
      payload: {
        products: [
          { title: "High Quality", price: 2000 },
          { title: "Premium", price: 3000 },
        ],
      },
    })
  end
end
