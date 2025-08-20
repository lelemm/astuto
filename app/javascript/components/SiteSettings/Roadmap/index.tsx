import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import RoadmapSiteSettings from '../../../containers/RoadmapSiteSettings';

import createStoreHelper from '../../../helpers/createStore';
import { State } from '../../../reducers/rootReducer';
import { TENANT_UPDATE_SUCCESS } from '../../../actions/Tenant/updateTenant';

interface Props {
  dragAndDropEnabled: boolean;
  feedbackContentDisplay: number;
  embeddedRoadmapUrl: string;
  authenticityToken: string;
}

class RoadmapSiteSettingsRoot extends React.Component<Props> {
  store: Store<State, any>;
  
  constructor(props: Props) {
    super(props);

    this.store = createStoreHelper();
    
    // Initialize tenant state with current settings
    this.store.dispatch({
      type: TENANT_UPDATE_SUCCESS,
      tenant: {
        id: 0,
        site_name: '',
        site_logo: '',
        brand_display_setting: '',
        locale: '',
        tenant_setting: {
          roadmap_drag_and_drop_enabled: props.dragAndDropEnabled,
          roadmap_feedback_content_display: props.feedbackContentDisplay,
        }
      }
    });
  }

  render() {
    return (
      <Provider store={this.store}>
        <RoadmapSiteSettings
          dragAndDropEnabled={this.props.dragAndDropEnabled}
          feedbackContentDisplay={this.props.feedbackContentDisplay}
          embeddedRoadmapUrl={this.props.embeddedRoadmapUrl}
          authenticityToken={this.props.authenticityToken}
        />
      </Provider>
    );
  }
}

export default RoadmapSiteSettingsRoot;