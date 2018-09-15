class ApplicationController < ActionController::API
  def render_success(payload, status: :ok)
    render status: status, json: {
      data: JSONMapper.(payload),
    }
  end

  def render_errors(model, status: 422)
    render status: status, json: {
      errors: model.errors.to_a,
    }
  end
end
