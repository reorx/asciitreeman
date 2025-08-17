import React, { useState, useEffect } from 'react';
import { TreeNode, TreeData } from './types/tree';
import { Toolbar } from './components/Toolbar';
import { TreeView } from './components/TreeView';
import { AsciiOutput } from './components/AsciiOutput';
import { Panel } from './styles/components';
import { parseTreeOutput } from './utils/treeParser';
import { generateTreeOutput } from './utils/treeGenerator';

function App() {
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
      <Toolbar />

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <Panel>
          <TreeView
            root={treeData?.root || ''}
            nodes={treeData?.nodes || []}
            onNodesChange={handleNodesChange}
            onRootChange={handleRootChange}
          />
        </Panel>

        <Panel>
          <AsciiOutput content={asciiOutput} onParse={handleParseContent} />
        </Panel>
      </div>
    </div>
  );
}

export default App;
