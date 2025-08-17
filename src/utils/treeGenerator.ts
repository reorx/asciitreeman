import { TreeNode, TreeData } from '../types/tree';

export function generateTreeOutput(treeData: TreeData): string {
  const { root, nodes } = treeData;

  if (nodes.length === 0) return root || '.';

  const lines: string[] = [root || '.'];

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    generateNodeLines(node, lines, '', isLast);
  });

  return lines.join('\n');
}

function generateNodeLines(node: TreeNode, lines: string[], prefix: string, isLast: boolean): void {
  const connector = isLast ? '└── ' : '├── ';
  lines.push(prefix + connector + node.name);

  if (node.type === 'directory' && node.children.length > 0) {
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    node.children.forEach((child, index) => {
      const isLastChild = index === node.children.length - 1;
      generateNodeLines(child, lines, childPrefix, isLastChild);
    });
  }
}
