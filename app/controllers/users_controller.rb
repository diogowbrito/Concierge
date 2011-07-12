#Encoding: UTF-8
class UsersController < ApplicationController

  def new

    @user = User.new
    render :layout => false
  end

  def create
  #  @user = User.new(params[:user])

  #      if User.find(params[:user_userName]) != nil
   #   render :text => "EXISTS", :layout => false
    #    end

        stuff = {
            :userName => 'string',
            :password => 'string',
            :password_confirmation => 'string',
            :email => 'string'
        }

    stuff[:userName] = params[:user_userName]
    stuff[:password] = params[:user_password]
    stuff[:password_confirmation] = params[:user_password_confirmation]
    stuff[:email] = params[:user_email]
    puts stuff
 #   stuff = [ params[:user_userName], params[:user_password],params[:user_password_confirmation],params[:user_email]  ]

    @user = User.new(stuff)
    puts stuff
    puts 'uz'
    puts params
    puts params[:user]
    puts 'shown'


    if @user.save
      puts 'saved'
      @rand = rand(20000)
      @user[:activateCode] = @rand
      @user[:notAnonymus] = "yes"
      @user.save
      @adress = get_address

      UserMailer.registration_confirmation(@user, @rand, @adress).deliver

      render :text => "OK", :layout=>false

    else
       render :text => "WRONG", :layout=>false
    end
  end

  def activate

    code = params[:code]
    id = params[:id]
    @user = User.find(id)

    if code == @user.activateCode.to_s then
      @user[:activateCode] = -1
      @user.save
      render :text => "Your account has been activated.", :layout=>false

    else
     render :text => "WRONG", :layout=>false
    end

  end

  def history

    if session[:user_id] != nil then

      address = get_address

      @start = (params[:start] || '1').to_i
      @end = (params[:end] || '10').to_i
      @next = address + "history?start=" + (@end+1).to_s + "&end=" + (@end+1+@end-@start).to_s
      user = User.find(session[:user_id])

      if user.notAnonymus != nil
        @logged = "true"
      else @logged = "false"
      end

      history = user.histories.find(:all, :order =>"time DESC", :offset =>@start.to_i-1, :limit => @end.to_i)
      @doc = Nokogiri::XML("<list title='Histórico'></list>")
      root = @doc.at_css "list"

      history.each do |hist|
        root.add_child("<item title='"+hist.time.strftime("%m/%d/%Y %H:%M")+"' href='"+hist.url+"'>"+hist.description+"</item>")
      end

      if history.count != 10 then
      @next = ""

    end

    else

      @next = ""
      @doc = Nokogiri::XML("<list title='Utilizador não registado' ></list>")

    end

    root['logged'] = @logged
    root['next'] = @next

    respond_to :xml

  end

  def favourites

  if session[:user_id] != nil then

      address = get_address

      @start = (params[:start] || '1').to_i
      @end = (params[:end] || '10').to_i
      @next = address + "favourites?start=" + (@end+1).to_s + "&end=" + (@end+1+@end-@start).to_s
      user = User.find(session[:user_id])

      if user.notAnonymus != nil
        @logged = "true"
      else @logged = "false"
      end

      favourites = user.favorites.find(:all, :offset =>@start-1, :limit => @end)
      @doc = Nokogiri::XML("<list title='Favoritos'></list>")
      root = @doc.at_css "list"
      puts "aroo"
      puts favourites
      favourites.each do |fav|

        root.add_child("<item href='"+fav.url+"'>"+fav.title+"</item>")
      end

      if favourites.count != 10 then
      @next = ""

    end

    else

      @next = ""
      @doc = Nokogiri::XML("<list title='Utilizador não registado'></list>")

    end

    root['logged'] = @logged
    root['next'] = @next

    respond_to :xml

  end

  def editfavourites

    if session[:user_id] != nil then

      address = get_address

      @start = (params[:start] || '1').to_i
      @end = (params[:end] || '10').to_i
      @next = address + "favourites?start=" + (@end+1).to_s + "&end=" + (@end+1+@end-@start).to_s
      user = User.find(session[:user_id])

      if user.notAnonymus != nil
        @logged = "true"
      else @logged = "false"
      end

      favourites = user.favorites.find(:all, :offset =>@start-1, :limit => @end)
      @doc = Nokogiri::XML("<list title='Favoritos'></list>")
      root = @doc.at_css "list"
      favourites.each do |fav|
        newurl = address + "destroyfavorite?url=" + fav.url
        root.add_child("<item option='delete' href='"+newurl+"'>"+fav.title+"</item>")
      end

      if favourites.count != 10 then
      @next = ""

    end

    else

      @next = ""
      @doc = Nokogiri::XML("<list title='Utilizador não registado'></list>")

    end

    root['logged'] = @logged
    root['next'] = @next

    respond_to :xml

  end

  def sendresource

  if session[:user_id] != nil
    user = User.find(session[:user_id])
    if user.notAnonymus != nil

      urlraw = params[:url]
      urlarray = urlraw.split('/')
      service = Service.where(:serviceName => urlarray[4])
      serviceurl = service[0].url

      @url = serviceurl+"/" +urlarray[5]+"/"+urlarray[6]

      @user = User.find(session[:user_id])

      @adress = get_address

      UserMailer.sendres(@user, @url, @adress).deliver
      @result = "sucess"

    else

      @result = "fail_logged"

    end

  else

    @result = "fail_simple"

  end

  respond_to :xml

  end

  def rateservice

    urlraw = params[:url]
    urlarray = urlraw.split('/')
    service = Service.where(:serviceName => urlarray[4])
    s_id = service[0].id

    if session[:user_id] != nil
      user = User.find(session[:user_id])
      if user.votes.where(:service_id => s_id)[0] == nil
        service[0].ranking = service[0].ranking+1
        Vote.create :service_id => s_id, :user_id => session[:user_id]
        @result = "sucess"
      else
        @result = "already_vote"
      end
    else
      @result = "fail_simple"
    end
  end

  def addfavourite

    if session[:user_id] != nil
      user = User.find(session[:user_id])
      if user.notAnonymus != nil
        url = params[:url]
        title = params[:title]
        if Favorite.where(:user_id => session[:user_id], :url => url)[0] == nil
          Favorite.create :user_id => session[:user_id], :url => url, :title => title
          @result = "sucess"
        else
          @result = "already_favorite"
        end
      else
        @result = "fail_logged"
      end
    else
      @result = "fail_simple"
    end

    respond_to :xml

  end

  def destroyfavourite

    if session[:user_id] != nil
      user = User.find(session[:user_id])
      if user.notAnonymus != nil
        url = params[:url]
        fav = Favorite.where(:user_id => session[:user_id], :url => url)[0]
        fav.destroy
      end
    end

    redirect_to "/editfavourites"

  end

  def options
    respond_to :html
  end

  def manageaccount

  @user = User.find(session[:user_id])

  end

  def update

  @user = User.find(session[:user_id])
  pass = params[:password]
  conf_pass = params[:password_confirmation]

  if pass == conf_pass then
    @user.passwordSalt = BCrypt::Engine.generate_salt
    @user.passwordHash = BCrypt::Engine.hash_secret(pass, passwordSalt)
  end

  redirect_to :root

  end


end
