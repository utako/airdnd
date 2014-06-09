class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :logged_in?, :current_user, :require_login!
  
  def login!(user)
    session[:token] = user.reset_session_token!
    @current_user = user
  end
  
  def current_user
    @current_user ||= User.find_by_session_token(session[:token])
  end
  
  def logged_in?
    !!current_user
  end
  
  def logout
    current_user.try(:reset_session_token!)
    session[:token] = nil
  end
  
  def require_login!
    redirect_to new_session_url unless current_user
  end
end
