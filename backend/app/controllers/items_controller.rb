class ItemsController < ApplicationController
  def create
    order = Order.find(params[:order_id])
    UpdateOrder.(order) do
      order.items.create(item_params)
    end

    if order.valid?
      render_success(order)
    else
      render_errors(order)
    end
  end

  private

    def item_params
      params.require(:item).permit(:product_id, :quantity)
    end
end
