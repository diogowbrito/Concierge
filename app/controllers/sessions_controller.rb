class SessionsController < ApplicationController

  def new
    render :layout => false
  end

  def create
    old_id = session[:user_id]
    puts params[:username]
    puts params[:password]

    @msg = ""
    user = User.authenticate(params[:username], params[:password])
    puts user
    if user
      if user.activateCode == -1 && user.id != session[:user_id] then
        session[:user_id] = user.id
        session[:expires_at] = 30.minutes.from_now
        if old_user.notAnonymus != 'yes' || old_user.notAnonymus != '-100'
          old_user = User.find(old_id)
          histories = old_user.histories
          old_user.destroy
          histories.each do |h|
            h.destroy
          end
        end
        render :text => "OK", :layout=>false
      else
        render :text => "ACTIVATION", :layout=>false
      end
    else
        render :text => "WRONG", :layout=>false
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to :root
  end

end
