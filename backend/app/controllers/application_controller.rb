class ApplicationController < ActionController::API
  def render_payload(payload, status: :ok)
    render status: status, json: {
      success: true,
      payload: JSONMapper.(payload),
    }
  end

  def render_errors(model, status: 422)
    render status: status, json: {
      success: false,
      errors: model.errors.to_a,
    }
  end
end
