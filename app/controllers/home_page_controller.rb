class HomePageController < ApplicationController

  def index

    if current_user == nil then

      name = "Anonymus"+rand(100000).to_s
      User.create :userName => name, :password => name, :email => name, :notAnonymus => "no"
      users = User.where(:userName => name)
      session[:user_id] = users[0].id

    end

    @services = Service.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @services }
    end
  end
end
