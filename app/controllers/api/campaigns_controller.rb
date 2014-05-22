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

    # def update
    #   @campaign = current_user.campaigns.find(params[:id])
    # 
    #   if params[:newMemberEmail]
    #     email = params[:newMemberEmail]
    #     new_member = User.find_by_email(email)
    #     new_member && !@board.members.include?(new_member) && @board.members << new_member
    #   end
    # 
    #   if @board.update_attributes(board_params)
    #     render partial: "api/boards/board", locals: { board: @board }
    #   else
    #     render json: { errors: @board.errors.full_messages }, status: 422
    #   end
    # end

    def destroy
      current_user.boards.find(params[:id]).try(:destroy)
      render json: {}
    end

    private

    def campaign_params
      params.require(:campaign).permit(:title, :location, :game_style, :game_system, :setting, :public, :description, :rules, :num_members)
    end
  end
end