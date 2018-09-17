class OrdersController < ApplicationController
  def current
    order = Order.unconfirmed.last || Order.create
    render_success(order)
  end

  def create
    order = CreateOrder.(order_params)
    if order.valid?
      render_success(order, status: :created)
    else
      render_errors(order)
    end
  end

  def confirm
    order = Order.find(params[:id])
    order.confirmed = true
    if order.save!
      render_success(order)
    else
      render_errors(order)
    end
  end

  private

    def order_params
      params.require(:order).permit(items: [:product_id, :quantity])
    end
end
