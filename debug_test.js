const { parseTreeOutput } = require('./src/utils/treeParser.ts');

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

console.log('Input:');
console.log(input);
console.log('\nParsed result:');
const result = parseTreeOutput(input);
console.log(JSON.stringify(result, null, 2));