class HomePageController < ApplicationController

  def index
    if current_user == nil then

      name = "Anonymus"+rand(100000).to_s
      User.create :userName => name, :password => name, :email => name
      users = User.where(:userName => name)
      session[:user_id] = users[0].id
      session[:expires_at] = 30.minutes.from_now

    end

    @services = Service.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @services }
    end
  end

  def poster

    render :layout => false

  end

  def serviceLinks
    @services = Service.all
  end
end
