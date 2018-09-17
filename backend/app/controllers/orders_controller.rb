class OrdersController < ApplicationController
  def current
    order = Order.unconfirmed.last || Order.create
    render_success(order)
  end

  def confirm
    order = Order.find(params[:id])

    if order.update(confirmed: true)
      render_success(order)
    else
      render_errors(order)
    end
  end
end
