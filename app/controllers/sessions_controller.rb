class SessionsController < ApplicationController

  def new
  end

  def create
    old_id = session[:user_id]
    @msg = ""
    user = User.authenticate(params[:username], params[:password])
    if user
      if user.activateCode == -1 then
        session[:user_id] = user.id
        session[:expires_at] = 30.minutes.from_now
        old_user = User.find(old_id)
        histories = old_user.histories
        old_user.destroy
        histories.each do |h|
          h.destroy
        end
        redirect_to :root
      else
        @msg = "Your account needs activation. Go to your email and do it!"
        render "new"
      end
    else
      @msg = "Username/Password combination error."
      render "new"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to :root
  end

end
