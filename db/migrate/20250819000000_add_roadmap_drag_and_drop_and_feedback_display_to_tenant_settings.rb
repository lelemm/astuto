class AddRoadmapDragAndDropAndFeedbackDisplayToTenantSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :tenant_settings, :roadmap_drag_and_drop_enabled, :boolean, null: false, default: false
    add_column :tenant_settings, :roadmap_feedback_content_display, :integer, null: false, default: 0
  end
end 