const fs=require('fs');
const p = 'f:\\samad\\celecartsite\\celecartsite\\server\\routes.ts';
let s = fs.readFileSync(p,'utf8');
s = s.replace('Please upload 23 images.', 'Please upload 2-3 images.');
fs.writeFileSync(p,s);
console.log('server/routes.ts message normalized');
