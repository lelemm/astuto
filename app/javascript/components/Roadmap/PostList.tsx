import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import I18n from 'i18n-js';

import PostListItem from './PostListItem';
import { CenteredMutedText } from '../common/CustomTexts';

import IPostJSON from '../../interfaces/json/IPost';
import IBoard from '../../interfaces/IBoard';

interface Props {
  posts: Array<IPostJSON>;
  boards: Array<IBoard>;
  openPostsInNewTab: boolean;
  dragAndDropEnabled?: boolean;
  feedbackContentDisplay: number; // 0: dont_show_content, 1: show_partial_content, 2: show_full_content
}

const PostList = ({ posts, boards, openPostsInNewTab, dragAndDropEnabled = false, feedbackContentDisplay }: Props) => (
  <div className="postList">
    {
      posts.length > 0 ?
        posts.map((post, i) => (
          <React.Fragment key={post.id}>
            {dragAndDropEnabled ? (
              <Draggable draggableId={post.id.toString()} index={i}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`postListItemWrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                  >
                    <PostListItem
                      id={post.id}
                      title={post.title}
                      description={post.description}
                      boardName={boards.find(board => board.id === post.board_id).name}
                      openPostInNewTab={openPostsInNewTab}
                      dragHandleProps={provided.dragHandleProps}
                      feedbackContentDisplay={feedbackContentDisplay}
                    />
                  </div>
                )}
              </Draggable>
            ) : (
              <PostListItem
                id={post.id}
                title={post.title}
                description={post.description}
                boardName={boards.find(board => board.id === post.board_id).name}
                openPostInNewTab={openPostsInNewTab}
                feedbackContentDisplay={feedbackContentDisplay}
              />
            )}
          </React.Fragment>
        ))
      :
        <CenteredMutedText>{ I18n.t('board.posts_list.empty') }</CenteredMutedText>
    }
  </div>
);

export default PostList;