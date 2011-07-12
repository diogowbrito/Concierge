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
      #  old_user = User.find(old_id)
     #   histories = old_user.histories
     #   old_user.destroy
      #  histories.each do |h|
       #   h.destroy
        #end
     #   @msg = "OK"
        render :text => "OK", :layout=>false
      #  render :layout => false
    #    render "needactivation", :layout=> false
    #    return true
    #    redirect_to :root
      else
     #   @msg = "ACTIVATION"
        render :text => "ACTIVATION", :layout=>false

      #  render :layout => false
      #  render "needactivation"
   #     return false
    #    @msg = "Your account needs activation. Go to your email and do it!"
    #    render "new"
      end
    else
  #    @msg = "WRONG"
        render :text => "WRONG", :layout=>false
     # render :layout => false
    #  render "needactivation"
     # @msg = "Username/Password combination error."
      #render "new"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to :root
  end

end
