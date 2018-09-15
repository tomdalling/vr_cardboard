class ProductsController < ApplicationController
  def index
    render_payload({
      products: [
        { title: "High Quality", price: 2000 },
        { title: "Premium", price: 3000 },
      ]
    })
  end
end
