module Api
  class ApiController < ApplicationController
    before_filter :require_login!
  end
end
