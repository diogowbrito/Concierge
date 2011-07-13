class SessionsController < ApplicationController

  def new

    if current_user == nil then

      name = "Anonymus"+rand(100000).to_s
      User.create :userName => name, :password => name, :email => name
      users = User.where(:userName => name)
      session[:user_id] = users[0].id
      session[:expires_at] = 30.minutes.from_now

    end

    render :layout => false
  end

  def create
    old_id = session[:user_id]

    @msg = ""
    user = User.authenticate(params[:username], params[:password])
    if user
      if user.activateCode == -1 && user.id != session[:user_id] then
        session[:user_id] = user.id
        session[:expires_at] = 30.minutes.from_now

        if old_id != nil then
          old_user = User.find(old_id)
          if old_user.notAnonymus != 'yes' || old_user.notAnonymus != '-100'
            histories = old_user.histories
            old_user.destroy
            histories.each do |h|
              h.destroy
            end
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
