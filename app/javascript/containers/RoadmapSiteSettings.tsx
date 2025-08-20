import { connect } from "react-redux";

import RoadmapSiteSettingsP from "../components/SiteSettings/Roadmap/RoadmapSiteSettingsP";

import { requestPostStatuses } from "../actions/PostStatus/requestPostStatuses";
import { State } from "../reducers/rootReducer";
import { updatePostStatus } from "../actions/PostStatus/updatePostStatus";
import { updateTenant } from "../actions/Tenant/updateTenant";

const mapStateToProps = (state: State, ownProps: any) => {
  const rawFeedbackDisplay =
    (state.tenant.data?.tenant_setting?.roadmap_feedback_content_display as any) ??
    ownProps.feedbackContentDisplay;

  const feedbackContentDisplay =
    typeof rawFeedbackDisplay === 'string'
      ? ['dont_show_content', 'show_partial_content', 'show_full_content'].indexOf(rawFeedbackDisplay)
      : rawFeedbackDisplay;

  return {
    postStatuses: state.postStatuses,
    settingsAreUpdating: state.siteSettings.roadmap.areUpdating,
    settingsError: state.siteSettings.roadmap.error,
    // Use Redux state if available, otherwise fallback to initial props
    dragAndDropEnabled:
      state.tenant.data?.tenant_setting?.roadmap_drag_and_drop_enabled ?? ownProps.dragAndDropEnabled,
    feedbackContentDisplay,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  requestPostStatuses() {
    dispatch(requestPostStatuses());
  },

  updatePostStatus(id: number, showInRoadmap: boolean, onComplete: Function, authenticityToken: string) {
    dispatch(updatePostStatus({id, showInRoadmap, authenticityToken})).then(() => {
      onComplete();
    });
  },

  updateRoadmapSettings(dragAndDropEnabled: boolean, feedbackContentDisplay: number, onComplete: Function, authenticityToken: string) {
    dispatch(updateTenant({
      tenantSetting: {
        roadmap_drag_and_drop_enabled: dragAndDropEnabled,
        roadmap_feedback_content_display: feedbackContentDisplay,
      },
      authenticityToken,
    })).then((res: any) => {
      onComplete(res);
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoadmapSiteSettingsP);