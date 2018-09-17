class ItemsController < ApplicationController
  def create
    order = Order.find(params[:order_id])

    UpdateOrder.(order) do
      order.merge_item(Item.new(item_params))
    end

    unless order.errors.any?
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
