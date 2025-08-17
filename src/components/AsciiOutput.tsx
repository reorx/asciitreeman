import React, { useState, useEffect } from 'react';
import { Textarea, Button } from '../styles/components';
import { copyToClipboard } from '../utils/clipboard';

interface AsciiOutputProps {
  content: string;
}

export const AsciiOutput: React.FC<AsciiOutputProps> = ({ content }) => {
  const [editableContent, setEditableContent] = useState(content);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleCopy = async () => {
    const success = await copyToClipboard(editableContent);
    if (success) {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Textarea
        value={editableContent}
        onChange={(e) => setEditableContent(e.target.value)}
        className="flex-1 resize-none"
        placeholder="Tree output will appear here..."
      />
      <div className="flex justify-end">
        <Button onClick={handleCopy} className="relative">
          {showCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
};
