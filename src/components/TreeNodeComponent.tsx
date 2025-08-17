import React from 'react';
import { TreeNode } from '../types/tree';
import { TreeNodeContainer, TreeNodeActions, IconButton } from '../styles/components';

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  isActive?: boolean;
  activeNodeId?: string | null;
  onToggle: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onAdd: (nodeId: string, isChild: boolean) => void;
  onRename: (nodeId: string) => void;
  onMove: (nodeId: string, direction: 'up' | 'down') => void;
  onNodeClick: (nodeId: string) => void;
}

export const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  depth,
  isActive = false,
  activeNodeId,
  onToggle,
  onDelete,
  onAdd,
  onRename,
  onMove,
  onNodeClick,
}) => {
  const handleClick = () => {
    onNodeClick(node.id);
    if (node.children.length > 0) {
      onToggle(node.id);
    }
  };

  return (
    <>
      <TreeNodeContainer
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={handleClick}
        className={isActive ? 'outline outline-2 outline-blue-500 outline-offset-[-2px]' : ''}
      >
        <span className="flex items-center gap-2">
          {node.children.length > 0 && (
            <span className="text-gray-500 inline-block w-3 text-center">{node.isExpanded ? '▼' : '▶'}</span>
          )}
          <span className={node.type === 'directory' ? 'font-medium' : ''}>{node.name}</span>
        </span>

        <TreeNodeActions>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            title="Delete"
            className="hover:bg-red-100 hover:text-red-600"
          >
            ×
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onAdd(node.id, false);
            }}
            title="Add sibling"
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            +
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onAdd(node.id, true);
            }}
            title="Add child"
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            ⊕
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onMove(node.id, 'up');
            }}
            title="Move up"
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            ↑
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onMove(node.id, 'down');
            }}
            title="Move down"
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            ↓
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRename(node.id);
            }}
            title="Rename"
            className="hover:bg-blue-100 hover:text-blue-700"
          >
            r
          </IconButton>
        </TreeNodeActions>
      </TreeNodeContainer>

      {node.children.length > 0 &&
        node.isExpanded &&
        node.children.map((child) => (
          <TreeNodeComponent
            key={child.id}
            node={child}
            depth={depth + 1}
            isActive={activeNodeId === child.id}
            activeNodeId={activeNodeId}
            onToggle={onToggle}
            onDelete={onDelete}
            onAdd={onAdd}
            onRename={onRename}
            onMove={onMove}
            onNodeClick={onNodeClick}
          />
        ))}
    </>
  );
};
