import fs from 'fs';
let c=fs.readFileSync('src/components/PatternPreview.tsx','utf8');

// Fix className on the tile matrix button - missing backticks and interpolation
c=c.replace(/\{ext-\[10px\] px-2 py-0\.5 font-bold font-mono rounded cursor-pointer transition-all \}\>/g,'{ \	ext-[10px] px-2 py-0.5 font-bold font-mono rounded cursor-pointer transition-all  }>');

// Fix transform: should be scale()
c=c.replace('transform: \\\\scale()', 'transform: scale()');

fs.writeFileSync('src/components/PatternPreview.tsx', c);
console.log('Fixed PatternPreview.tsx');