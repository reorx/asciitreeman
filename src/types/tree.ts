export type NodeType = 'file' | 'directory';

export type TreeNode = {
  id: string;
  name: string;
  type: NodeType;
  children: TreeNode[];
  parentId: string | null;
  isExpanded?: boolean;
};

export type TreeAction = {
  type: 'add' | 'delete' | 'rename' | 'move' | 'addChild' | 'toggle';
  nodeId: string;
  payload?: any;
};
