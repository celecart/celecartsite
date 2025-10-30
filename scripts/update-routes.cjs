const fs=require('fs');
const p = 'f:\\samad\\celecartsite\\celecartsite\\server\\routes.ts';
let s = fs.readFileSync(p,'utf8');
s = s.replace("celebrityProductImageUpload.array('images', 10)", "celebrityProductImageUpload.array('images', 3)");
s = s.replace(/files:\s*10(\s*\/\/.*)?/,'files: 3$1');
fs.writeFileSync(p,s);
console.log('server/routes.ts updated');
