require 'rails_helper'

RSpec.describe '/products' do
  fixtures :products

  specify 'GET /products' do
    get('/products')

    expect(response).to be_ok
    expect(response).to contain_json({
      data: {
        products: [
          { id: 100, title: "High Quality", price: 2000 },
          { id: 200, title: "Premium", price: 3000 },
        ],
      },
    })
  end
end
