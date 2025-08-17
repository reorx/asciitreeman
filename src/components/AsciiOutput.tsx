import React, { useState, useEffect } from 'react';
import { Textarea, Button } from '../styles/components';
import { copyToClipboard } from '../utils/clipboard';

interface AsciiOutputProps {
  content: string;
  onParse: (content: string) => void;
}

export const AsciiOutput: React.FC<AsciiOutputProps> = ({ content, onParse }) => {
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

  const handleParse = () => {
    if (editableContent.trim()) {
      onParse(editableContent);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Textarea
        value={editableContent}
        onChange={(e) => setEditableContent(e.target.value)}
        className="flex-1 resize-none"
        placeholder="Paste tree output here and click Parse to load it..."
      />
      <div className="flex justify-between">
        <Button onClick={handleParse} disabled={!editableContent.trim()}>
          Parse
        </Button>
        <Button onClick={handleCopy} className="relative">
          {showCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
};
