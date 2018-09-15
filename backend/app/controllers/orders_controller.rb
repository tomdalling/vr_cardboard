class OrdersController < ApplicationController
  def create
    order = CreateOrder.(order_params)
    render_payload(order, status: :created)
  end

  private

    def order_params
      params.require(:order).permit(items: [:product_id, :quantity])
    end
end
