Rails.application.routes.draw do
  resources :products, only: %i(index)
  resources :orders, only: %i() do
    get 'current', on: :collection
    post 'confirm', on: :member
    resources :items, only: %i(create)
  end
end
