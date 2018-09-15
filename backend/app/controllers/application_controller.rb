class ApplicationController < ActionController::API
  def render_payload(payload)
    render json: {
      success: true,
      payload: payload,
    }
  end
end
