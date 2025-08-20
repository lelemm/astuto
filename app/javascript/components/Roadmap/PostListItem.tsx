import * as React from 'react';

import { TitleText, UppercaseText, MutedText } from '../common/CustomTexts';

interface Props {
  id: number;
  title: string;
  description?: string;
  boardName: string;
  openPostInNewTab: boolean;
  dragHandleProps?: any;
  feedbackContentDisplay: number; // 0: dont_show_content, 1: show_partial_content, 2: show_full_content
}

const PostListItem = ({id, title, description, boardName, openPostInNewTab, dragHandleProps, feedbackContentDisplay}: Props) => {
  const renderContent = () => {
    if (!description || description.trim() === '' || feedbackContentDisplay === 0) {
      return <MutedText>No description available</MutedText>;
    }
    
    if (feedbackContentDisplay === 1) {
      // Show partial content (30 characters)
      const partialContent = description.length > 30 ? `${description.slice(0, 30)}...` : description;
      return <MutedText>{partialContent}</MutedText>;
    }
    
    if (feedbackContentDisplay === 2) {
      // Show full content
      return <MutedText>{description}</MutedText>;
    }
    
    // Fallback: show description as is
    return <MutedText>{description}</MutedText>;
  };

  return (
    <a 
      href={`/posts/${id}`} 
      className="postLink" 
      target={openPostInNewTab ? '_blank' : '_self'} 
      {...(dragHandleProps || {})}
    >
      <div className="postListItem">
        <TitleText>{title}</TitleText>
        {renderContent()}
        <UppercaseText>{boardName}</UppercaseText>
      </div>
    </a>
  );
};

export default PostListItem;