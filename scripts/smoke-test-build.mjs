import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://libres.sbs';
const DIST = path.resolve('dist');
const read = relative => fs.readFile(path.join(DIST, relative), 'utf8');

const home = await read('index.html');
assert.match(home, /class="prerendered-home-fallback"/, 'Homepage must contain meaningful static fallback content');
assert.match(home, /Saber comunicar, buscar perspectivas y ser libres\./, 'Homepage fallback must include the publication identity');
assert.match(home, /class="prerendered-header"/, 'Homepage fallback must include section navigation');
assert.match(home, /class="prerendered-card"/, 'Homepage fallback must include published article cards');
assert.ok(home.includes('href="/agenda/"'), 'Homepage fallback must link to a section');
const mainEntry = await fs.readFile(path.resolve('src/main.tsx'), 'utf8');
assert.ok(mainEntry.includes("root.querySelector('.prerendered-home-fallback')"), 'Startup failure must preserve the homepage fallback');
assert.match(home, /<link rel="canonical" href="https:\/\/libres\.sbs\/"\s*\/>/, 'Homepage canonical must be present');

const sitemap = await read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.ok(urls.includes(SITE + '/'), 'Sitemap must include the homepage');
assert.equal(new Set(urls).size, urls.length, 'Sitemap must not contain duplicate URLs');

for (const category of ['agenda', 'ciencia-ia', 'empresas-negocios']) {
  const url = SITE + '/' + category + '/';
  const html = await read(category + '/index.html');
  assert.match(html, /class="prerendered-category"/, category + ' must have a static category page');
  assert.ok(html.includes('href="' + url + '"'), category + ' must declare its canonical URL');
}

const criticalUrl = SITE + '/agenda/contacto-prensa-juan-carlos-giordano/';
assert.ok(urls.includes(criticalUrl), 'Published Giordano article must appear in sitemap');
const criticalHtml = await read('agenda/contacto-prensa-juan-carlos-giordano/index.html');
assert.match(criticalHtml, /class="prerendered-article"/, 'Giordano article must be statically rendered');
assert.match(criticalHtml, /class="prerendered-header"/, 'Giordano article must include static section navigation');
assert.ok(criticalHtml.includes('href="/agenda/"'), 'Giordano article must link back to its category');
assert.ok(criticalHtml.includes('aria-label="Secciones"'), 'Giordano article navigation must be labelled');
assert.ok(criticalHtml.includes('Contacto de prensa: diputado Juan Carlos Giordano e Izquierda Socialista'), 'Giordano title must be present before JavaScript');
assert.ok(criticalHtml.includes('INFORMACIÓN PARA PERIODISTAS'), 'Giordano body must be present before JavaScript');
assert.ok(criticalHtml.includes('<p>INFORMACIÓN PARA PERIODISTAS</p>'), 'Giordano escaped line breaks must render as separate paragraphs');
assert.ok(criticalHtml.includes('href="' + criticalUrl + '"'), 'Giordano canonical must match its public URL');

let articleCount = 0;
for (const url of urls) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  if (pathname === '/') continue;
  const segments = pathname.split('/').filter(Boolean);
  const relative = segments.join('/') + '/index.html';
  const html = await read(relative);
  assert.ok(html.includes('href="' + url + '"'), 'Canonical URL must match sitemap entry: ' + url);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1]));
  assert.ok(schemas.length > 0, 'Structured data must be valid JSON-LD: ' + url);
  if (segments.length === 2) {
    articleCount += 1;
    assert.match(html, /class="prerendered-article"/, 'Article must be readable without JavaScript: ' + url);
    assert.match(html, /class="prerendered-header"/, 'Article must include static section navigation: ' + url);
    assert.ok(html.includes('href="/' + segments[0] + '/"'), 'Article must link to its category: ' + url);
    assert.ok(schemas.some(schema => schema['@type'] === 'NewsArticle'), 'NewsArticle schema must exist: ' + url);
  } else if (segments.length === 1) {
    assert.match(html, /class="prerendered-category"/, 'Category must be statically rendered: ' + url);
    assert.ok(schemas.some(schema => schema['@type'] === 'CollectionPage'), 'CollectionPage schema must exist: ' + url);
  }
}
assert.ok(articleCount >= 1, 'Sitemap must include published article pages');
console.log('Smoke tests passed: homepage, 3 required category routes, ' + articleCount + ' article URLs, sitemap canonicals, and JSON-LD.');
