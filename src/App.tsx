import React, { useState, useEffect } from 'react';
import { TreeNode, TreeData } from './types/tree';
import { Toolbar } from './components/Toolbar';
import { TreeView } from './components/TreeView';
import { AsciiOutput } from './components/AsciiOutput';
import { HelpDialog } from './components/HelpDialog';
import { Panel } from './styles/components';
import { parseTreeOutput } from './utils/treeParser';
import { generateTreeOutput } from './utils/treeGenerator';

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [treeData, setTreeData] = useState<TreeData | null>(() => {
    // Load from localStorage on initial mount
    const savedContent = localStorage.getItem('asciiTreeContent');
    if (savedContent) {
      try {
        return parseTreeOutput(savedContent);
      } catch (error) {
        console.error('Failed to parse saved content:', error);
      }
    }
    // Return null if no saved content
    return null;
  });

  const handleParseContent = (content: string) => {
    const parsedData = parseTreeOutput(content);
    setTreeData(parsedData);
  };

  const handleNodesChange = (nodes: TreeNode[]) => {
    if (treeData) {
      setTreeData({ ...treeData, nodes });
    } else {
      setTreeData({ root: '', nodes });
    }
  };

  const handleRootChange = (root: string) => {
    if (treeData) {
      setTreeData({ ...treeData, root });
    } else {
      setTreeData({ root, nodes: [] });
    }
  };

  const asciiOutput = treeData ? generateTreeOutput(treeData) : '';

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar onHelpClick={() => setIsHelpOpen(true)} />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-4 p-2 md:p-4 overflow-hidden md:overflow-visible">
        <Panel className="md:h-auto overflow-auto">
          <TreeView
            root={treeData?.root || ''}
            nodes={treeData?.nodes || []}
            onNodesChange={handleNodesChange}
            onRootChange={handleRootChange}
          />
        </Panel>

        <Panel className="md:h-auto overflow-auto">
          <AsciiOutput content={asciiOutput} onParse={handleParseContent} />
        </Panel>
      </div>

      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;
