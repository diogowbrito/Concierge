#Encoding: UTF-8
class UserMailer < ActionMailer::Base

  default :from => "concierge.g06@gmail.com"

  def registration_confirmation(user, num, host)
    @user = user
    @num = num
    @host = host
    mail(:to => "#{user.userName} <#{user.email}>", :subject => "Registered")
  end

  def sendres(user, url, host)

  @host = host
  @doc = Nokogiri::XML(open(url), nil, 'UTF-8')
  @newdoc = Nokogiri::HTML("<div></div>")
  tempdoc = Nokogiri::HTML("<div></div>")

  xmlroot = @doc.at_css("record")
  htmlroot = @newdoc.at_css("div")

  children = xmlroot.children()
  children.each do |child|

      if child['title'] != nil
        if child.children().count == 1

          htmlroot.add_child("<p>"+child['title']+": "+child.text()+"</p>")

        else

          child2 = child.children()
          htmlroot.add_child("<p>"+child['title']+"</p>")
          htmlroot.add_child("<ul></ul>")

          child2.each do |c|

              node = @newdoc.xpath("//ul").last()
              text = c.text.delete " "
              if text.size != 1
                node.add_child("<li>"+c.text()+"</li>")
              end

          end

        end
      end

  end

  mail(:to => "#{user.userName} <#{user.email}>", :subject => "Recurso :"+xmlroot['title'])

  end

end
