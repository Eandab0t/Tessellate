const fs=require('fs');  
let cp=fs.readFileSync('src/components/ControlPanel.tsx','utf8');  
cp=cp.replace('className={w-full aspect-square rounded border cursor-pointer }','className='+String.fromCharCode(96)+'w-full aspect-square rounded border cursor-pointer $'+String.fromCharCode(123)+'settings.backgroundColor === preset ? \\" ring-1 ring-amber-500 "border-amber-500\ : \border-[#2D2F36]\'+String.fromCharCode(125))+'}'+String.fromCharCode(96));  
fs.writeFileSync('src/components/ControlPanel.tsx',cp);  
console.log('Fixed ControlPanel'); 
