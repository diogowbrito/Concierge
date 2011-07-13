class BackOfficeController < ApplicationController

  def newservice

    if session[:user_id] != nil then

      user = User.find(session[:user_id])

      if user.notAnonymus == '-100'

        render :layout => false

      else
        render "error", :layout => false
      end
    end

  end

  def createservice

    if session[:user_id] != nil then

      user = User.find(session[:user_id])

     if user.notAnonymus == '-100'

        @url = params[:url]
        @icon = params[:service]

        @doc = Nokogiri::XML(open(@url), nil, 'UTF-8')
        @name = @doc.root['name']
        url = @doc.root['url']
        puts @doc
        puts @doc.at_css("provider")
        provider = @doc.at_css("provider").text()
        type = @doc.at_css("type").text()
        tags = @doc.xpath("//tag")
        stags = []

        tags.each do |tag|
          stags << tag.text()
        end

        search = @doc.at_css("search").text()
        refentities = @doc.at_css("referedEntities").children()
        refent = []

        refentities.each do |entity|
          refent << entity.text()
        end

        infentities = @doc.at_css("informedEntities").children()
        infent = []

        infentities.each do |entity|
          infent << entity.text()
        end

        competences = @doc.xpath("//competence")
        comp = []

        competences.each do |competence|
          acomp = []
          if competence['path'] != ""
            acomp << competence['path']
            acomp << competence.at_css("description").text()
              if competence.at_css("ctype") == nil
                acomp << "Home"
              else
              acomp << competence.at_css("ctype").text()
              end
            comp << acomp
          end
        end

        if @icon != nil
          Service.create :serviceName => @name, :provider => provider, :servicetype => type, :ranking => 0, :url => url, :icon => @icon["icon"]
        else
          Service.create :serviceName => @name, :provider => provider, :servicetype => type, :ranking => 0, :url => url
        end

        service = Service.where(:serviceName => @name)
        id = service[0].id
        serviceurl = service[0].url

        stags.each do |tag|
          Tag.create :service_id => id, :tag => tag
        end

        refent.each do |ent|
          RefEntity.create :entity => ent, :service_id => id
        end

        infent.each do |ent|
          InfEntity.create :entity => ent, :service_id => id
        end

        comp.each do |c|
          Competence.create :competenceType => c[2], :competenceUrl => serviceurl+c[0], :description => c[1], :service_id => id
        end

        render :layout => false

      else
        render "error", :layout => false
      end
    end

  end

  def listservices

    if session[:user_id] != nil then

      user = User.find(session[:user_id])

       if user.notAnonymus == '-100'

          @services = Service.all
          @competences = Competence.all
          @entities = InfEntity.all
          @users = User.where(:notAnonymus => "yes")
          @histories = []
          @favorites = []
          @users.each do |user|
            @histories << user.histories
            @favorites << user.favorites
          end

          render :layout => false

      else
         render "error", :layout => false
      end
    else
      name = "Anonymus"+rand(100000).to_s
      User.create :userName => name, :password => name, :email => name
      users = User.where(:userName => name)
      session[:user_id] = users[0].id
      session[:expires_at] = 30.minutes.from_now
      render "error", :layout => false
    end

  end

  def destroyservice

    if session[:user_id] != nil then

      user = User.find(session[:user_id])

      if user.notAnonymus == '-100'

        @id = params[:id]

        @service = Service.find(@id)
        @service.destroy

        @competences = Competence.where(:service_id => @id)
        @competences.each do |competence|
          competence.destroy
        end

        @refent = RefEntity.where(:service_id => @id)
        @refent.each do |ent|
          ent.destroy
        end

        @infent = InfEntity.where(:service_id => @id)
        @infent.each do |ent|
          ent.destroy
        end

        @tags = Tag.where(:service_id => @id)
        @tags.each do |tag|
          tag.destroy
        end

        redirect_to(:action => 'listservices')

      else
        render "error", :layout => false
      end
    end

  end

  def destroyuser

    if session[:user_id] != nil then

      user = User.find(session[:user_id])

      if user.notAnonymus == '-100'

        @id = params[:id]

        @user = User.find(@id)
        @user.destroy

        @favorites = Favorite.where(:user_id => @id)
        @favorites.each do |favorite|
          favorite.destroy
        end

        @histories = History.where(:user_id => @id)
        @histories.each do |history|
          history.destroy
        end

        redirect_to(:action => 'listservices')

      else
        render "error", :layout => false
      end
    end

  end

  def destroyfavourite

    if session[:user_id] != nil then

      user = User.find(session[:user_id])

      if user.notAnonymus == '-100'

    @id = params[:id]

    @favourite = Favorite.find(@id)
    @favourite.destroy

    redirect_to(:action => 'listservices')

      else
        render "error", :layout => false
      end
    end

  end

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
      if user.notAnonymus == '-100' then
        session[:user_id] = user.id
        session[:expires_at] = 180.minutes.from_now
        old_user = User.find(old_id)
        if old_user.notAnonymus != 'yes' || old_user.notAnonymus != '-100'
          old_user =
          histories = old_user.histories
          old_user.destroy
          histories.each do |h|
            h.destroy
          end
        end
        redirect_to "/admin/listservices"
      else
        @msg = "You are not the admnistrator, sorry"
        render "new", :layout => false
      end
    else
      @msg = "Username/Password combination error."
      render "new", :layout => false
    end

  end

end
