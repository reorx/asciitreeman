import { parseTreeOutput } from './treeParser';
import { TreeNode } from '../types/tree';

describe('parseTreeOutput', () => {
  it('should parse an empty input', () => {
    const result = parseTreeOutput('');
    expect(result).toEqual([]);
  });

  it('should parse a single file', () => {
    const input = `
.
└── file.txt
`;
    const result = parseTreeOutput(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('file.txt');
    expect(result[0].type).toBe('file');
    expect(result[0].children).toEqual([]);
  });

  it('should parse a single directory with files', () => {
    const input = `
.
└── folder
    ├── file1.txt
    └── file2.txt
`;
    const result = parseTreeOutput(input);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('folder');
    expect(result[0].type).toBe('directory');
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children[0].name).toBe('file1.txt');
    expect(result[0].children[1].name).toBe('file2.txt');
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
    expect(result).toHaveLength(2);

    const folder1 = result[0];
    expect(folder1.name).toBe('folder1');
    expect(folder1.type).toBe('directory');
    expect(folder1.children).toHaveLength(2);

    const subfolder = folder1.children[0];
    expect(subfolder.name).toBe('subfolder');
    expect(subfolder.type).toBe('directory');
    expect(subfolder.children).toHaveLength(1);
    expect(subfolder.children[0].name).toBe('deep_file.txt');

    const folder2 = result[1];
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
    expect(result).toHaveLength(2);
    expect(result[1].name).toBe('link_folder');
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
    expect(result).toHaveLength(3);

    const backend = result[0];
    expect(backend.name).toBe('backend');
    expect(backend.type).toBe('directory');
    expect(backend.children).toHaveLength(4);

    const frontend = result[1];
    expect(frontend.name).toBe('frontend');
    expect(frontend.type).toBe('directory');
    expect(frontend.children).toHaveLength(3);

    const readme = result[2];
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

    collectIds(result);
    expect(allIds.size).toBe(4); // 2 folders + 2 files
  });

  it('should set parent IDs correctly', () => {
    const input = `
.
└── folder
    └── file.txt
`;
    const result = parseTreeOutput(input);
    const folder = result[0];
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
    expect(result[0].isExpanded).toBe(true);
  });
});
