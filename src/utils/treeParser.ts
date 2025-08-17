import { TreeNode, TreeData } from '../types/tree';

export function parseTreeOutput(input: string): TreeData {
  const lines = input.trim().split('\n');
  if (lines.length === 0) return { root: '.', nodes: [] };

  // Extract root directory from first line
  let rootName = '.';
  let startIndex = 0;

  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if first line is a root directory (no tree symbols)
    if (!firstLine.includes('├') && !firstLine.includes('└') && !firstLine.includes('│')) {
      rootName = firstLine;
      startIndex = 1;
    }
  }

  const nodes: TreeNode[] = [];
  const stack: { node: TreeNode; depth: number }[] = [];
  let idCounter = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;

    const depth = getDepth(line);
    const name = extractName(line);
    const isDirectory = detectIfDirectory(lines, i, depth);

    const node: TreeNode = {
      id: `node-${idCounter++}`,
      name,
      type: isDirectory ? 'directory' : 'file',
      children: [],
      parentId: null,
      isExpanded: true,
    };

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      nodes.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      node.parentId = parent.id;
      parent.children.push(node);
    }

    if (isDirectory) {
      stack.push({ node, depth });
    }
  }

  return { root: rootName, nodes };
}

function getDepth(line: string): number {
  let depth = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '│' || line[i] === ' ' || line[i] === '\t') {
      depth++;
    } else if (line[i] === '├' || line[i] === '└') {
      break;
    }
  }
  return Math.floor(depth / 4);
}

function extractName(line: string): string {
  const match = line.match(/[├└]──\s*(.+?)(?:\s*->.*)?$/);
  if (match) {
    return match[1].trim();
  }

  const cleanLine = line.replace(/^[│├└─\s]+/, '').trim();
  return cleanLine || 'unnamed';
}

function detectIfDirectory(lines: string[], currentIndex: number, currentDepth: number): boolean {
  // Simple check: if it has children, it's a directory
  if (currentIndex === lines.length - 1) return false;

  for (let i = currentIndex + 1; i < lines.length; i++) {
    const nextLine = lines[i];
    if (nextLine.trim() === '') continue;

    const nextDepth = getDepth(nextLine);

    if (nextDepth > currentDepth) {
      return true; // Has children, so it's a directory
    } else if (nextDepth <= currentDepth) {
      return false; // No children, so it's a file
    }
  }

  return false; // Default to file if no children
}
