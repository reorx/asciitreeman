import React, { useState } from 'react';
import { Dialog, DialogContent, Textarea, Button } from '../styles/components';

interface LoadDialogProps {
  isOpen: boolean;
  onLoad: (content: string) => void;
  onClose: () => void;
}

export const LoadDialog: React.FC<LoadDialogProps> = ({ isOpen, onLoad, onClose }) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleLoad = () => {
    if (content.trim()) {
      onLoad(content);
      setContent('');
      onClose();
    }
  };

  return (
    <Dialog onClick={onClose}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Load Tree Output</h2>
        <p className="text-gray-600 mb-4">Paste the output from the tree command below:</p>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`.\n├── folder1\n│   ├── file1.txt\n│   └── file2.txt\n└── folder2\n    └── file3.txt`}
          rows={15}
          className="resize-none"
        />
        <div className="flex gap-2 mt-4 justify-end">
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleLoad} disabled={!content.trim()}>
            Load
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
