xml.instruct!(:xml, :version=>"1.0")

address = get_address


  xml.list(:title => "Links") do

    @services.each do |service|
       xml.item(service.serviceName, :href => address +"services/"+service.serviceName.gsub(" ", "_")+"/index")
  end
end