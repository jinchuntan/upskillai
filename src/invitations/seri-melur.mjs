import { musicAssets, musicAudio, musicButton } from './music.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { icon } from '../icons.mjs';

const wedding = {
  title: 'Seri Melur',
  couples: [
    {short: ['Alya', 'Hakim'], full: ['Nur Alya binti Azman', 'Muhammad Hakim bin Zulkifli']},
    {short: ['Irfan', 'Maisara'], full: ['Muhammad Irfan bin Azman', 'Nur Maisara binti Farid']}
  ],
  hosts: ['Encik Azman bin Rahim', 'Puan Salmah binti Hassan'],
  start: '2026-12-19T11:00:00+08:00',
  end: '2026-12-19T16:00:00+08:00',
  venue: 'Alida Wedding Hall',
  address: ['Lot 21568, Jalan Pintasan Muar,', 'Jalan Ismail, 84000 Muar, Johor.'],
  town: 'Muar, Johor'
};

const glyphs = {
  location: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v5m10-5v5M3 10h18"/>',
  time: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  share: '<path d="M12 15V3m-4 4 4-4 4 4M6 11H4v10h16V11h-2"/>'
};
const lineIcon = key => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${glyphs[key]}</svg>`;
const blossom = '<svg class="blossom" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35">'+Array.from({length:8},(_,i)=>`<path transform="rotate(${i*45} 24 24)" d="M24 4c-7 6-6 12 0 17 6-5 7-11 0-17Z"/>`).join('')+'<circle cx="24" cy="24" r="4.5"/></svg>';
const jewel = '<span class="jewel" aria-hidden="true"></span>';
const fmt = (iso,options) => new Intl.DateTimeFormat('ms-MY',{timeZone:'Asia/Kuala_Lumpur',...options}).format(new Date(iso));
const icsTime = iso => new Date(iso).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const address = wedding.address.join(' ').replace(/\.$/,'');
const date = fmt(wedding.start,{day:'numeric',month:'long',year:'numeric'});
const day = fmt(wedding.start,{weekday:'long'});
function clock(iso) {
  const parts = new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kuala_Lumpur',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(iso));
  const hour = Number(parts.find(p=>p.type==='hour').value);
  const min = parts.find(p=>p.type==='minute').value;
  const period = hour < 12 ? 'pagi' : hour < 14 ? 'tengah hari' : hour < 19 ? 'petang' : 'malam';
  return (hour%12||12)+'.'+min+' '+period;
}
const summary = wedding.couples.map(c=>c.short.join(' & ')).join(' serta ');
const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(wedding.venue+', '+address);
const metaHost=process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const host=metaHost && /^[a-z0-9.-]+$/i.test(metaHost) ? 'https://'+metaHost : '';
const permalink = '/jemputan/seri-melur/';
const datesAndPlace = `${day}, ${date} · ${wedding.town}`;
const coverNames = wedding.couples.map(couple => `<span>${couple.short.join(' <em>&amp;</em> ')}</span>`).join('<small>serta</small>');
const petals = '<span class="petals" aria-hidden="true">' + '<i></i>'.repeat(7) + '</span>';
const controls = '<a href="#jemputan">Jemputan</a><a href="#butiran">Butiran majlis</a><a href="#kehadiran">Kehadiran</a>';
const out = new URL('../../dist/jemputan/seri-melur/',import.meta.url);
export async function buildSeriMelur() {
  await mkdir(out,{recursive:true});
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//upskill.ai.my//Seri Melur//MS','CALSCALE:GREGORIAN','BEGIN:VEVENT',
    'UID:seri-melur-demo-20261219@upskill.ai.my','DTSTAMP:20261121T000000Z','DTSTART:'+icsTime(wedding.start),'DTEND:'+icsTime(wedding.end),
    'SUMMARY:Contoh majlis perkahwinan - '+summary,'LOCATION:'+wedding.venue+'\\,', '  '+address.replaceAll(',','\\,'),
    'DESCRIPTION:Acara contoh untuk pratonton kad Seri Melur.','END:VEVENT','END:VCALENDAR',''].join('\r\n');
  await writeFile(new URL('majlis.ics',out),ics);
  await writeFile(new URL('index.html',out),`<!doctype html>
<html lang="ms"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${wedding.title} | ${summary} · Contoh e-kad</title>
<meta name="description" content="Contoh undangan perkahwinan Melayu untuk dua pasangan. ${datesAndPlace}.">
<meta name="theme-color" content="#183e34"><meta property="og:locale" content="ms_MY"><meta property="og:type" content="website">
<meta property="og:title" content="Seri Melur · ${summary}"><meta property="og:description" content="Contoh jemputan walimatulurus · ${datesAndPlace}.">
<meta property="og:image" content="${host}${permalink}gerbang.webp">${host?`<meta property="og:url" content="${host}${permalink}">`:''}
<link rel="icon" href="../../assets/flower.svg"><link rel="stylesheet" href="card.css"><link rel="preload" as="font" crossorigin href="../../assets/serif.woff" type="font/woff"><script src="card.js" defer></script>${musicAssets}</head>
<body id="atas"><a class="skip" href="#jemputan">Terus ke jemputan</a>
<dialog class="opening" id="opening" aria-label="Sampul jemputan Seri Melur" aria-describedby="opening-description">
  <p id="opening-description" hidden>${summary}. ${datesAndPlace}.</p>
  <div class="opening-mat">
    ${musicButton('ms', 'cover')}
    <button type="button" class="opening-skip">Langkau <span aria-hidden="true">↗</span></button>
    <div class="opening-stationery">
      <p class="opening-title">${blossom}<span>Seri Melur</span></p>
      <button class="folded-card" type="button" aria-label="Buka kad jemputan Seri Melur" autofocus>
        <span class="leaf leaf-left" aria-hidden="true"><span class="leaf-print"></span></span>
        <span class="leaf leaf-right" aria-hidden="true"><span class="leaf-print"></span></span>
        <span class="card-caption" aria-hidden="true">Walimatulurus</span>
        <span class="fastening" aria-hidden="true"><span class="wax"><span>${blossom}</span></span><span class="seal-label">Buka kad</span></span>
        <span class="cover-lettering" aria-hidden="true">${coverNames}</span>
      </button>
      <p class="opening-dateline"><span>${date}</span><i aria-hidden="true"></i><span>${wedding.town}</span></p>
    </div>
  </div>
