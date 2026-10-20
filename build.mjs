import {mkdir,copyFile,writeFile} from 'node:fs/promises';

// Publish only browser assets, never tests, local settings, or source archives.
const assets=['index.html','styles.css','app.js','curriculum.js','i18n.js','music.js'];
await mkdir('dist',{recursive:true});
await Promise.all(assets.map(file=>copyFile(file,`dist/${file}`)));
await writeFile('dist/.nojekyll','');
console.log(`Built Little Keys: ${assets.length} browser assets in dist/`);
