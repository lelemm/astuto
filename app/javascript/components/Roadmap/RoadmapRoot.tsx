import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Roadmap from './index';

import createStoreHelper from '../../helpers/createStore';
import { State } from '../../reducers/rootReducer';
import IPostStatus from '../../interfaces/IPostStatus';
import IPostJSON from '../../interfaces/json/IPost';
import IBoard from '../../interfaces/IBoard';
import { UserRoles } from '../../interfaces/IUser';

interface Props {
  postStatuses: Array<IPostStatus>;
  posts: Array<IPostJSON>;
  boards: Array<IBoard>;
  isEmbedded: boolean;
  authenticityToken: string;
  dragAndDropEnabled: boolean;
  feedbackContentDisplay: number;
  isLoggedIn: boolean;
  currentUserRole: UserRoles | null;
}

class RoadmapRoot extends React.Component<Props> {
  store: Store<State, any>;
  
  constructor(props: Props) {
    super(props);

    this.store = createStoreHelper();
  }

  render() {
    return (
      <Provider store={this.store}>
        <Roadmap
          postStatuses={this.props.postStatuses}
          posts={this.props.posts}
          boards={this.props.boards}
          isEmbedded={this.props.isEmbedded}
          authenticityToken={this.props.authenticityToken}
          dragAndDropEnabled={this.props.dragAndDropEnabled}
          feedbackContentDisplay={this.props.feedbackContentDisplay}
          isLoggedIn={this.props.isLoggedIn}
          currentUserRole={this.props.currentUserRole}
        />
      </Provider>
    );
  }
}

export default RoadmapRoot;