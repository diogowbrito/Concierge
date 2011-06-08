#Encoding: UTF-8

class SearchController < ApplicationController

   def search
    require 'cgi'

    text = CGI.escape(params[:keyword].to_s)
    @keyword =  text.gsub("%", "\%").gsub("_", "\_").gsub(" ", "+")
    @start = (params[:start] || '1').to_i
    @end = (params[:end] || '7').to_i
    @type = params[:type]
    @entity = params[:entity]
    counter = 1


    user = User.find(session[:user_id])
    if user.notAnonymus != nil
      @logged = "true"
    else @logged = "false"
    end

    if @type != nil then
      services = Service.where(:servicetype => @type).order(:ranking)
    elsif @entity != nil then
      entities = InfEntity.where(:entity => @entity)
      services = []
      entities.each do |entity|
        services << entity.service
      end
    else

    services = Service.order(:ranking)
    end
    list = []
    flag = 1
    itemcounter = 0
    services.each do |service|
      competence = service.competences.where(:competenceType => "Search")

      if competence[0] != nil
      url = competence[0].competenceUrl
      else
      url = ""
      end

      homeurl = service.url
      name = service.serviceName
      begin
        tempdoc = Nokogiri::XML(open(url+'?keyword='+@keyword+"&start=1&end=5000"),nil, 'UTF-8')
        temproot = tempdoc.at_css "list"
        items = tempdoc.xpath("//item")
        itemcounter = itemcounter + items.count
        temproot.add_child("<home>"+homeurl+"</home>")
        temproot.add_child("<name>"+name+"</name")
        list << tempdoc
      rescue

      end
    end

    if itemcounter != 1 then

    @doc = Nokogiri::XML("<list title='Keyword: "+params[:keyword]+"' logged='"+@logged+"'></list>")

    list.each do |result|

      homenodes = result.xpath("//home")
      homeurl = homenodes[0].content
      namenodes = result.xpath("//name")
      name = namenodes[0].content
      nodes = result.xpath("//item")

      address = get_address

      nodes.each do |node|
        if counter >= @start then
        root = @doc.at_css "list"
        href = node['href']
        link = href.gsub(homeurl, address+"services/"+name)
        node['href'] = link
          root.add_child(node)
        end
        counter = counter + 1
        if counter>@end then
          flag = 0
          break
        end
      end
      if flag == 0 then
        break
      end

    end

      respond_to :xml

    else

      list.each do |result|

        homenodes = result.xpath("//home")
        homeurl = homenodes[0].content
        nodes = result.xpath("//item")

        nodes.each do |node|
          href = node['href']
          link = href.gsub(homeurl, "temp")
          linkarray = link.split("/")
          @method = linkarray[1]
          @id = linkarray[2]
          namenodes = result.xpath("//name")
          @service = namenodes[0].content
        end

      end

      redirect_to "/searchrecord/#{@service}/#{@method}/#{@id}"

    end

  end

  def servicesearch
    require 'cgi'

    text = CGI.escape(params[:keyword].to_s)
    @keyword =  text.gsub("%", "\%").gsub("_", "\_").gsub(" ", "+")
    @start = (params[:start] || '1')
    @end = (params[:end] || '7')
    @servicename = params[:service]
    service = Service.where(:serviceName => @servicename)
    competence = service[0].competences.where(:competenceType => "Search")

    homeurl = service[0].url

    user = User.find(session[:user_id])
    if user.notAnonymus != nil
      @logged = "true"
    else @logged = "false"
    end

    url = competence[0].competenceUrl

    begin
      @doc = Nokogiri::XML(open(url+'?keyword='+@keyword+"&start="+@start+"&end="+@end),nil, 'UTF-8')

      address = get_address

      nodes = @doc.xpath("//item")
      if nodes.count != 1 then

        nodes.each do |node|
          href = node['href']
          link = href.gsub(homeurl, address+"/services")
          node['href'] = link
        end

      respond_to :xml
      else

          nodes.each do |node|
            href = node['href']
            link = href.gsub(homeurl, "temp")
            linkarray = link.split("/")
            @method = linkarray[1]
            @id = linkarray[2]
          end

        redirect_to "/searchrecord/#{@servicename}/#{@method}/#{@id}"

      end
    rescue
    end
  end

end
