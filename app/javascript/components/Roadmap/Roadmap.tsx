import * as React from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import PostListByPostStatus from './PostListByPostStatus';
import MultiSelect, { MultiSelectOption } from '../common/MultiSelect';

import IPostStatus from '../../interfaces/IPostStatus';
import IPostJSON from '../../interfaces/json/IPost';
import IBoard from '../../interfaces/IBoard';
import { UserRoles, USER_ROLE_MODERATOR, USER_ROLE_ADMIN, USER_ROLE_OWNER } from '../../interfaces/IUser';
import { updatePost } from '../../actions/Post/updatePost';

interface Props {
  postStatuses: Array<IPostStatus>;
  posts: Array<IPostJSON>;
  boards: Array<IBoard>;
  isEmbedded: boolean;
  dragAndDropEnabled?: boolean;
  feedbackContentDisplay: number; // 0: dont_show_content, 1: show_partial_content, 2: show_full_content
  authenticityToken: string;
  isLoggedIn: boolean;
  currentUserRole: UserRoles | null;
  updatePost?: (
    postId: number,
    title: string,
    description: string,
    boardId: number,
    postStatusId: number,
    authenticityToken: string,
  ) => Promise<any>;
}

interface State {
  selectedBoards: Array<MultiSelectOption>;
  selectedPostStatuses: Array<MultiSelectOption>;
  localPosts: Array<IPostJSON>;
}

class Roadmap extends React.Component<Props, State> {
  private showBoardFilter: boolean;
  private showPostStatusFilter: boolean;
  private boardsToShow: Array<number>;
  private postStatusesToShow: Array<number>;

  constructor(props: Props) {
    super(props);

    // read query params
    const queryParams = new URLSearchParams(window.location.search);
    this.showBoardFilter = queryParams.get('show_board_filter') !== 'false';
    this.showPostStatusFilter = queryParams.get('show_status_filter') !== 'false';
    this.boardsToShow = queryParams.get('show_boards') ? queryParams.get('show_boards').split(',').map(Number) : props.boards.map(board => board.id);
    this.postStatusesToShow = queryParams.get('show_statuses') ? queryParams.get('show_statuses').split(',').map(Number) : props.postStatuses.map(postStatus => postStatus.id);

    this.state = {
      selectedBoards: props.boards.filter(board => this.boardsToShow.includes(board.id)).map(board => ({ value: board.id, label: board.name })),
      selectedPostStatuses: props.postStatuses.filter(postStatus => this.postStatusesToShow.includes(postStatus.id)).map(postStatus => ({ value: postStatus.id, label: postStatus.name, color: postStatus.color })),
      localPosts: [...props.posts], // Create a local copy of posts
    };

    this.setSelectedBoards = this.setSelectedBoards.bind(this);
    this.setSelectedPostStatuses = this.setSelectedPostStatuses.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    // Update local posts when props change (e.g., on page refresh)
    if (prevProps.posts !== this.props.posts) {
      this.setState({ localPosts: [...this.props.posts] });
    }
  }

  setSelectedBoards(selectedBoards: Array<MultiSelectOption>) {
    this.setState({
      ...this.state,
      selectedBoards,
    });
  }

  setSelectedPostStatuses(selectedPostStatuses: Array<MultiSelectOption>) {
    this.setState({
      ...this.state,
      selectedPostStatuses,
    });
  }

  handleDragEnd = (result) => {
    if (!result.destination || !this.props.updatePost) return;
    
    // Check if user has permission to change post status
    if (!this.canUserChangePostStatus()) {
      console.warn('User does not have permission to change post status');
      return;
    }
    
    const { draggableId, destination } = result;
    const postId = parseInt(draggableId);
    const newPostStatusId = parseInt(destination.droppableId);
    
    // Find the current post data
    const currentPost = this.state.localPosts.find(post => post.id === postId);
    if (!currentPost) {
      console.error(`Post ${postId} not found`);
      return;
    }

    // Optimistically update the local state immediately
    const updatedPosts = this.state.localPosts.map(post => 
      post.id === postId 
        ? { ...post, post_status_id: newPostStatusId }
        : post
    );
    
    this.setState({ localPosts: updatedPosts });

    // Call updatePost with current post data and new status
    this.props.updatePost(
      postId,
      currentPost.title,
      currentPost.description || '',
      currentPost.board_id,
      newPostStatusId,
      this.props.authenticityToken
    ).catch(error => {
      // If the update fails, revert the local state
      console.error('Failed to update post status:', error);
      this.setState({ localPosts: [...this.props.posts] });
    });
  }

  canUserChangePostStatus(): boolean {
    const { isLoggedIn, currentUserRole, dragAndDropEnabled } = this.props;
    
    // First check if drag and drop is globally enabled
    if (!dragAndDropEnabled) {
      return false;
    }
    
    // Then check if user is logged in and has appropriate role
    if (!isLoggedIn || !currentUserRole) {
      return false;
    }
    
    // Only moderator, admin, and owner can change post status
    return currentUserRole === USER_ROLE_MODERATOR || 
           currentUserRole === USER_ROLE_ADMIN || 
           currentUserRole === USER_ROLE_OWNER;
  }

  render() {
    const { postStatuses, boards, dragAndDropEnabled = false, feedbackContentDisplay } = this.props;
    const { selectedBoards, selectedPostStatuses, localPosts } = this.state;

    const boardSelectOptions = boards.filter(board => this.boardsToShow.includes(board.id)).map(board => ({ value: board.id, label: board.name }));
    const postStatusSelectOptions = postStatuses.filter(postStatus => this.postStatusesToShow.includes(postStatus.id)).map(postStatus => ({ value: postStatus.id, label: postStatus.name, color: postStatus.color }));

    // Filter by board
    const filteredPosts = localPosts.filter(post =>
      selectedBoards.some(selectedBoard => selectedBoard.value === post.board_id)
    );

    // Filter by post status
    const filteredPostStatuses = postStatuses.filter(postStatus => 
      selectedPostStatuses.some(selectedPostStatus => selectedPostStatus.value === postStatus.id)
    );

    // Determine if drag and drop should be enabled for this user
    const userDragAndDropEnabled = this.canUserChangePostStatus();

    const roadmapContent = (
      <div className="roadmapColumns">
        {filteredPostStatuses.map((postStatus, i) => (
          <PostListByPostStatus
            postStatus={postStatus}
            posts={filteredPosts.filter(post => post.post_status_id === postStatus.id)}
            boards={boards}
            openPostsInNewTab={this.props.isEmbedded}
            dragAndDropEnabled={userDragAndDropEnabled}
            feedbackContentDisplay={feedbackContentDisplay}
            key={i}
          />
        ))}
      </div>
    );

    return (
      <div className="roadmap">
        <div className="filters">
          {
            this.showBoardFilter &&
              <MultiSelect
                options={boardSelectOptions}
                defaultValue={selectedBoards}
                onChange={this.setSelectedBoards}
                className="boardSelect"
              />
          }

          {
            this.showPostStatusFilter &&
              <MultiSelect
                options={postStatusSelectOptions}
                defaultValue={selectedPostStatuses}
                onChange={this.setSelectedPostStatuses}
                className="postStatusSelect"
              />
          }
        </div>

        <DragDropContext onDragEnd={this.handleDragEnd}>
          {roadmapContent}
        </DragDropContext>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updatePost(
    postId: number,
    title: string,
    description: string,
    boardId: number,
    postStatusId: number,
    authenticityToken: string,
  ) {
    return dispatch(updatePost(postId, title, description, boardId, postStatusId, authenticityToken));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(Roadmap);