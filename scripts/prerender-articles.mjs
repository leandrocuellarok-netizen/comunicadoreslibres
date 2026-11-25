import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://libres.sbs';
const SUPABASE_URL = 'https://mwnvsquprizeolucggod.supabase.co';
const SUPABASE_KEY = 'sb_publishable_R0uFamr_nC6XkcQ7gnRhDw_564yMB-C';
const CATEGORY_PATHS = {
  'Agenda política': 'agenda',
  'Turismo, estilo de vida y gastronomía': 'turismo-estilo-gourmet',
  'Ciencia, tecnología e IA': 'ciencia-ia',
  'Empresas y negocios': 'empresas-negocios',
  'Economía y finanzas': 'economia-finanzas',
  'Comunicación, medios y redes': 'comunicacion-medios'
};

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

const slugify = value => String(value || '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const articleUrl = article => {
  const category = CATEGORY_PATHS[article.category] || slugify(article.category);
  const slug = article.slug || slugify(article.title);
  return { category, slug, url: `${SITE}/${category}/${slug}/` };
};

const paragraphHtml = body => String(body || '').split(/\n+/)
  .map(part => part.trim()).filter(Boolean)
  .map(part => `<p>${escapeHtml(part)}</p>`).join('\n');

const response = await fetch(
  `${SUPABASE_URL}/rest/v1/articles?select=id,title,category,author,date,excerpt,body,published,image,imageAlt,imageCredit,sources,seo_title,seo_description,slug,keywords,og_image,geo_region,geo_place&published=eq.true&order=date.desc`,
  { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
);
if (!response.ok) throw new Error(`Supabase articles query failed: ${response.status} ${await response.text()}`);
const articles = await response.json();
const baseHtml = await fs.readFile('dist/index.html', 'utf8');
const generatedUrls = [];

for (const article of articles) {
  const { category, slug, url } = articleUrl(article);
  if (!slug) continue;
  const title = article.seo_title || article.title;
  const description = article.seo_description || article.excerpt || article.title;
  const image = article.og_image || article.image || `${SITE}/comunicadores-libres.png`;
  const canonical = url;
  const published = article.date ? new Date(`${article.date}T12:00:00Z`).toISOString() : undefined;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description,
    datePublished: published,
    author: { '@type': 'Person', name: article.author || 'Redacción · Comunicadores Libres' },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Comunicadores Libres',
      logo: { '@type': 'ImageObject', url: `${SITE}/comunicadores-libres.png` }
    },
    mainEntityOfPage: canonical,
    image: [image],
    articleSection: article.category,
    keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : undefined,
    inLanguage: 'es-AR'
  };
  if (!published) delete schema.datePublished;
  if (!schema.keywords) delete schema.keywords;

  const sourceLinks = Array.isArray(article.sources) && article.sources.length
    ? `<section><h2>Fuentes</h2><ul>${article.sources.map(source => `<li><a href="${escapeHtml(source)}" rel="nofollow noopener">${escapeHtml(source)}</a></li>`).join('')}</ul></section>`
    : '';
  const articleHtml = `<main id="root"><article class="prerendered-article">
    <nav aria-label="Navegación"><a href="/">Comunicadores Libres</a> / ${escapeHtml(article.category)}</nav>
    <article>
      <p>${escapeHtml(article.category)} · ${escapeHtml(article.date || '')}</p>
      <h1>${escapeHtml(article.title)}</h1>
      <p>Por ${escapeHtml(article.author || 'Redacción')}</p>
      <p><strong>${escapeHtml(article.excerpt || '')}</strong></p>
      ${article.image ? `<figure><img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt || article.title)}"><figcaption>${escapeHtml(article.imageCredit || '')}</figcaption></figure>` : ''}
      <div>${paragraphHtml(article.body)}</div>
      ${sourceLinks}
    </article>
  </article></main>`;

  let html = baseHtml.replace('<div id="root"></div>', articleHtml);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)} | Comunicadores Libres</title>`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:type" content="[^"]*"\s*\/>/, '<meta property="og:type" content="article" />');
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`);
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n  </head>`);

  const outputDir = path.join('dist', category, slug);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
  generatedUrls.push({ url, date: article.date });
}

const sitemapEntries = [
  `  <url><loc>${SITE}/</loc></url>`,
  ...generatedUrls.map(item => `  <url><loc>${item.url}</loc>${item.date ? `<lastmod>${item.date}</lastmod>` : ''}</url>`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
await fs.writeFile('dist/sitemap.xml', sitemap, 'utf8');
console.log(`Prerendered ${generatedUrls.length} published article pages and updated sitemap.xml.`);
