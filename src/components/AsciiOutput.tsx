import React, { useState, useEffect } from 'react';
import { Textarea, Button } from '../styles/components';
import { copyToClipboard } from '../utils/clipboard';

const EXAMPLE_TREE_CONTENT = `next-app
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
    <div className="flex flex-col h-full gap-3 md:gap-4">
      <Textarea
        value={editableContent}
        onChange={(e) => {
          const newContent = e.target.value;
          setEditableContent(newContent);
          // Save manually edited content to localStorage
          localStorage.setItem('asciiTreeContent', newContent);
        }}
        className="flex-1 resize-none min-h-[200px] md:min-h-0"
        placeholder="Paste tree output here and click Parse to load it..."
      />
      <div className="flex gap-1.5 md:gap-2 justify-between">
        <div className="flex gap-1.5 md:gap-2 flex-1 min-w-0">
          <Button onClick={handleParse} disabled={!editableContent.trim()} className="flex-1 min-w-0">
            Parse
          </Button>
          <Button onClick={handleLoadExample} className="flex-1 min-w-0 text-xs md:text-sm">
            Load example
          </Button>
        </div>
        <Button onClick={handleCopy} className="relative flex-shrink-0">
          {showCopied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
};
