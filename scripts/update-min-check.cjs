const fs=require('fs');
const p = 'f:\\samad\\celecartsite\\celecartsite\\server\\routes.ts';
let s = fs.readFileSync(p,'utf8');
s = s.replace('const imageUrls', "if (Array.isArray(req.files) && req.files.length < 2) {\n        return res.status(400).json({ message: 'Please upload 23 images.' });\n      }\n      const imageUrls");
fs.writeFileSync(p,s);
console.log('server/routes.ts min-files check added');
