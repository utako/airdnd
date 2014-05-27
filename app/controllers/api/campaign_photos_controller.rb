module Api
  class CampaignPhotosController < ApiController
    # questionable
    def index
      @campaign_photos = CampaignPhoto.where({campaign_id: params[:id]})
      render :index
    end

    def show
      @campaign_photo = CampaignPhoto.find(params[:id])
      render partial: "api/campaigns/campaign_photo", locals: { campaign_photo: @campaign_photo }
    end

    def create
      @campaign_photo = CampaignPhoto.new(campaign_params)
      if @campaign_photo.save
        render partial: "api/campaigns/campaign_photo", locals: { campaign_photo: @campaign_photo }
      else
        render json: { errors: @campaign_photo.errors.full_messages }, status: 422
      end
    end

    # not working yet
    def destroy
      current_user.boards.find(params[:id]).try(:destroy)
      render json: {}
    end

    private

    def campaign_params
      params.require(:campaign_photo).permit(:photo_url, :campaign_id)
    end
  end
end
