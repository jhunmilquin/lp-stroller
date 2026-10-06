const fs = require('node:fs');
const source = fs.readFileSync('index copy.html', 'utf8');
const hero = fs.readFileSync('.tools/index2-hero.html', 'utf8');
const next = source
  .replace('href="assets/css/giveaways.css"', 'href="assets/css/index2.css"')
  .replace(/    <section class="giveaway-hero"[\s\S]*?<\/section>/, hero.trimEnd());
if (next === source || !next.includes('discover-heading')) throw new Error('Hero replacement failed.');
fs.writeFileSync('index2.html', next);
