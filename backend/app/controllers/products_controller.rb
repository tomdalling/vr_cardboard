class ProductsController < ApplicationController
  def index
    render_success(products: Product.all)
  end
end
