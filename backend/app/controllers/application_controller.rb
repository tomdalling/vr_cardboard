class ApplicationController < ActionController::API
  def render_payload(payload, status: :ok)
    render status: status, json: {
      success: true,
      payload: JSONMapper.(payload),
    }
  end
end
