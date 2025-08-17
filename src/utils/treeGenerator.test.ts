import { generateTreeOutput } from './treeGenerator';
import { TreeNode } from '../types/tree';

describe('generateTreeOutput', () => {
  it('should generate empty output for empty nodes', () => {
    const result = generateTreeOutput([]);
    expect(result).toBe('');
  });

  it('should generate output for a single file', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'file.txt',
        type: 'file',
        children: [],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    expect(result).toBe('.\n└── file.txt');
  });

  it('should generate output for a single directory with files', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'folder',
        type: 'directory',
        children: [
          {
            id: '2',
            name: 'file1.txt',
            type: 'file',
            children: [],
            parentId: '1',
          },
          {
            id: '3',
            name: 'file2.txt',
            type: 'file',
            children: [],
            parentId: '1',
          },
        ],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    const expected = `.
└── folder
    ├── file1.txt
    └── file2.txt`;
    expect(result).toBe(expected);
  });

  it('should generate output for multiple root nodes', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'folder1',
        type: 'directory',
        children: [],
        parentId: null,
      },
      {
        id: '2',
        name: 'folder2',
        type: 'directory',
        children: [],
        parentId: null,
      },
      {
        id: '3',
        name: 'file.txt',
        type: 'file',
        children: [],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    const expected = `.
├── folder1
├── folder2
└── file.txt`;
    expect(result).toBe(expected);
  });

  it('should generate output for nested directories', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'folder1',
        type: 'directory',
        children: [
          {
            id: '2',
            name: 'subfolder',
            type: 'directory',
            children: [
              {
                id: '3',
                name: 'deep_file.txt',
                type: 'file',
                children: [],
                parentId: '2',
              },
            ],
            parentId: '1',
          },
          {
            id: '4',
            name: 'file1.txt',
            type: 'file',
            children: [],
            parentId: '1',
          },
        ],
        parentId: null,
      },
      {
        id: '5',
        name: 'folder2',
        type: 'directory',
        children: [
          {
            id: '6',
            name: 'file2.txt',
            type: 'file',
            children: [],
            parentId: '5',
          },
        ],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    const expected = `.
├── folder1
│   ├── subfolder
│   │   └── deep_file.txt
│   └── file1.txt
└── folder2
    └── file2.txt`;
    expect(result).toBe(expected);
  });

  it('should handle empty directories', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'empty_folder',
        type: 'directory',
        children: [],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    expect(result).toBe('.\n└── empty_folder');
  });

  it('should correctly use box drawing characters', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'parent',
        type: 'directory',
        children: [
          {
            id: '2',
            name: 'child1',
            type: 'file',
            children: [],
            parentId: '1',
          },
          {
            id: '3',
            name: 'child2',
            type: 'file',
            children: [],
            parentId: '1',
          },
          {
            id: '4',
            name: 'child3',
            type: 'file',
            children: [],
            parentId: '1',
          },
        ],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    const lines = result.split('\n');

    expect(lines[0]).toBe('.');
    expect(lines[1]).toContain('└──'); // Last item uses └──
    expect(lines[2]).toContain('├──'); // First child uses ├──
    expect(lines[3]).toContain('├──'); // Middle child uses ├──
    expect(lines[4]).toContain('└──'); // Last child uses └──
  });

  it('should preserve directory structure indentation', () => {
    const nodes: TreeNode[] = [
      {
        id: '1',
        name: 'level1',
        type: 'directory',
        children: [
          {
            id: '2',
            name: 'level2',
            type: 'directory',
            children: [
              {
                id: '3',
                name: 'level3',
                type: 'directory',
                children: [
                  {
                    id: '4',
                    name: 'deep.txt',
                    type: 'file',
                    children: [],
                    parentId: '3',
                  },
                ],
                parentId: '2',
              },
            ],
            parentId: '1',
          },
        ],
        parentId: null,
      },
    ];
    const result = generateTreeOutput(nodes);
    const lines = result.split('\n');

    expect(lines[1]).not.toContain('│');
    expect(lines[2]).toMatch(/^    /); // 4 spaces for level 2
    expect(lines[3]).toMatch(/^        /); // 8 spaces for level 3
    expect(lines[4]).toMatch(/^            /); // 12 spaces for level 4
  });
});
