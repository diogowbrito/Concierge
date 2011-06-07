class ServiceForwardController < ApplicationController

  def homepagerequest

    @servicename = params[:service]
    service = Service.where(:serviceName => @servicename)
    competence = service[0].competences.where(:competenceType => "Home")
    homeurl = service[0].url

    user = User.find(session[:user_id])
    if user.notAnonymus != nil
      @logged = "true"
    else @logged = "false"
    end

    @url = competence[0].competenceUrl
    @doc = Nokogiri::XML(open(@url), nil, 'UTF-8')
    nodes = @doc.xpath("//link")

    root = @doc.root()
    root['logged'] = @logged

    address = get_address

    nodes.each do |node|
      href = node['href']
      link = href.gsub(homeurl, address+"services/"+@servicename)
      node['href'] = link
    end

    root = @doc.at_css "record"
    root.add_child("<search>"+address+"services/"+@servicename+"/search?keyword=<search/>")

    respond_to :xml
  end

  def listrequest

    @servicename = params[:service]
    @method = params[:method]
    service = Service.where(:serviceName => @servicename)
    serviceurl = service[0].url

    user = User.find(session[:user_id])
    if user.notAnonymus != nil
      @logged = "true"
    else @logged = "false"
    end

    @url = serviceurl + "/" + @method + "?start=1&end=7"
    @doc = Nokogiri::XML(open(@url), nil, 'UTF-8')

    root = @doc.at_css("list")
    root['logged'] = @logged

    nodes = @doc.xpath("//item")

    address = get_address

    nodes.each do |node|
      href = node['href']
      if href != nil
       link = href.gsub(serviceurl, address + "services/"+@servicename)
       node['href'] = link
      end
    end

    respond_to :xml
  end


  def recordrequest

    @servicename = params[:service]
    @id = params[:id]
    @method = params[:method]

    service = Service.where(:serviceName => @servicename)
    serviceurl = service[0].url

    user = User.find(session[:user_id])
    if user.notAnonymus != nil
      @logged = "true"
    else @logged = "false"
    end

    link = serviceurl + "/" +@method+"/"+@id
    puts link
    @doc = Nokogiri::XML(open(link), nil, 'UTF-8')

    record = @doc.at_css("record")
    title = record['title']

    record['logged'] = @logged

    if session[:user_id] != nil then
      History.create :user_id => session[:user_id], :time => Time.now, :description => "Recurso: "+title, :url => get_address + "/services/"+@servicename+"/"+@method+"/"+@id
    end

    entity = @doc.xpath("//entity");
    entity.each do |node|

      parent = node.parent()
      kind = node.attr('kind')
      service = node.attr('service')
      serviceType = node.attr('serviceType')
      title = node.attr('title')
      value = node.text()

      node.remove
      plus_value = value.gsub(" ", "+")

      link = get_address

      if service != nil then
        link += 'services/'+service+'search?keyword='+plus_value
      elsif kind != nil then
        plus_kind = kind.gsub(" ", "+")
        link += 'search?keyword='+plus_value+'&amp;entity='+plus_kind
      else
        plus_serviceType = servie.gsub(" ", "+")
        link += 'search?keyword='+plus_value+'&amp;type='+plus_serviceType
      end

      if title == nil
        parent.add_child('<entity href="'+link+'">'+value+'</entity>')
      else
        parent.add_child('<entity title="'+title+'" href="'+link+'">'+value+'</entity>')
      end

    end

    link_tag = @doc.xpath("//link")

    address = get_address

    link_tag.each do |node|

      href = node['href']
      if href == nil then
        node.name = "external_link"
        href = node['ehref']
      end
      link = href.gsub(serviceurl, address+"services/"+@servicename)
      node['href'] = link

    end
  end

  respond_to :xml

end
