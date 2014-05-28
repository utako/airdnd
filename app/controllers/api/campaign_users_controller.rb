module Api
  class CampaignUsersController < ApiController
    # questionable
    def index
      @campaign = Campaign.find(params[:campaign_id])
      @campaign_users = @campaign.users
      render :index
    end

    def show
      @campaign = Campaign.find(params[:campaign_id])
      @campaign_users = @campaign.users
      @campaign_user = @campaign_users.where({user_id: params[:user_id]})
      render partial: "api/campaign_users/campaign_user", locals: { campaign_user: @campaign_user }
    end


    private

    def campaign_user_params
      params.require(:campaign_user).permit(:user_id, :campaign_id)
    end
  end
end
