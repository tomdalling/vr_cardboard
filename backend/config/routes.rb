Rails.application.routes.draw do
  resources :products, only: %i(index)
  resources :orders, only: %i(create) do
    get 'current', on: :collection
    post 'confirm', on: :member
  end
end
