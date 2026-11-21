import { mkdir, writeFile } from 'node:fs/promises';
import { products, categories } from './catalog.mjs';
import { icon, flower } from './icons.mjs';
import { buildSeriMelur } from './invitations/seri-melur.mjs';

const out = new URL('../dist/', import.meta.url);
const write = (path, text) => writeFile(new URL(path, out), text);
await mkdir(new URL('products/', out), { recursive: true });
const primary = { all: 'grid', ebooks: 'book', 'wedding-cards': 'mail', classes: 'video' };
const categoryName = {ebooks:'Ebook', 'wedding-cards':'Wedding card', classes:'Class'};
const brand = (root) => `<a class="brand" href="${root}index.html" aria-label="upskill.ai.my home">${flower}<span>upskill<span class="suffix">.ai.my</span></span></a>`;
const nav = (root,home=false) => `<header class="mast"><div class="wrap nav-wrap">${brand(root)}
<nav aria-label="Main navigation" id="main-nav">
${[['shop','Shop'],['ebooks','Ebooks'],['wedding-cards','Wedding cards'],['classes','Classes'],['studio','Our studio']].map(([key,name])=>`<a href="${root}index.html#${key}" data-nav="${key}" ${home&&key==='shop'?'class="current"':''}>${name}</a>`).join('')}
</nav><div class="nav-actions"><a class="saved-link" aria-label="Saved items" href="${root}index.html#saved" data-nav="saved">${icon('bookmark')}<span>Saved</span><span class="save-count" hidden></span></a>
<button class="menu-toggle icon-button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">${icon('menu')}</button></div></div></header>`;
const footer = root => `<footer><div class="wrap footer-wrap">${brand(root)}<span>Independent learning studio · Malaysia</span><a href="#top">Back to top</a></div></footer>`;
const head=(title,desc,root)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | upskill.ai.my</title><meta name="description" content="${desc}"><meta name="theme-color" content="#fbf8f0"><link rel="icon" href="${root}assets/flower.svg" type="image/svg+xml"><link rel="preload" as="font" type="font/woff" crossorigin href="${root}assets/serif.woff"><link rel="stylesheet" href="${root}assets/site.css"><script type="module" src="${root}assets/site.js"></script></head><body id="top" data-catalog="${products.map(p=>p.id).join(' ')}"><a href="#main" class="skip">Skip to content</a>`;
const end='</body></html>';
const saveBtn=(p,full=false)=>`<button type="button" class="save-item ${full?'full-save btn secondary':'icon-button'}" data-save="${p.id}" data-title="${p.title}" aria-label="Save ${p.title}" aria-pressed="false">${icon('bookmark')}${full?'<span>Save for later</span>':''}</button>`;
const price=p=>p.price===0?'Free':p.price?'RM'+p.price:p.invitation?'View sample':'View class';
function card(p){
  const url='products/'+p.id+'.html';
  return `<article class="card" data-group="${p.category}" data-id="${p.id}">
