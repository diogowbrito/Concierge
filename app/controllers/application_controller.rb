class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :get_address, :mobile_agent?, :mobile?

  before_filter :session_expiry, :except => [:login, :logout]
  before_filter :update_activity_time, :except => [:login, :logout]

  private

  def get_address
    port = request.port
    host = request.host
    return "http://"+host.to_s+":"+port.to_s+"/"
  end

  def current_user

    if session[:user_id] == nil
      reset_session
    else
      begin
        User.find(session[:user_id])
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
      rescue ActiveRecord::RecordNotFound
        reset_session
      end
    end

  end

  def session_expiry

    if current_user != nil then
      id = session[:user_id]
      begin
        User.find(id)
        @time_left = (session[:expires_at] - Time.now).to_i
        unless @time_left > 0
          old_user = User.find(id)
          if old_user.notAnonymus == nil then
            histories = old_user.histories
            old_user.destroy
            histories.each do |h|
              h.destroy
            end
          end
          reset_session
        end
      rescue ActiveRecord::RecordNotFound
        reset_session
      end
    end
  end

  def update_activity_time
    session[:expires_at] = 30.minutes.from_now
  end

  def mobile_agent?
    request.user_agent =~ /Mobile|webOS/
  end

  def mobile?
    case
      when !params[:mobile].nil?
        ActiveRecord::ConnectionAdapters::Column.value_to_boolean(params[:mobile])
      when !session[:mobile].nil?
        session[:mobile]
      else
        mobile_agent?
    end
  end

end
