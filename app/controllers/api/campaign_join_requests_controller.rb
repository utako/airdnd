module Api
  class CampaignJoinRequestsController < ApiController
    # questionable
    def index
      @campaign_join_requests = CampaignJoinRequest.where({campaign_id: params[:id]})
      render :index
    end

    def show
      @campaign_join_request = CampaignJoinRequest.find(params[:id])
      render partial: "api/campaigns/campaign_join_request", locals: { campaign_join_request: @campaign_join_request }
    end

    def create
      @campaign_join_request = CampaignJoinRequest.new(campaign_join_request_params)
      if @campaign_join_request.save
        render partial: "api/campaigns/campaign_join_request", locals: { campaign_join_request: @campaign_join_request }
      else
        render json: { errors: @campaign_join_request.errors.full_messages }, status: 422
      end
    end

    # not working yet
    def destroy
      current_user.boards.find(params[:id]).try(:destroy)
      render json: {}
    end

    private

    def campaign_join_request_params
      params.require(:campaign_join_request).permit(:user_id, :campaign_id, :status)
    end
  end
end
