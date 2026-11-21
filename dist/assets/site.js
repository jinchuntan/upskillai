const storageKey = 'upskill-studio:saved:v1';
const catalogIds = new Set(document.body.dataset.catalog.split(' '));
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return new Set(Array.isArray(value) ? value.filter(id => catalogIds.has(id)) : []);
  } catch {
    return new Set();
  }
}
let saved = readSaved();
const menu = document.querySelector('#main-nav');
const toggle = document.querySelector('.menu-toggle');
const shop = document.querySelector('#shop');
const names = {all:'All items', ebooks:'Ebooks', 'wedding-cards':'Wedding cards', classes:'Classes', saved:'Saved items'};
let category = 'all';
function closeMenu() {
  menu?.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');
  toggle?.setAttribute('aria-label','Open navigation');
}
toggle?.addEventListener('click', () => {
  if (menu.classList.contains('open')) return closeMenu();
  menu.classList.add('open');
  toggle.setAttribute('aria-expanded','true');
  toggle.setAttribute('aria-label','Close navigation');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu?.classList.contains('open')) {closeMenu();toggle.focus();}
});
document.addEventListener('click', e => {
  if (!e.target.closest('.mast') || e.target.closest('#main-nav a')) closeMenu();
});
function paintSaved() {
  document.querySelectorAll('[data-save]').forEach(button => {
    const marked = saved.has(button.dataset.save);
    button.setAttribute('aria-pressed', String(marked));
    button.setAttribute('aria-label',(marked?'Remove ':'Save ')+button.dataset.title+(marked?' from saved items':''));
    const label = button.querySelector('span');
    if (label) label.textContent = marked ? 'Saved on this device' : 'Save for later';
  });
  document.querySelectorAll('.save-count').forEach(count => {
    count.hidden = !saved.size;
    count.textContent = String(saved.size);
  });
}
function paintShop() {
  if (!shop) return;
  let total = 0;
  shop.querySelectorAll('.card').forEach(card => {
    const show = category === 'all' || (category === 'saved' ? saved.has(card.dataset.id) : card.dataset.group === category);
    card.hidden = !show;
    if (show) total++;
  });
  const savedView = category === 'saved';
  document.querySelector('#empty-saved').hidden = !savedView || total !== 0;
  document.querySelector('#shelf-title').innerHTML = savedView ? 'Your saved shelf<span>.</span>' : 'The studio shelf<span>.</span>';
  document.querySelector('#shelf-description').textContent = savedView ? 'Your bookmarks, kept on this device.' : 'Browse our ebooks, invitations, and classes.';
  document.querySelector('#filter-status').textContent = names[category] + ', ' + total + (total===1?' item':' items');
  shop.querySelectorAll('[data-filter]').forEach(link => {
    const active = link.dataset.filter === category;
    link.classList.toggle('active',active);
    if(active) link.setAttribute('aria-current','true'); else link.removeAttribute('aria-current');
  });
}
function selectLocation(scroll) {
  if (!shop) return;
  const hash = location.hash.slice(1);
  const filtering = Object.hasOwn(names,hash) || hash === 'shop';
  if (filtering || !hash || hash==='top') {
    category = Object.hasOwn(names,hash) ? hash : 'all';
    paintShop();
  }
  const navKey = hash === 'studio' ? 'studio' : category === 'all'?'shop':category;
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('current', a.dataset.nav===navKey);
    if(a.dataset.nav===navKey)a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
  });
  if(scroll && filtering) shop.scrollIntoView({block:'start'});
}
document.addEventListener('click', e => {
  const button = e.target.closest('[data-save]');
  if (button) {
    const id = button.dataset.save;
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    try {localStorage.setItem(storageKey,JSON.stringify([...saved]));} catch { /* Keep bookmarks usable for this page visit. */ }
    paintSaved();
    if (category==='saved') {
      paintShop();
      (shop.querySelector('.card:not([hidden]) [data-save]') || document.querySelector('#empty-saved a'))?.focus();
    }
  }
  const link = e.target.closest('a[href]');
  if (shop && link && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    const dest = new URL(link.href);
    if (dest.origin===location.origin && (dest.pathname===location.pathname || dest.pathname.replace(/index\.html$/,'')===location.pathname.replace(/index\.html$/,'')) && (dest.hash==='#shop' || Object.hasOwn(names,dest.hash.slice(1)))) {
      e.preventDefault();
      if(location.hash!==dest.hash) history.pushState(null,'',dest.hash);
      selectLocation(!link.hasAttribute('data-filter'));
    }
  }
});
window.addEventListener('hashchange',()=>selectLocation(true));
window.addEventListener('pageshow',()=>{saved=readSaved();paintSaved();paintShop();});
window.addEventListener('storage',e=>{if(e.key===storageKey || e.key===null){saved=readSaved();paintSaved();paintShop();}});
paintSaved();
selectLocation(Boolean(location.hash));
