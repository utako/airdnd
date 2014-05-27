Rails.application.routes.draw do
  root to: 'static_pages#root'
  get '/welcome', to: 'static_pages#welcome'
  namespace :api, defaults: { format: :json } do
    resources :campaigns, except: [:new, :edit]
    resources :campaign_photos, except: [:new, :edit]
  end

  resources :users
  resource :session
end
