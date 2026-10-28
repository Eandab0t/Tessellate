import fs from 'fs';
const files = ['src/components/ControlPanel.tsx', 'src/components/PatternPreview.tsx'];
files.forEach(f => { let c = fs.readFileSync(f, 'utf8');
c = c.replace(/import '\\\\'{([^}]+)}' from/g, 'import {} from');
fs.writeFileSync(f, c); console.log('Fixed', f); });
