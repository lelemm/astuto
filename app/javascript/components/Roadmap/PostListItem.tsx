import * as React from 'react';

import { TitleText, UppercaseText, MutedText } from '../common/CustomTexts';
import ReactMarkdown from 'react-markdown';

interface Props {
  id: number;
  title: string;
  description?: string;
  boardName: string;
  openPostInNewTab: boolean;
  dragHandleProps?: any;
  feedbackContentDisplay: number; // 0: dont_show_content, 1: show_partial_content, 2: show_full_content
}

// Utility function to safely truncate markdown content
const truncateMarkdownSafely = (content: string, maxLength: number): string => {
  if (content.length <= maxLength) {
    return content;
  }

  // Find a safe truncation point by looking for word boundaries
  let safeLength = maxLength;

  // Look for incomplete markdown tags and adjust the length
  const markdownPatterns = [
    /\*\*[^*]*$/,           // Incomplete bold (**text)
    /\*[^*]*$/,             // Incomplete italic (*text)
    /_[^_]*$/,              // Incomplete underline (_text)
    /~~[^~]*$/,             // Incomplete strikethrough (~text)
    /`[^`]*$/,              // Incomplete inline code (`text)
    /```[^`]*$/,            // Incomplete code block (```text)
    /\[[^\]]*$/,            // Incomplete link text ([text)
    /\[[^\]]*\]\([^)]*$/,  // Incomplete link URL ([text](url)
  ];

  // Check if we're in the middle of any markdown pattern
  const truncatedContent = content.slice(0, maxLength);
  let needsAdjustment = false;

  for (const pattern of markdownPatterns) {
    if (pattern.test(truncatedContent)) {
      needsAdjustment = true;
      break;
    }
  }

  if (needsAdjustment) {
    // Find the last complete word boundary
    const lastSpaceIndex = truncatedContent.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.7) { // Only adjust if we're not too far back
      safeLength = lastSpaceIndex;
    } else {
      // If we can't find a good word boundary, truncate at a character that's not part of a markdown tag
      for (let i = maxLength - 1; i >= maxLength * 0.5; i--) {
        const char = content[i];
        if (char === ' ' || char === '.' || char === ',' || char === '!' || char === '?') {
          safeLength = i + 1;
          break;
        }
      }
    }
  }

  return content.slice(0, safeLength) + '...';
};

const PostListItem = ({ id, title, description, boardName, openPostInNewTab, dragHandleProps, feedbackContentDisplay }: Props) => {
  const renderContent = () => {
    if (!description || description.trim() === '' || feedbackContentDisplay === 0) {
      return <MutedText>No description available</MutedText>;
    }

    if (feedbackContentDisplay === 1) {
      // Show partial content (30 characters) with safe truncation
      const partialContent = truncateMarkdownSafely(description, 30);
      return <ReactMarkdown
        className="mutedText"
        disallowedTypes={['image', 'html']}
        unwrapDisallowed
      >
        {partialContent}
      </ReactMarkdown>;
    }

    if (feedbackContentDisplay === 2) {
      // Show full content
      return <ReactMarkdown
        className="mutedText"
        disallowedTypes={['image', 'html']}
        unwrapDisallowed
      >
        {description}
      </ReactMarkdown>;
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