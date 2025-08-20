class SiteSettingsController < ApplicationController
  include ApplicationHelper

  before_action :authenticate_admin
  before_action :ensure_tenant_data
  before_action :set_page_title
  
  def general
  end

  def authentication
  end

  def boards
  end

  def post_statuses
  end

  def roadmap
  end

  def webhooks
  end

  def invitations
    @invitations = Invitation.all.order(updated_at: :desc)
  end

  def appearance
  end

  private

    def ensure_tenant_data
      @tenant = Current.tenant || Tenant.first
      @tenant_setting = @tenant.tenant_setting || @tenant.build_tenant_setting
    end

    def set_page_title
      @page_title = t('header.menu.site_settings')
    end
end