const fs = require('fs');
let content = fs.readFileSync('src/lib/seoRoutes.js', 'utf8');

// Replace `"url": \`${SITE_URL}/.../\`,` with `"url": \`${SITE_URL}/...\`,`
content = content.replace(/"url": `\$\{SITE_URL\}\/([^`]*)\/`/g, '"url": `${SITE_URL}/$1`');
content = content.replace(/"url": `\$\{SITE_URL\}\/`/g, '"url": `${SITE_URL}/`'); // Home page is an exception, it usually keeps trailing slash or just `${SITE_URL}`. Actually, `${SITE_URL}/` is fine for homepage, but let's see. The user only had issues with other pages.
content = content.replace(/"url": `\$\{SITE_URL\}\/free-audit\/`/g, '"url": `${SITE_URL}/free-audit`');
content = content.replace(/"url": `\$\{SITE_URL\}\/pricing\/`/g, '"url": `${SITE_URL}/pricing`');
content = content.replace(/"url": `\$\{SITE_URL\}\/blog\/`/g, '"url": `${SITE_URL}/blog`');
content = content.replace(/"url": `\$\{SITE_URL\}\/location\/andheri\/`/g, '"url": `${SITE_URL}/location/andheri`');

fs.writeFileSync('src/lib/seoRoutes.js', content);
console.log('Fixed trailing slashes!');