</dialog>
<header class="mast"><div class="mast-in"><a href="#atas" class="brand">${blossom}<span>Seri Melur</span></a><nav aria-label="Menu jemputan">${controls}</nav><div class="mast-end"><span class="demo">Contoh e-kad</span><details class="share"><summary>${lineIcon('share')}Kongsi</summary><div class="share-box"><p>Kongsi kad contoh ini</p><a id="whatsapp" href="https://wa.me/?text=${encodeURIComponent('Contoh e-kad Seri Melur · '+summary+(host?' '+host+permalink:''))}" target="_blank" rel="noopener">Kongsi di WhatsApp</a><button hidden id="copy" type="button">Salin pautan</button><input id="share-url" aria-label="Pautan untuk disalin" hidden readonly><span id="share-msg" role="status"></span></div></details></div></div></header>
<main>
<section class="cover" aria-labelledby="names"><div class="cover-in"><div class="front">
<div class="corners" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<div class="front-inner"><div class="crest">${blossom}</div><p class="kicker ruled">Walimatulurus</p>
<h1 id="names" tabindex="-1">${wedding.couples.map(c=>`<span class="couple">${c.short[0]} <em>&amp;</em> ${c.short[1]}</span>`).join('<span class="serta">serta</span>')}</h1>
<p class="front-date">${day}, ${date}</p><p class="front-town">${wedding.town}</p><a class="gold-btn" href="#jemputan">${icon('mail')}Baca jemputan</a></div></div>
<div class="art"><img src="gerbang.webp" width="960" height="1200" fetchpriority="high" alt="Ilustrasi rumah kayu Melayu dengan pintu berukir, pohon palma dan bunga melur">${petals}</div></div></section>
<section class="family" id="jemputan" tabindex="-1" aria-labelledby="salam"><p class="arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><h2 id="salam">Assalamualaikum <em>dan</em> salam sejahtera.</h2>
<p>Dengan penuh kesyukuran ke hadrat Ilahi, kami</p><p class="host-names">${wedding.hosts[0]} <em>&amp;</em> ${wedding.hosts[1]}</p>
<p class="invitation-text">dengan sukacitanya menjemput Dato’, Datin, tuan, puan, encik dan cik seisi keluarga untuk meraikan perkahwinan puteri dan putera kami bersama pasangan masing-masing.</p>
<div class="families">${wedding.couples.map(c=>`<p>${c.full[0]}<em>&amp;</em>${c.full[1]}</p>`).join('<span class="family-divider" aria-hidden="true">✧</span>')}</div></section>
<section id="butiran" class="details" aria-labelledby="majlis"><div class="section-wrap"><p class="kicker with-lines">${jewel} Waktu &amp; tempat ${jewel}</p><h2 id="majlis">Butiran majlis</h2>
<div class="facts"><div>${lineIcon('calendar')}<h3>Tarikh</h3><strong>${date}</strong><p>${day}</p><a href="majlis.ics" download>Simpan ke kalendar</a></div><div>${lineIcon('time')}<h3>Masa</h3><strong>${clock(wedding.start)} – ${clock(wedding.end)}</strong><p>Waktu Malaysia</p></div><div>${lineIcon('location')}<h3>Lokasi</h3><strong>${wedding.venue}</strong><p>${wedding.address.join('<br>')}</p><a href="${maps}" target="_blank" rel="noopener">Buka Google Maps</a></div></div></div></section>
<section id="kehadiran" class="rsvp" aria-labelledby="rsvp-title"><div class="section-wrap response"><div><p class="kicker">Maklum balas tetamu</p><h2 id="rsvp-title">Dapatkah anda hadir?</h2><p>Ini kad contoh. Pilihan anda hanya dipaparkan pada halaman ini.</p></div><form id="rsvp-form" hidden><fieldset><legend>Pilihan kehadiran</legend><label><input type="radio" name="attend" value="yes" required> Insya-Allah, hadir</label><label><input type="radio" name="attend" value="no"> Maaf, tidak dapat hadir</label></fieldset><label id="party" hidden>Bilangan tetamu <select name="guests">${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n} orang</option>`).join('')}</select></label><button type="submit" class="green-btn">Pratonton jawapan</button><p id="result" role="status"></p></form><noscript>Aktifkan JavaScript untuk mencuba pratonton kehadiran.</noscript></div></section>
</main><footer>${blossom}<p>Terima kasih atas doa dan ingatan.</p><button type="button" class="replay" hidden>Ulang pembukaan kad</button><span>Seri Melur · <a href="../../index.html#wedding-cards">Koleksi kad upskill.ai.my</a></span></footer>
${musicAudio}${musicButton('ms', 'page')}
</body></html>\n`);
}
