const fs = require('fs');
const path = 'src/components/ControlPanel.tsx';
let c = fs.readFileSync(path, 'utf8');

// Replace the inline array + .map() block (lines 204-210 in current file)
// with a variable declaration followed by map(varName)
const lines = c.split('\n');
const out = [];
let skipEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (i === 204) {
    // Insert variable declaration instead of inline array
    out.push('      const scaleData = [');
    out.push('        { key: "scale", label: "Scale", modeKey: "scaleMode" as const, minKey: "minScale" as const, maxKey: "maxScale" as const, fixedKey: "fixedScale" as const, fmt: (x:number)=>x.toFixed(1)+"x", mm: ["0.1","5.0"],["0.5","10.0"], st: "0.1" },');
    out.push('        { key: "rotation", label: "Rotation", modeKey: "rotationMode" as const, minKey: "minRotation" as const, maxKey: "maxRotation" as const, fixedKey: "fixedRotation" as const, fmt: (x:number)=>x.toFixed(0), mm: ["-180","360"],["0","360"], st: "1" },');
    out.push('        { key: "opacity", label: "Opacity", modeKey: "opacityMode" as const, minKey: "minOpacity" as const, maxKey: "maxOpacity" as const, fixedKey: "fixedOpacity" as const, fmt: (x:number)=>Math.round(x*100), mm: ["0.1","0.8"],["0.5","1.0"], st: "0.05" }');
    out.push('      ];');
    skipEnd = 207;
  } else if (i > 204 && i <= skipEnd) {
    continue; // skip old inline array lines
  } else {
    out.push(lines[i]);
  }
}

fs.writeFileSync(path, out.join('\n'));
console.log('Done:', out.length, 'lines');
