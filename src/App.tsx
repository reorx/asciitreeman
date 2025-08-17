import React, { useState } from 'react';
import { TreeNode } from './types/tree';
import { Toolbar } from './components/Toolbar';
import { TreeView } from './components/TreeView';
import { AsciiOutput } from './components/AsciiOutput';
import { LoadDialog } from './components/LoadDialog';
import { Panel } from './styles/components';
import { parseTreeOutput } from './utils/treeParser';
import { generateTreeOutput } from './utils/treeGenerator';

function App() {
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  const handleLoadContent = (content: string) => {
    const parsedNodes = parseTreeOutput(content);
    setTreeNodes(parsedNodes);
  };

  const handleNodesChange = (nodes: TreeNode[]) => {
    setTreeNodes(nodes);
  };

  const asciiOutput = generateTreeOutput(treeNodes);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar onLoadClick={() => setIsLoadDialogOpen(true)} />

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <Panel>
          <TreeView nodes={treeNodes} onNodesChange={handleNodesChange} />
        </Panel>

        <Panel>
          <AsciiOutput content={asciiOutput} />
        </Panel>
      </div>

      <LoadDialog isOpen={isLoadDialogOpen} onLoad={handleLoadContent} onClose={() => setIsLoadDialogOpen(false)} />
    </div>
  );
}

export default App;
