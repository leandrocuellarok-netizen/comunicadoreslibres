import assert from 'node:assert/strict';

const site = new URL(process.env.SITE_URL || 'https://libres.sbs/');
if (site.protocol !== 'https:') throw new Error('SITE_URL must use HTTPS');
const pagesUrl = process.env.PAGES_URL;
if (!pagesUrl) throw new Error('GitHub Pages did not return its page_url output');
assert.equal(new URL(pagesUrl).origin, site.origin, 'GitHub Pages page_url must match the configured custom domain');

const origin = site.origin;
const attempts = 5;
const timeoutMs = 8000;
const retryDelayMs = 5000;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getPage(path) {
  const url = new URL(path, site);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        cache: 'no-store',
        headers: { 'user-agent': 'ComunicadoresLibres-LiveSmokeTest/1.0' },
        signal: AbortSignal.timeout(timeoutMs)
      });
      const body = await response.text();
      const result = {
        status: response.status,
        finalUrl: response.url,
        redirected: response.redirected,
        contentType: response.headers.get('content-type') || '',
        body
      };
      if (response.status === 200 && response.url.startsWith('https://') && new URL(response.url).origin === origin) {
        return result;
      }
      lastError = new Error('HTTP ' + response.status + '; final URL ' + response.url);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await wait(retryDelayMs);
  }
  throw new Error(path + ' failed after ' + attempts + ' attempts: ' + (lastError?.message || lastError));
}

const canonical = path => new URL(path, site).toString();
const [home, sitemap] = await Promise.all([getPage('/'), getPage('/sitemap.xml')]);
assert.match(home.contentType, /text\/html/i, 'Homepage must be served as HTML');
assert.ok(home.body.includes('class="prerendered-home-fallback"'), 'Homepage must contain static fallback content');
assert.ok(home.body.includes('Saber comunicar, buscar perspectivas y ser libres.'), 'Homepage must contain the publication identity');
assert.ok(home.body.includes('<link rel="canonical" href="' + canonical('/') + '" />'), 'Homepage canonical must match the public origin');
assert.ok(home.body.includes('href="/agenda/contacto-prensa-juan-carlos-giordano/"'), 'Homepage must link to the featured Giordano article');
assert.match(sitemap.contentType, /(xml|text\/plain)/i, 'Sitemap must be served as XML or text');
const sitemapUrls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].trim());
assert.ok(sitemapUrls.includes(canonical('/')), 'Sitemap must include the homepage');
assert.ok(sitemapUrls.includes(canonical('/agenda/contacto-prensa-juan-carlos-giordano/')), 'Sitemap must include the Giordano article');
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Sitemap must not contain duplicate canonical URLs');
for (const url of sitemapUrls) assert.equal(new URL(url).origin, origin, 'Sitemap URL must use ' + origin);

const findArticle = category => sitemapUrls.find(url => {
  const segments = new URL(url).pathname.split('/').filter(Boolean);
  return segments.length === 2 && segments[0] === category;
});
const scienceArticle = findArticle('ciencia-ia');
const businessArticle = findArticle('empresas-negocios');
assert.ok(businessArticle, 'Sitemap must include a real Empresas y negocios article');
if (!scienceArticle) console.warn('SKIP Ciencia e IA article: no published CMS article URL exists in the sitemap; the category page will be checked as an empty section.');

const routeChecks = [
  { name: 'Agenda category', path: '/agenda/', type: 'category' },
  { name: 'Ciencia e IA category', path: '/ciencia-ia/', type: 'category', expectEmpty: !scienceArticle },
  { name: 'Empresas y negocios category', path: '/empresas-negocios/', type: 'category' },
  { name: 'Giordano article direct', path: '/agenda/contacto-prensa-juan-carlos-giordano/', type: 'article', contains: 'INFORMACIÓN PARA PERIODISTAS', titleContains: 'Contacto de prensa: diputado Juan Carlos Giordano e Izquierda Socialista' },
  { name: 'Giordano article refresh', path: '/agenda/contacto-prensa-juan-carlos-giordano/', type: 'article', contains: 'INFORMACIÓN PARA PERIODISTAS', titleContains: 'Contacto de prensa: diputado Juan Carlos Giordano e Izquierda Socialista' },
  { name: 'Empresas y negocios article', path: new URL(businessArticle).pathname, type: 'article' }
];
if (scienceArticle) routeChecks.push({ name: 'Ciencia e IA article', path: new URL(scienceArticle).pathname, type: 'article' });
console.log('PASS homepage: HTTP ' + home.status + '; final=' + home.finalUrl + '; redirected=' + home.redirected);
console.log('PASS sitemap: HTTP ' + sitemap.status + '; URLs=' + sitemapUrls.length + '; final=' + sitemap.finalUrl);
const results = await Promise.all(routeChecks.map(async check => ({ check, page: await getPage(check.path) })));
for (const result of results) {
  const check = result.check;
  const page = result.page;
  assert.match(page.contentType, /text\/html/i, check.name + ' must be served as HTML');
  if (check.type === 'category') {
    assert.ok(page.body.includes('class="prerendered-category"'), check.name + ' must have static category markup');
    assert.ok(page.body.includes('<link rel="canonical" href="' + canonical(check.path) + '" />'), check.name + ' canonical must match its URL');
    if (check.expectEmpty) assert.ok(page.body.includes('Esta sección todavía no tiene publicaciones disponibles.'), check.name + ' must disclose that no CMS articles are currently published');
  } else {
    assert.ok(page.body.includes('class="prerendered-article"'), check.name + ' must have static article markup');
    assert.ok(page.body.includes('<link rel="canonical" href="' + canonical(check.path) + '" />'), check.name + ' canonical must match its URL');
    assert.ok(page.body.includes('NewsArticle'), check.name + ' must contain NewsArticle structured data');
    if (check.titleContains) assert.ok(page.body.includes('<h1>' + check.titleContains + '</h1>'), check.name + ' must include the expected article title');
    assert.ok(page.body.includes('href="/"'), check.name + ' must include a link back to the homepage');
    if (check.contains) assert.ok(page.body.includes(check.contains), check.name + ' must include the expected article body marker');
  }
  console.log('PASS ' + check.name + ': HTTP ' + page.status + '; final=' + page.finalUrl + '; redirected=' + page.redirected);
}
const articleRequests = routeChecks.filter(check => check.type === 'article').length;
console.log('PASS live smoke tests: HTTPS origin ' + origin + '; homepage; sitemap (' + sitemapUrls.length + ' URLs); 3 categories; ' + articleRequests + ' article requests including direct refresh where published CMS content exists.');
