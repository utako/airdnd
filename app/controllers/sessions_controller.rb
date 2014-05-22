class SessionsController < ApplicationController
  def new
    @user = User.new
  end
  
  def create
    @user = User.find_by_credentials(params[:user])
    if @user
      login!(@user)
      redirect_to root_url
    else
      render :new
    end
  end
  
  def destroy
    logout
    redirect_to new_session_url
  end
end
