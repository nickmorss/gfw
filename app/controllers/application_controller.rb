class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception

  before_action :check_browser, if: proc { Rails.env.production? }
  before_action :cache_keys

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def cache_keys
    @cache_keys = $redis.keys('*')
  end

  private

    def check_browser
      unless UserAgentValidator.user_agent_supported? request.user_agent
        redirect_to "/notsupportedbrowser"
      end
    end

end