<div class="card-visual"><a href="${url}" aria-label="Explore ${p.title}"><img src="assets/${p.id}.webp" alt="" width="508" height="508" loading="lazy"></a><span class="image-tag ${p.category}">${icon(primary[p.category])}${categoryName[p.category]}</span>${saveBtn(p)}</div>
<div class="card-copy"><div class="product-meta">${p.tier?p.tier+' edition':p.invitation?'Invitation collection':'With Nigel Tan'}</div><h3><a href="${url}">${p.title}</a></h3><p>${p.description}</p>
<div class="card-bottom"><span>${p.price===0?'PDF download':p.price?(p.checkoutUrl?'Ebook price':'Planned price'):p.invitation?'Interactive preview':p.bookingUrl?'Enrolment open':'Coming soon'}</span><a href="${p.samplePath || url}" class="price ${p.price===0?'free':''}">${price(p)}</a></div></div></article>`;
}
const filters=Object.entries(categories).map(([id,name])=>`<a class="filter${id==='all'?' active':''}" href="#${id==='all'?'shop':id}" data-filter="${id}" ${id==='all'?'aria-current="true"':''}>${icon(primary[id])}${name}</a>`).join('');
const home = head('The studio shop','Practical AI ebooks, digital wedding invitations and beginner-friendly classes from an independent Malaysian studio.','')+nav('',true)+`
<main id="main">
<section class="hero"><div class="wrap hero-layout">
<div class="intro"><p class="eyebrow"><span class="short-rule"></span>A Malaysian learning studio</p>
<h1>Small steps.<br><em>Big possibilities.</em></h1>
<p class="hero-description">Practical AI ebooks, hands-on classes, and wedding cards made with care. A little something to learn, make, or celebrate.</p>
<div class="hero-actions"><a class="btn primary" href="#shop">${icon('bag')}Explore the shop</a><a class="text-link" href="products/everyday-ai.html">Start with a free ebook</a></div>
</div>
<div class="hero-art"><a class="polaroid" href="products/everyday-ai.html" aria-label="Open Everyday AI, the free starter ebook"><span class="tape" aria-hidden="true"></span><img src="assets/desk.webp" width="1320" height="880" alt="Everyday AI on a sunlit desk beside a cup of kopi and an open notebook" fetchpriority="high"><span class="photo-note"><span>From the studio bookshelf</span><span class="note-star" aria-hidden="true">✧</span></span><span class="seal"><span>${icon('book')}Free<br>ebook</span></span></a></div>
</div></section>
<div class="ribbon"><div class="wrap ribbon-in"><span>${icon('leaf')}Beginner friendly</span><i></i><span>${icon('download')}Digital resources</span><i></i><span>${icon('globe')}Made in Malaysia</span></div></div>
<section class="shop wrap" id="shop" tabindex="-1"><div class="shop-heading"><div><p class="eyebrow"><span class="short-rule"></span>The shop</p><h2 id="shelf-title">The studio shelf<span>.</span></h2></div><p id="shelf-description">Browse our ebooks, invitations, and classes.</p></div>
<nav class="filters" aria-label="Filter the collection">${filters}</nav><p id="filter-status" class="sr-only" role="status"></p>
<div class="cards">${products.map(card).join('')}</div><div id="empty-saved" hidden><h3>Your shelf is waiting.</h3><p>Tap the bookmark on an item to keep it here on this device.</p><a class="btn primary" href="#shop">Browse the shop</a></div>
</section>
<section id="studio" class="studio"><div class="wrap studio-inner"><div class="studio-print" aria-hidden="true"><span>${flower}</span></div><div><p class="eyebrow">Our studio</p><h2>Selamat datang.</h2><p>I’m Nigel Tan. I’m based in Malaysia, and I teach people how to use AI for everyday projects. If you’re starting from zero, pick one small thing you’d like to make. That’s where my classes begin.</p><a class="text-link" href="#classes">Explore my classes</a></div></div></section>
</main>`+footer('')+end;
await write('index.html',home);
for(const p of products) {
  const merchantUrl = p.checkoutUrl || p.bookingUrl;
  if(merchantUrl && new URL(merchantUrl).protocol!=='https:') throw new Error('Merchant links must use HTTPS');
  const category=categories[p.category];
  const action=p.download?`<a class="btn primary" href="../${p.download}" download>${icon('download')}Download free ebook</a>`:
   p.invitation?`<a class="btn primary" href="../${p.samplePath || 'invitation.html'}">${icon('mail')}Open sample invitation</a>`:p.bookingUrl?`<a class="btn primary" href="${p.bookingUrl}">${icon('video')}Book this class</a>`:p.checkoutUrl?`<a class="btn primary" href="${p.checkoutUrl}">${icon('bag')}Buy for RM${p.price}</a>`:
   `<a class="btn primary" href="#sample">${icon(p.category==='classes'?'video':'book')}${p.category==='classes'?'Try a class exercise':'Read a sample'}</a>`;
  await write('products/'+p.id+'.html',head(p.title,p.description,'../')+nav('../')+`<main class="wrap product-page" id="main">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="../index.html#shop">Shop</a><span>/</span><a href="../index.html#${p.category}">${category}</a><span>/</span><span aria-current="page">${p.title}</span></nav>
  <div class="product-hero"><img width="508" height="508" class="product-photo" alt="${p.title} studio still life" src="../assets/${p.id}.webp"><div class="product-intro"><p class="eyebrow"><span class="short-rule"></span>${p.tier?p.tier+' edition':p.label}</p><h1>${p.title}</h1><p class="product-detail">${p.detail}</p><p>${p.intro}</p>
  <div class="product-pricing">${p.price===0?'Free':p.price?'RM'+p.price:''}${p.price&&!p.checkoutUrl?'<small>Planned price</small>':''}</div><div class="detail-actions">${action}${saveBtn(p,true)}</div>${p.status&&!merchantUrl?`<p class="status-note">${p.status}</p>`:''}</div></div>
  <section class="inside"><div><p class="eyebrow">Inside</p><h2>${p.invitation?'Explore the invitation':p.category==='classes'?'What we’ll practise':'What’s inside'}</h2></div><ul>${p.topics.map(t=>`<li>${icon('check')}${t}</li>`).join('')}</ul></section>
  ${p.excerpt?`<section id="sample" class="sample"><p class="eyebrow">${p.category==='classes'?'Class notebook':'From the pages'}</p><h2>${p.excerptTitle}</h2><p>${p.excerpt}</p></section>`:''}<a class="text-link" href="../index.html#${p.category}">Browse ${category.toLowerCase()}</a></main>`+footer('../')+end);
}
await write('assets/flower.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" color="#ae4b2e">'+flower.replace(/^<svg[^>]+>|<\/svg>$/g,'')+'</svg>');

await buildSeriMelur();
