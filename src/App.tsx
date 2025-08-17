import React, { useState } from 'react';
import { TreeNode, TreeData } from './types/tree';
import { Toolbar } from './components/Toolbar';
import { TreeView } from './components/TreeView';
import { AsciiOutput } from './components/AsciiOutput';
import { Panel } from './styles/components';
import { parseTreeOutput } from './utils/treeParser';
import { generateTreeOutput } from './utils/treeGenerator';

function App() {
  const [treeData, setTreeData] = useState<TreeData>({ root: '.', nodes: [] });

  const handleParseContent = (content: string) => {
    const parsedData = parseTreeOutput(content);
    setTreeData(parsedData);
  };

  const handleNodesChange = (nodes: TreeNode[]) => {
    setTreeData({ ...treeData, nodes });
  };

  const handleRootChange = (root: string) => {
    setTreeData({ ...treeData, root });
  };

  const asciiOutput = generateTreeOutput(treeData);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar />

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <Panel>
          <TreeView
            root={treeData.root}
            nodes={treeData.nodes}
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
