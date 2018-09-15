Rails.application.routes.draw do
  resources :products, only: %i(index)
  resources :orders, only: %i(create)
end
