#Encoding: UTF-8
class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      @rand = rand(2000)
      @user[:activateCode] = @rand
      @user[:notAnonymus] = "yes"
      @user.save
      UserMailer.registration_confirmation(@user, @rand).deliver
      redirect_to root_url
    else
      render "new"
    end
  end

  def activate

    code = params[:code]
    id = params[:id]
    @user = User.find(id)

    if code == @user.activateCode.to_s then
      @user[:activateCode] = -1
      @user.save
    end

  end

  def history

    if session[:user_id] != nil then

      @start = params[:start] || '0'
      @end = params[:end] || '7'
      @next = @end.to_i+1
      puts session[:user_id]
      user = User.find(session[:user_id])

      history = user.histories.find(:all, :order =>"time", :offset =>@start.to_i, :limit => @end.to_i)
      puts history.count
      @doc = Nokogiri::XML("<list title='Histórico'></list>")
      root = @doc.at_css "list"

      history.each do |hist|
        root.add_child("<item title='"+hist.time.to_s+"' href='"+hist.url+"'>"+hist.description+"</item>")
      end

      if history.count != 7 then
      @next = ""

    end

    else

      @next = ""
      @doc = Nokogiri::XML("<list title='Utilizador não registado'></list>")

    end

    respond_to :xml

  end

  def sendresource
  puts session[:user_id].to_s+"aahaha"
  if session[:user_id] != nil
    user = User.find(session[:user_id])
    if user.notAnonymus != nil

      urlraw = params[:url]
      urlarray = urlraw.split('/')
      service = Service.where(:serviceName => urlarray[4])
      serviceurl = service[0].url

      @url = serviceurl+"/" +urlarray[5]+"/"+urlarray[6]

      @user = User.find(session[:user_id])

      UserMailer.sendres(@user, @url).deliver
      @result = "sucess"

    else

      @result = "fail_logged"

    end

  else

    @msg = "fail_simple"

  end

  respond_to :xml

  end

end
