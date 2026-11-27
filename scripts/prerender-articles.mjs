import fs from 'node:fs/promises';
import path from 'node:path';

// Ensure embedded editorial images are emitted as local assets during each clean deployment.
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

const paragraphHtml = body => String(body || '').replace(/\\n/g, '\n').split(/\n+/)
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
  let image = article.og_image || article.image || `${SITE}/comunicadores-libres.png`;
  let articleImage = article.image || '';
  if (typeof article.image === 'string' && article.image.startsWith('data:image/')) {
    const match = article.image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
    if (match) {
      const extension = match[1] === 'image/webp' ? 'webp' : match[1] === 'image/png' ? 'png' : 'jpg';
      const filename = `${slug}.${extension}`;
      await fs.mkdir(path.join('dist', 'images'), { recursive: true });
      await fs.writeFile(path.join('dist', 'images', filename), Buffer.from(match[2], 'base64'));
      image = `${SITE}/images/${filename}`;
      articleImage = `/images/${filename}`;
      article.image = articleImage;
    }
  }
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
  const articleHtml = `<div id="root"><main class="prerendered-article">
    <nav aria-label="Navegación"><a href="/">Comunicadores Libres</a> / ${escapeHtml(article.category)}</nav>
    <article>
      <p>${escapeHtml(article.category)} · ${escapeHtml(article.date || '')}</p>
      <h1>${escapeHtml(article.title)}</h1>
      <p>Por ${escapeHtml(article.author || 'Redacción')}</p>
      <p><strong>${escapeHtml(article.excerpt || '')}</strong></p>
      ${articleImage ? `<figure><img src="${escapeHtml(articleImage)}" alt="${escapeHtml(article.imageAlt || article.title)}"><figcaption>${escapeHtml(article.imageCredit || '')}</figcaption></figure>` : ''}
      <div>${paragraphHtml(article.body)}</div>
      ${sourceLinks}
    </article>
  </main></div>`;

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


const categoryUrls = [];
const categoryNavigation = Object.entries(CATEGORY_PATHS)
  .map(([name, slug]) => '<a href="/' + slug + '/">' + escapeHtml(name) + '</a>')
  .join('');

for (const [category, categoryPath] of Object.entries(CATEGORY_PATHS)) {
  const categoryArticles = articles
    .filter(article => article.category === category)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const url = SITE + '/' + categoryPath + '/';
  const description = 'Noticias, análisis y actualidad sobre ' + category.toLowerCase() + ' en Comunicadores Libres.';
  const cards = categoryArticles.map(article => {
    const articleLink = articleUrl(article).url;
    const image = article.image
      ? '<img src="' + escapeHtml(article.image) + '" alt="' + escapeHtml(article.imageAlt || article.title) + '" loading="lazy" decoding="async">'
      : '';
    return '<article class="prerendered-card">' +
      '<a class="prerendered-card__link" href="' + escapeHtml(articleLink) + '">' +
      image +
      '<div class="prerendered-card__copy">' +
      '<p class="prerendered-card__meta">' + escapeHtml(article.date || '') + ' · ' + escapeHtml(article.author || 'Redacción') + '</p>' +
      '<h2>' + escapeHtml(article.title) + '</h2>' +
      '<p>' + escapeHtml(article.excerpt || '') + '</p>' +
      '<span>LEER ARTÍCULO ↗</span></div></a></article>';
  }).join('\n');
  const emptyState = '<p class="prerendered-empty">Esta sección todavía no tiene publicaciones disponibles.</p>';
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Comunicadores Libres', url: SITE + '/' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoryArticles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: article.title,
        url: articleUrl(article).url
      }))
    }
  };
  const categoryMarkup =
    '<div id="root"><main class="prerendered-category">' +
    '<header class="prerendered-header">' +
    '<a class="prerendered-brand" href="/">COMUNICADORES <i>LIBRES</i></a>' +
    '<nav aria-label="Secciones">' + categoryNavigation + '</nav>' +
    '</header>' +
    '<section class="prerendered-category__intro">' +
    '<p class="eyebrow">SECCIÓN EDITORIAL</p>' +
    '<h1>' + escapeHtml(category) + '</h1>' +
    '<p>' + escapeHtml(description) + '</p>' +
    '</section>' +
    '<section class="prerendered-category__grid" aria-label="Publicaciones">' +
    (cards || emptyState) +
    '</section>' +
    '<footer class="prerendered-footer"><a href="/">Volver a Comunicadores Libres</a></footer>' +
    '</main></div>';
  let categoryHtml = baseHtml.replace('<div id="root"></div>', categoryMarkup);
  categoryHtml = categoryHtml.replace(/<title>[^<]*<\/title>/, '<title>' + escapeHtml(category) + ' | Comunicadores Libres</title>');
  categoryHtml = categoryHtml.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, '<link rel="canonical" href="' + url + '" />');
  categoryHtml = categoryHtml.replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="' + escapeHtml(description) + '" />');
  categoryHtml = categoryHtml.replace(/<meta property="og:type" content="[^"]*"\s*\/>/, '<meta property="og:type" content="website" />');
  categoryHtml = categoryHtml.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, '<meta property="og:title" content="' + escapeHtml(category) + ' | Comunicadores Libres" />');
  categoryHtml = categoryHtml.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, '<meta property="og:description" content="' + escapeHtml(description) + '" />');
  categoryHtml = categoryHtml.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, '<meta property="og:url" content="' + url + '" />');
  categoryHtml = categoryHtml.replace(
    '</head>',
    '<script type="application/ld+json">' + JSON.stringify(categorySchema).replace(/</g, '\\u003c') + '</script>\n  </head>'
  );
  const categoryDir = path.join('dist', categoryPath);
  await fs.mkdir(categoryDir, { recursive: true });
  await fs.writeFile(path.join(categoryDir, 'index.html'), categoryHtml, 'utf8');
  categoryUrls.push({ url, date: categoryArticles[0]?.date || null });
}

const sitemapEntries = [
  '  <url><loc>' + SITE + '/</loc></url>',
  ...categoryUrls.filter(item => item.date).map(item => '  <url><loc>' + item.url + '</loc><lastmod>' + item.date + '</lastmod></url>'),
  ...generatedUrls.map(item => '  <url><loc>' + item.url + '</loc>' + (item.date ? '<lastmod>' + item.date + '</lastmod>' : '') + '</url>')
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
await fs.writeFile('dist/sitemap.xml', sitemap, 'utf8');
console.log(`Prerendered ${generatedUrls.length} published article pages and updated sitemap.xml.`);
