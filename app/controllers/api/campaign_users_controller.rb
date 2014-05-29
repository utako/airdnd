module Api
  class CampaignUsersController < ApiController
    # questionable
    def index
      @campaign = Campaign.find(params[:campaign_id])
      @campaign_users = @campaign.users
      render :index
    end

    def show
      @campaign = Campaign.find(params[:id])
      @campaign_users = @campaign.users
      @campaign_user = @campaign_users.where({id: params[:user_id]}).first
      if @campaign_user
        render partial: "api/campaign_users/campaign_user", locals: { campaign_user: @campaign_user }
      else
        render json: {}
      end
    end


    private

    def campaign_user_params
      params.require(:campaign_user).permit(:user_id, :campaign_id)
    end
  end
end
