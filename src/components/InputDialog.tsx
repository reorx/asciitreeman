import React, { useState } from 'react';
import { Dialog, DialogContent, Input, Button } from '../styles/components';

interface InputDialogProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export const InputDialog: React.FC<InputDialogProps> = ({
  isOpen,
  title,
  placeholder = '',
  initialValue = '',
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Dialog onClick={onCancel}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
        />
        <div className="flex gap-2 mt-4 justify-end">
          <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!value.trim()}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
