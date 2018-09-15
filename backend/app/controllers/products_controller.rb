class ProductsController < ApplicationController
  def index
    render_payload(products: Product.all)
  end
end
