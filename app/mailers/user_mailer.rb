class UserMailer < ActionMailer::Base

  default :from => "concierge.g06@gmail.com"

  def registration_confirmation(user, num)
    @user = user
    @num = num
    mail(:to => "#{user.userName} <#{user.email}>", :subject => "Registered")
  end

  def sendres(user, url)

  @doc = Nokogiri::XML(open(url), nil, 'UTF-8')
  @newdoc = Nokogiri::HTML("<div></div>")

  xmlroot = @doc.at_css("record")
  htmlroot = @newdoc.at_css("div")

  children = root.children()

  children.each do |child|

      if child.children().empty?

        htmlroot.add_child("<p>"+child['title']+": "+child.text()+"</p>")

      else

        child2 = child.children()
        htmlroot.add_child("<p>"+child['title']+": "+child.text()+"</p>")
        node = Nokogiri::HTML::Node("<ul></ul>")

        child2.each do |c|

            node.add_child("<li>"+c.text()+"</li>")

        end

        htmlroot.add_child(node)

      end

  end

  mail(:to => "#{user.userName} <#{user.mail}>", :subject => "Recurso :"+title)

  end

end
