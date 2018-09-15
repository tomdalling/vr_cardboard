Rails.application.routes.draw do
  resources :products, only: %i(index)
  resources :orders, only: %i(create) do
    member do
      post 'confirm'
    end
  end
end
