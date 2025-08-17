import React from 'react';
import { TreeNode } from '../types/tree';
import { TreeNodeContainer, TreeNodeActions, IconButton } from '../styles/components';

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  onToggle: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onAdd: (nodeId: string, isChild: boolean) => void;
  onRename: (nodeId: string) => void;
  onMove: (nodeId: string, direction: 'up' | 'down') => void;
}

export const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  depth,
  onToggle,
  onDelete,
  onAdd,
  onRename,
  onMove,
}) => {
  const handleClick = () => {
    if (node.children.length > 0) {
      onToggle(node.id);
    }
  };

  return (
    <>
      <TreeNodeContainer style={{ paddingLeft: `${depth * 20}px` }} onClick={handleClick}>
        <span className="flex items-center gap-2">
          {node.children.length > 0 && <span className="text-gray-500">{node.isExpanded ? '▼' : '▶'}</span>}
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
          >
            +
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onAdd(node.id, true);
            }}
            title="Add child"
          >
            ⊕
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onMove(node.id, 'up');
            }}
            title="Move up"
          >
            ↑
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onMove(node.id, 'down');
            }}
            title="Move down"
          >
            ↓
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRename(node.id);
            }}
            title="Rename"
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
            onToggle={onToggle}
            onDelete={onDelete}
            onAdd={onAdd}
            onRename={onRename}
            onMove={onMove}
          />
        ))}
    </>
  );
};
