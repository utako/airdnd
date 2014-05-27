module Api
  class CampaignsController < ApiController
    def index
      @campaigns = Campaign.all
      render :index
    end

    def show
      @campaign = Campaign.find(params[:id])
      render partial: "api/campaigns/campaign", locals: { campaign: @campaign }
    end

    def create
      @campaign = current_user.hosted_campaigns.build(campaign_params)
      if @campaign.save
        render partial: "api/campaigns/campaign", locals: { campaign: @campaign }
      else
        render json: { errors: @campaign.errors.full_messages }, status: 422
      end
    end

    def update
      @campaign = current_user.hosted_campaigns.find(params[:id])

      if @campaign.update_attributes(campaign_params)
        render partial: "api/campaigns/campaign", locals: { campaign: @campaign }
      else
        render json: { errors: @campaign.errors.full_messages }, status: 422
      end
    end

    def destroy
      current_user.boards.find(params[:id]).try(:destroy)
      render json: {}
    end

    private

    def campaign_params
      params.require(:campaign).permit(:title, :location, :game_style, :game_system, :setting, :public, :description, :rules, :num_members, :start_date, :end_date)
    end
  end
end
