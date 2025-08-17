import { twc } from 'react-twc';

export const Button = twc.button`
  px-3 py-2 md:px-4 
  bg-blue-500 hover:bg-blue-600 
  text-white font-medium 
  text-sm md:text-base
  rounded-lg 
  transition-colors
  cursor-pointer
  disabled:opacity-50 disabled:cursor-not-allowed
  min-w-[44px] min-h-[44px] md:min-h-0
`;

export const IconButton = twc.button`
  p-1.5 md:p-1 
  text-gray-600 
  rounded 
  transition-colors
  cursor-pointer
  min-w-[36px] min-h-[36px] md:min-w-0 md:min-h-0
`;

export const Panel = twc.div`
  flex-1 
  p-3 md:p-4 
  bg-white 
  border border-gray-200 
  rounded-lg 
  overflow-auto
`;

export const Dialog = twc.div`
  fixed inset-0 
  flex items-center justify-center 
  bg-black/30 backdrop-blur-sm 
  z-50
  cursor-pointer
`;

export const DialogContent = twc.div`
  bg-white 
  rounded-lg 
  p-4 md:p-6 
  max-w-2xl 
  w-full 
  mx-2 md:mx-4
  max-h-[90vh] md:max-h-[80vh]
  overflow-auto
  cursor-auto
`;

export const Input = twc.input`
  w-full 
  px-3 py-2 
  border border-gray-300 
  rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-blue-500
`;

export const Textarea = twc.textarea`
  w-full 
  px-3 py-2 
  border border-gray-300 
  rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-blue-500
  font-mono
`;

export const TreeNodeContainer = twc.div`
  group 
  flex items-center 
  gap-1 
  py-0.5 pr-2 
  hover:bg-gray-100 
  rounded 
  cursor-pointer
  font-mono
  text-sm
`;

export const TreeNodeActions = twc.div`
  ml-auto 
  opacity-100 md:opacity-0 md:group-hover:opacity-100 
  flex gap-0.5 md:gap-1 
  transition-opacity
`;
