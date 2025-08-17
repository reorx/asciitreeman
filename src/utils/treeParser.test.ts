import { parseTreeOutput } from './treeParser';
import { TreeNode } from '../types/tree';

describe('parseTreeOutput', () => {
  it('should parse an empty input', () => {
    const result = parseTreeOutput('');
    expect(result).toEqual({ root: '', nodes: [] });
  });

  it('should parse a single file', () => {
    const input = `
.
└── file.txt
`;
    const result = parseTreeOutput(input);
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].name).toBe('file.txt');
    expect(result.nodes[0].type).toBe('file');
    expect(result.nodes[0].children).toEqual([]);
  });

  it('should parse a single directory with files', () => {
    const input = `
.
└── folder
    ├── file1.txt
    └── file2.txt
`;
    const result = parseTreeOutput(input);
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].name).toBe('folder');
    expect(result.nodes[0].type).toBe('directory');
    expect(result.nodes[0].children).toHaveLength(2);
    expect(result.nodes[0].children[0].name).toBe('file1.txt');
    expect(result.nodes[0].children[1].name).toBe('file2.txt');
  });

  it('should parse nested directories', () => {
    const input = `
.
├── folder1
│   ├── subfolder
│   │   └── deep_file.txt
│   └── file1.txt
└── folder2
    └── file2.txt
`;
    const result = parseTreeOutput(input);
    expect(result.nodes).toHaveLength(2);

    const folder1 = result.nodes[0];
    expect(folder1.name).toBe('folder1');
    expect(folder1.type).toBe('directory');
    expect(folder1.children).toHaveLength(2);

    const subfolder = folder1.children[0];
    expect(subfolder.name).toBe('subfolder');
    expect(subfolder.type).toBe('directory');
    expect(subfolder.children).toHaveLength(1);
    expect(subfolder.children[0].name).toBe('deep_file.txt');

    const folder2 = result.nodes[1];
    expect(folder2.name).toBe('folder2');
    expect(folder2.children).toHaveLength(1);
  });

  it('should handle symlinks', () => {
    const input = `
.
├── real_folder
└── link_folder -> ../some/other/path
`;
    const result = parseTreeOutput(input);
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes[1].name).toBe('link_folder');
  });

  it('should handle complex tree structure from spec', () => {
    const input = `
.
├── backend
│   ├── scripts
│   ├── static
│   ├── manage.py
│   └── README.md
├── frontend
│   ├── app
│   ├── public
│   └── package.json
└── readme.md
`;
    const result = parseTreeOutput(input);
    expect(result.nodes).toHaveLength(3);

    const backend = result.nodes[0];
    expect(backend.name).toBe('backend');
    expect(backend.type).toBe('directory');
    expect(backend.children).toHaveLength(4);

    const frontend = result.nodes[1];
    expect(frontend.name).toBe('frontend');
    expect(frontend.type).toBe('directory');
    expect(frontend.children).toHaveLength(3);

    const readme = result.nodes[2];
    expect(readme.name).toBe('readme.md');
    expect(readme.type).toBe('file');
  });

  it('should assign unique IDs to each node', () => {
    const input = `
.
├── folder1
│   └── file1.txt
└── folder2
    └── file2.txt
`;
    const result = parseTreeOutput(input);
    const allIds = new Set<string>();

    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id);
        collectIds(node.children);
      });
    };

    collectIds(result.nodes);
    expect(allIds.size).toBe(4); // 2 folders + 2 files
  });

  it('should set parent IDs correctly', () => {
    const input = `
.
└── folder
    └── file.txt
`;
    const result = parseTreeOutput(input);
    const folder = result.nodes[0];
    const file = folder.children[0];

    expect(folder.parentId).toBeNull();
    expect(file.parentId).toBe(folder.id);
  });

  it('should default directories to expanded', () => {
    const input = `
.
└── folder
    └── file.txt
`;
    const result = parseTreeOutput(input);
    expect(result.nodes[0].isExpanded).toBe(true);
  });

  it('should handle the reported flattening issue', () => {
    const input = `next-test
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   └── app
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json`;
    
    const result = parseTreeOutput(input);
    
    // Should have public and src as top-level directories
    expect(result.nodes).toHaveLength(9); // 2 directories + 7 files
    
    const publicNode = result.nodes.find(n => n.name === 'public');
    const srcNode = result.nodes.find(n => n.name === 'src');
    
    expect(publicNode).toBeDefined();
    expect(srcNode).toBeDefined();
    expect(publicNode!.type).toBe('directory');
    expect(srcNode!.type).toBe('directory');
    
    // Public should have 5 files as children
    expect(publicNode!.children).toHaveLength(5);
    expect(publicNode!.children[0].name).toBe('file.svg');
    expect(publicNode!.children[1].name).toBe('globe.svg');
    
    // Src should have 1 directory (app) as child
    expect(srcNode!.children).toHaveLength(1);
    expect(srcNode!.children[0].name).toBe('app');
    expect(srcNode!.children[0].type).toBe('directory');
    
    // App should have 4 files as children
    expect(srcNode!.children[0].children).toHaveLength(4);
    expect(srcNode!.children[0].children[0].name).toBe('favicon.ico');
    
    // Test that top-level nodes don't include the children
    const topLevelNames = result.nodes.map(n => n.name);
    expect(topLevelNames).not.toContain('file.svg');
    expect(topLevelNames).not.toContain('app');
    expect(topLevelNames).not.toContain('favicon.ico');
  });

  it('should correctly parse and generate the reported tree structure', () => {
    const input = `next-test
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   └── app
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json`;

    // Parse the input
    const parsedData = parseTreeOutput(input);
    
    // Verify correct structure
    expect(parsedData.root).toBe('next-test');
    expect(parsedData.nodes).toHaveLength(9);
    
    // Verify public directory structure
    const publicNode = parsedData.nodes.find(n => n.name === 'public')!;
    expect(publicNode.type).toBe('directory');
    expect(publicNode.children).toHaveLength(5);
    expect(publicNode.children.map(c => c.name)).toEqual([
      'file.svg', 'globe.svg', 'next.svg', 'vercel.svg', 'window.svg'
    ]);
    
    // Verify src directory structure
    const srcNode = parsedData.nodes.find(n => n.name === 'src')!;
    expect(srcNode.type).toBe('directory');
    expect(srcNode.children).toHaveLength(1);
    
    const appNode = srcNode.children[0];
    expect(appNode.name).toBe('app');
    expect(appNode.type).toBe('directory');
    expect(appNode.children).toHaveLength(4);
    expect(appNode.children.map(c => c.name)).toEqual([
      'favicon.ico', 'globals.css', 'layout.tsx', 'page.tsx'
    ]);
  });
});
