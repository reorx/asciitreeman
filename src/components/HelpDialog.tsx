import React, { useState } from 'react';
import { helpContent } from '../data/helpContent';
import {
  Dialog,
  HelpDialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  CloseButton,
  LanguageButton,
} from '../styles/components';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  if (!isOpen) return null;

  const content = helpContent[language];

  return (
    <Dialog onClick={onClose}>
      <HelpDialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{language === 'en' ? 'Help' : '帮助'}</DialogTitle>
          <div className="flex items-center gap-3">
            <LanguageButton onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>
              {language === 'en' ? '中文' : 'English'}
            </LanguageButton>
            <CloseButton onClick={onClose} aria-label="Close">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          </div>
        </DialogHeader>

        <DialogBody>
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{content.purpose}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{content.operations.title}</h3>
            <ol className="list-decimal list-inside space-y-2">
              {content.operations.items.map((item, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{content.shortcuts.title}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full">
                <tbody>
                  {content.shortcuts.items.map((shortcut, index) => (
                    <tr key={index} className="border-b border-gray-200 last:border-0">
                      <td className="py-2 pr-4">
                        <kbd className="px-2 py-1 text-sm font-mono bg-white border border-gray-300 rounded shadow-sm">
                          {shortcut.key}
                        </kbd>
                      </td>
                      <td className="py-2 text-gray-700">{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{language === 'en' ? 'Tips' : '提示'}</h3>
            <ul className="list-disc list-inside space-y-2">
              {content.tips.map((tip, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </DialogBody>
      </HelpDialogContent>
    </Dialog>
  );
};
