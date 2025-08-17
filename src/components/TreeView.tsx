import React, { useState, useCallback } from 'react';
import { TreeNode } from '../types/tree';
import { TreeNodeComponent } from './TreeNodeComponent';
import { InputDialog } from './InputDialog';
import { Input } from '../styles/components';

interface TreeViewProps {
  root: string;
  nodes: TreeNode[];
  onNodesChange: (nodes: TreeNode[]) => void;
  onRootChange: (root: string) => void;
}

export const TreeView: React.FC<TreeViewProps> = ({ root, nodes, onNodesChange, onRootChange }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: 'add' | 'rename' | null;
    nodeId: string | null;
    isChild: boolean;
  }>({
    isOpen: false,
    action: null,
    nodeId: null,
    isChild: false,
  });

  const findNodeAndParent = (
    nodes: TreeNode[],
    nodeId: string,
    parent: TreeNode | null = null,
  ): { node: TreeNode | null; parent: TreeNode | null; siblings: TreeNode[] } => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return { node, parent, siblings: nodes };
      }
      if (node.children.length > 0) {
        const result = findNodeAndParent(node.children, nodeId, node);
        if (result.node) {
          return result;
        }
      }
    }
    return { node: null, parent: null, siblings: [] };
  };

  const handleToggle = useCallback(
    (nodeId: string) => {
      const toggleNode = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map((node) => {
          if (node.id === nodeId) {
            return { ...node, isExpanded: !node.isExpanded };
          } else if (node.children.length > 0) {
            return { ...node, children: toggleNode(node.children) };
          }
          return node;
        });
      };
      onNodesChange(toggleNode([...nodes]));
    },
    [nodes, onNodesChange],
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      const deleteNode = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList
          .filter((node) => node.id !== nodeId)
          .map((node) => ({
            ...node,
            children: deleteNode(node.children),
          }));
      };
      onNodesChange(deleteNode([...nodes]));
    },
    [nodes, onNodesChange],
  );

  const handleAdd = useCallback((nodeId: string, isChild: boolean) => {
    setDialogState({
      isOpen: true,
      action: 'add',
      nodeId,
      isChild,
    });
  }, []);

  const handleRename = useCallback((nodeId: string) => {
    setDialogState({
      isOpen: true,
      action: 'rename',
      nodeId,
      isChild: false,
    });
  }, []);

  const handleMove = useCallback(
    (nodeId: string, direction: 'up' | 'down') => {
      const moveNode = (nodeList: TreeNode[]): TreeNode[] => {
        const nodesCopy = [...nodeList];
        const index = nodesCopy.findIndex((n) => n.id === nodeId);

        if (index === -1) {
          return nodesCopy.map((node) => ({
            ...node,
            children: moveNode(node.children),
          }));
        }

        if (direction === 'up' && index > 0) {
          [nodesCopy[index - 1], nodesCopy[index]] = [nodesCopy[index], nodesCopy[index - 1]];
        } else if (direction === 'down' && index < nodesCopy.length - 1) {
          [nodesCopy[index], nodesCopy[index + 1]] = [nodesCopy[index + 1], nodesCopy[index]];
        }

        return nodesCopy;
      };
      onNodesChange(moveNode([...nodes]));
    },
    [nodes, onNodesChange],
  );

  const handleDialogConfirm = (value: string) => {
    const { action, nodeId, isChild } = dialogState;

    if (action === 'add' && nodeId) {
      const newNode: TreeNode = {
        id: `node-${Date.now()}`,
        name: value,
        type: value.includes('.') ? 'file' : 'directory',
        children: [],
        parentId: isChild ? nodeId : null,
        isExpanded: true,
      };

      const addNode = (nodeList: TreeNode[]): TreeNode[] => {
        if (!isChild) {
          const index = nodeList.findIndex((n) => n.id === nodeId);
          if (index !== -1) {
            const newNodes = [...nodeList];
            newNodes.splice(index + 1, 0, newNode);
            return newNodes;
          }
        }

        return nodeList.map((node) => {
          if (node.id === nodeId && isChild) {
            return {
              ...node,
              type: 'directory', // Auto-convert to directory when adding children
              children: [...node.children, newNode],
              isExpanded: true,
            };
          } else if (node.children.length > 0) {
            return {
              ...node,
              children: addNode(node.children),
            };
          }
          return node;
        });
      };

      const currentNodes = [...nodes];
      if (!isChild && !currentNodes.find((n) => n.id === nodeId)) {
        const result = addNode(currentNodes);
        if (result === currentNodes) {
          onNodesChange([...currentNodes, newNode]);
        } else {
          onNodesChange(result);
        }
      } else {
        onNodesChange(addNode(currentNodes));
      }
    } else if (action === 'rename' && nodeId) {
      const renameNode = (nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              name: value,
              type: value.includes('.') ? 'file' : node.type,
            };
          } else if (node.children.length > 0) {
            return {
              ...node,
              children: renameNode(node.children),
            };
          }
          return node;
        });
      };
      onNodesChange(renameNode([...nodes]));
    }

    setDialogState({
      isOpen: false,
      action: null,
      nodeId: null,
      isChild: false,
    });
  };

  const getNodeName = (nodeId: string): string => {
    const { node } = findNodeAndParent(nodes, nodeId);
    return node?.name || '';
  };

  const handleToggleAll = () => {
    const allExpanded = nodes.every((node) => checkAllExpanded(node));
    const toggleAll = (nodeList: TreeNode[]): TreeNode[] => {
      return nodeList.map((node) => ({
        ...node,
        isExpanded: !allExpanded,
        children: toggleAll(node.children),
      }));
    };
    onNodesChange(toggleAll([...nodes]));
  };

  const checkAllExpanded = (node: TreeNode): boolean => {
    if (node.children.length === 0) return true;
    return node.isExpanded && node.children.every(checkAllExpanded);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          value={root}
          onChange={(e) => onRootChange(e.target.value)}
          placeholder="Enter root directory name"
          className="flex-1"
        />
        <button
          onClick={handleToggleAll}
          className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expand/Collapse All"
        >
          {nodes.every((node) => checkAllExpanded(node)) ? '▼' : '▶'}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {nodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            depth={0}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onRename={handleRename}
            onMove={handleMove}
          />
        ))}
      </div>

      <InputDialog
        isOpen={dialogState.isOpen}
        title={dialogState.action === 'add' ? `Add ${dialogState.isChild ? 'child' : 'sibling'} node` : 'Rename node'}
        placeholder={dialogState.action === 'add' ? 'Enter node name' : 'Enter new name'}
        initialValue={dialogState.action === 'rename' && dialogState.nodeId ? getNodeName(dialogState.nodeId) : ''}
        onConfirm={handleDialogConfirm}
        onCancel={() =>
          setDialogState({
            isOpen: false,
            action: null,
            nodeId: null,
            isChild: false,
          })
        }
      />
    </div>
  );
};
