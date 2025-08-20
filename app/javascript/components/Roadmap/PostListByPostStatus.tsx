import * as React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import PostList from './PostList';
import { TitleText } from '../common/CustomTexts';

import IPostStatus from '../../interfaces/IPostStatus';
import IPostJSON from '../../interfaces/json/IPost';
import IBoard from '../../interfaces/IBoard';

interface Props {
  postStatus: IPostStatus;
  posts: Array<IPostJSON>;
  boards: Array<IBoard>;
  openPostsInNewTab: boolean;
  dragAndDropEnabled?: boolean;
  feedbackContentDisplay: number; // 0: dont_show_content, 1: show_partial_content, 2: show_full_content
}

const PostListByPostStatus = ({ postStatus, posts, boards, openPostsInNewTab, dragAndDropEnabled = false, feedbackContentDisplay }: Props) => (
  <div className="roadmapColumn">
    <div className="columnHeader"
      style={{backgroundColor: postStatus.color}}>
      <div className="columnTitle"><TitleText>{postStatus.name}</TitleText></div>
    </div>
    {dragAndDropEnabled ? (
      <Droppable droppableId={postStatus.id.toString()}>
        {(provided, snapshot) => (
          <div 
            className={`scrollContainer ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`postListContainer ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              <PostList
                posts={posts}
                boards={boards}
                openPostsInNewTab={openPostsInNewTab}
                dragAndDropEnabled={dragAndDropEnabled}
                feedbackContentDisplay={feedbackContentDisplay}
              />
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    ) : (
      <div className="scrollContainer">
        <div className="postListContainer">
          <PostList
            posts={posts}
            boards={boards}
            openPostsInNewTab={openPostsInNewTab}
            dragAndDropEnabled={dragAndDropEnabled}
            feedbackContentDisplay={feedbackContentDisplay}
          />
        </div>
      </div>
    )}
  </div>
);

export default PostListByPostStatus;