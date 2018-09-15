class OrdersController < ApplicationController
  def create
    order = CreateOrder.(order_params)
    if order.valid?
      render_payload(order, status: :created)
    else
      render_errors(order)
    end
  end

  def confirm
    order = Order.find(params[:id])
    order.confirmed = true
    if order.save!
      render_payload(order)
    else
      render_errors(order)
    end
  end

  private

    def order_params
      params.require(:order).permit(items: [:product_id, :quantity])
    end
end
