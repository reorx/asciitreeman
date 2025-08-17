import React, { useState, useEffect } from 'react';
import { Textarea, Button } from '../styles/components';
import { copyToClipboard } from '../utils/clipboard';

const EXAMPLE_TREE_CONTENT = `next-test
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   └── app
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json`;

interface AsciiOutputProps {
  content: string;
  onParse: (content: string) => void;
}

export const AsciiOutput: React.FC<AsciiOutputProps> = ({ content, onParse }) => {
  const [editableContent, setEditableContent] = useState(content);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    setEditableContent(content);
    // Save to localStorage whenever content changes
    if (content) {
      localStorage.setItem('asciiTreeContent', content);
    }
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

  const handleLoadExample = () => {
    setEditableContent(EXAMPLE_TREE_CONTENT);
    localStorage.setItem('asciiTreeContent', EXAMPLE_TREE_CONTENT);
    onParse(EXAMPLE_TREE_CONTENT);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <Textarea
        value={editableContent}
        onChange={(e) => {
          const newContent = e.target.value;
          setEditableContent(newContent);
          // Save manually edited content to localStorage
          localStorage.setItem('asciiTreeContent', newContent);
        }}
        className="flex-1 resize-none"
        placeholder="Paste tree output here and click Parse to load it..."
      />
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={handleParse} disabled={!editableContent.trim()}>
            Parse
          </Button>
          <Button onClick={handleLoadExample}>Load example</Button>
        </div>
        <Button onClick={handleCopy} className="relative">
          {showCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
};
