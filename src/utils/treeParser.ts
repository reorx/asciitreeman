import { TreeNode } from '../types/tree';

export function parseTreeOutput(input: string): TreeNode[] {
  const lines = input.trim().split('\n');
  if (lines.length === 0) return [];

  const root: TreeNode[] = [];
  const stack: { node: TreeNode; depth: number }[] = [];
  let idCounter = 0;

  for (const line of lines) {
    if (line.trim() === '' || line.trim() === '.') continue;

    const depth = getDepth(line);
    const name = extractName(line);
    const isDirectory =
      !line.includes('└──') && !line.includes('├──') ? false : detectIfDirectory(lines, lines.indexOf(line), depth);

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
      root.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      node.parentId = parent.id;
      parent.children.push(node);
    }

    if (isDirectory) {
      stack.push({ node, depth });
    }
  }

  return root;
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
  if (currentIndex === lines.length - 1) return false;

  for (let i = currentIndex + 1; i < lines.length; i++) {
    const nextLine = lines[i];
    if (nextLine.trim() === '') continue;

    const nextDepth = getDepth(nextLine);

    if (nextDepth > currentDepth) {
      return true;
    } else if (nextDepth <= currentDepth) {
      return false;
    }
  }

  return false;
}
