import {
  TreeData,
  TreeNode,
} from '../types/tree';
import { parseTreeOutput } from './treeParser';

describe('parseTreeOutput', () => {
  it('should return null for empty input', () => {
    const result = parseTreeOutput('');
    expect(result).toBeNull();
  });

  it('should return null for whitespace-only input', () => {
    const result = parseTreeOutput('   \n  \t  ');
    expect(result).toBeNull();
  });

  it('should parse a single file', () => {
    const input = `
.
└── file.txt
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');
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
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');
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
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');
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
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');
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
    const result = parseTreeOutput(input) as TreeData;
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
    const result = parseTreeOutput(input) as TreeData;
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
    const result = parseTreeOutput(input) as TreeData;
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
    const result = parseTreeOutput(input) as TreeData;
    expect(result.nodes[0].isExpanded).toBe(true);
  });

  it('should ignore summary text after empty line', () => {
    const input = `
dine
├── bacap
├── chuxin
├── dinehq
├── server-backup
├── server-configs
└── strapi-starter

6 directories, 0 files
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('dine');
    expect(result.nodes).toHaveLength(6);
    expect(result.nodes.map((n) => n.name)).toEqual([
      'bacap',
      'chuxin',
      'dinehq',
      'server-backup',
      'server-configs',
      'strapi-starter',
    ]);
    // Should not include "6 directories, 0 files" as a node
    expect(result.nodes.find((n) => n.name.includes('directories'))).toBeUndefined();
  });

  it('should handle multiple empty lines and ignore text after', () => {
    const input = `
.
├── src
│   └── index.js
└── package.json


Some random text here
This should be ignored
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes[0].name).toBe('src');
    expect(result.nodes[1].name).toBe('package.json');
  });

  it('should continue parsing if tree symbols appear after empty line', () => {
    const input = `
.
├── folder1
│   └── file1.txt

├── folder2
│   └── file2.txt
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes[0].name).toBe('folder1');
    expect(result.nodes[1].name).toBe('folder2');
  });

  it('should stop at non-tree text with numbers or statistics', () => {
    const input = `
project
├── README.md
├── src/
└── tests/

2 directories, 1 file
Total: 15 files
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('project');
    expect(result.nodes).toHaveLength(3);
    expect(result.nodes.every((n) => !n.name.includes('Total'))).toBe(true);
    expect(result.nodes.every((n) => !n.name.includes('directories'))).toBe(true);
  });

  it('should correctly parse directories with immediate children', () => {
    const input = `
next-test
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
└── tsconfig.json
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('next-test');

    // Should have 9 root level items (2 directories + 7 files)
    expect(result.nodes).toHaveLength(9);

    // Check public directory
    const publicDir = result.nodes.find((n) => n.name === 'public');
    expect(publicDir).toBeDefined();
    expect(publicDir?.type).toBe('directory');
    expect(publicDir?.children).toHaveLength(5);
    expect(publicDir?.children.map((c) => c.name)).toEqual([
      'file.svg',
      'globe.svg',
      'next.svg',
      'vercel.svg',
      'window.svg',
    ]);

    // Check src directory
    const srcDir = result.nodes.find((n) => n.name === 'src');
    expect(srcDir).toBeDefined();
    expect(srcDir?.type).toBe('directory');
    expect(srcDir?.children).toHaveLength(1);

    // Check app subdirectory
    const appDir = srcDir?.children[0];
    expect(appDir?.name).toBe('app');
    expect(appDir?.type).toBe('directory');
    expect(appDir?.children).toHaveLength(4);
    expect(appDir?.children.map((c) => c.name)).toEqual(['favicon.ico', 'globals.css', 'layout.tsx', 'page.tsx']);

    // Check root level files
    const rootFiles = result.nodes.filter((n) => n.type === 'file');
    expect(rootFiles.map((f) => f.name)).toEqual([
      'next-env.d.ts',
      'next.config.ts',
      'package-lock.json',
      'package.json',
      'postcss.config.mjs',
      'README.md',
      'tsconfig.json',
    ]);
  });

  it('should correctly parse neocm project', () => {
    const input = `.
├── backend
│   ├── auditlog
│   ├── bruno
│   ├── common_tools
│   ├── media
│   ├── neocm
│   ├── scripts
│   ├── backend.env
│   ├── curlapi.sh
│   ├── db.sqlite3
│   ├── deploy_backend.sh
│   ├── docker-entrypoint.sh
│   ├── Dockerfile
│   ├── gen_frontend_queries.sh
│   ├── gen_frontend_types.sh
│   ├── gunicorn.conf.py
│   ├── LICENSE
│   ├── manage.py
│   ├── pgpy.ipynb
│   ├── README.md
│   ├── requirements.txt
│   ├── try_gcm.py
│   └── uwsgi.ini
├── frontend
│   ├── app
│   ├── public
│   ├── deploy_frontend.sh
│   ├── Dockerfile
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── compose.prod.yml
├── compose.yml
├── pack_repo.sh
└── readme.md
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');

    // Check backend directory
    const backendDir = result.nodes.find((n) => n.name === 'backend');
    expect(backendDir).toBeDefined();
    expect(backendDir!.type).toBe('directory');
    expect(backendDir!.children.length).toBeGreaterThan(1);
    expect(backendDir!.children[0].name).toBe('auditlog');
  });

  it('should handle irregular whitespace characters correctly', () => {
    // This test uses irregular whitespace characters like non-breaking space (\u00A0)
    // and other Unicode whitespace characters that can cause parsing issues
    const input = `.
├──\u00A0backend
│\u00A0\u00A0\u00A0├──\u00A0auditlog
│\u00A0\u00A0\u00A0├──\u00A0bruno
│\u00A0\u00A0\u00A0├──\u00A0common_tools
│\u00A0\u00A0\u00A0├──\u00A0scripts
│\u00A0\u00A0\u00A0├──\u00A0backend.env
│\u00A0\u00A0\u00A0└──\u00A0uwsgi.ini
├──\u00A0frontend
│\u00A0\u00A0\u00A0├──\u00A0app
│\u00A0\u00A0\u00A0├──\u00A0public
│\u00A0\u00A0\u00A0└──\u00A0package.json
└──\u00A0readme.md
`;
    const result = parseTreeOutput(input) as TreeData;
    expect(result.root).toBe('.');

    // Check that directories and files are parsed correctly despite irregular whitespace
    const backendDir = result.nodes.find((n) => n.name === 'backend');
    expect(backendDir).toBeDefined();
    expect(backendDir!.type).toBe('directory');
    expect(backendDir!.children.length).toBeGreaterThan(0);

    const frontendDir = result.nodes.find((n) => n.name === 'frontend');
    expect(frontendDir).toBeDefined();
    expect(frontendDir!.type).toBe('directory');

    const readmeFile = result.nodes.find((n) => n.name === 'readme.md');
    expect(readmeFile).toBeDefined();
    expect(readmeFile!.type).toBe('file');
  });
});
