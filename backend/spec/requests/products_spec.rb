require 'rails_helper'

RSpec.describe '/products' do
  specify 'GET /products' do
    get('/products')
    expect(response).to be_ok
    expect(response).to contain_json({
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
