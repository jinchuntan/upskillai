import { mkdir, writeFile } from 'node:fs/promises';

// All people and wedding arrangements in these invitation samples are fictional.
const celebrations = [
  {
    slug: 'double-happiness',
    collection: 'Double Happiness',
    theme: 'chinese',
    accent: '#8e232a',
    lang: 'zh-Hans',
    symbol: '囍',
    nativeTitle: '喜结良缘',
    nativeGreeting: '诚邀您见证我们的幸福时刻',
    nativeNames: '陈伟俊 & 林慧敏',
    names: ['Wei Jun', 'Hui Min'],
    familyNames: ['The Tan family', 'The Lim family'],
    intro: 'Together with our families, we invite you to an evening of love, laughter, and a little more tea.',
    invitationTitle: 'Two hearts. One happy beginning.',
    invitationCopy: 'Please join us as we honour our families, raise a glass, and begin this next chapter together. Having you there would mean the world to us.',
    blessing: '百年好合 · 永结同心',
    blessingEnglish: 'A lifetime of happiness, together.',
    start: '2026-12-12T17:30:00+08:00',
    end: '2026-12-12T22:00:00+08:00',
    city: 'George Town, Penang',
    venue: 'Eastern & Oriental Hotel',
    address: 'George Town, Penang, Malaysia',
    venueUrl: 'https://www.eohotels.com/',
    programme: [
      { time: '5.30 pm', title: 'A cup of tea, a little gratitude', detail: 'Tea ceremony with our families.' },
      { time: '6.30 pm', title: 'Come in, make yourself at home', detail: 'Guest arrival and a warm welcome.' },
      { time: '7.00 pm', title: 'Let the celebration begin', detail: 'Wedding dinner, toasts, and happy memories.' }
    ],
    artworkAlt: 'Watercolour illustration of red carved courtyard doors, peonies, silk lanterns, and a porcelain wedding tea set',
    dateLabel: 'Save us a little space in your December.',
    openLabel: 'Open invitation',
    openNative: '开启请柬',
    artworkCaption: 'A little tea. A lot of love.',
    footer: 'Your presence is our favourite gift.',
    particles: 'peony'
  },
  {
    slug: 'malli',
    collection: 'Malli',
    theme: 'indian',
    accent: '#59243c',
    lang: 'ta',
    symbol: '✺',
    nativeTitle: 'திருமண அழைப்பிதழ்',
    nativeGreeting: 'வணக்கம்',
    nativeNames: '',
    names: ['Arjun', 'Kavya'],
    familyNames: ['The Raman family', 'The Krishnan family'],
    intro: 'With the blessings of our families, we invite you to share in the joy of our wedding.',
    invitationTitle: 'A new chapter, woven with love.',
    invitationCopy: 'Join us for a morning of wedding rituals, the fragrance of jasmine, and a meal shared with the people we love. We cannot wait to celebrate with you.',
    blessing: 'With love, from both our families.',
    blessingEnglish: '',
    start: '2026-12-20T09:30:00+08:00',
    end: '2026-12-20T14:00:00+08:00',
    city: 'Kuala Lumpur',
    venue: 'The Majestic Hotel Kuala Lumpur',
    address: '5, Jalan Sultan Hishamuddin, 50000 Kuala Lumpur, Malaysia',
    venueUrl: 'https://www.majestickl.com/',
    programme: [
      { time: '9.30 am', title: 'A warm welcome', detail: 'Guest arrival and time with our families.' },
      { time: '10.30 am', title: 'Our wedding ceremony', detail: 'Gather with us as we begin our life together.' },
      { time: '12.30 pm', title: 'Stay for a wedding lunch', detail: 'A shared meal, good company, and new memories.' }
    ],
    artworkAlt: 'Watercolour illustration of a South Indian wedding mandap with jasmine and marigold garlands, brass lamps, and a courtyard kolam',
    dateLabel: 'A December morning to remember.',
    openLabel: 'Open invitation',
    openNative: 'Welcome to our wedding',
    artworkCaption: 'Jasmine in the air. Joy all around.',
    footer: 'Come with love. Leave with memories.',
    particles: 'jasmine'
  }
];

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const dateFormat = (iso, options) => new Intl.DateTimeFormat('en-MY', { timeZone: 'Asia/Kuala_Lumpur', ...options }).format(new Date(iso));
const utcTime = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const calendarEscape = value => value.replaceAll('\\', '\\\\').replaceAll(',', '\\,').replaceAll(';', '\\;').replaceAll('\n', '\\n');

// iCalendar content lines are limited to 75 octets, including a continuation space.
function foldCalendarLine(line) {
  const lines = [];
  let part = '';
  for (const character of line) {
    if (Buffer.byteLength(part + character) > 75) {
      lines.push(part);
      part = ' ';
    }
    part += character;
  }
  lines.push(part);
  return lines.join('\r\n');
}

function calendar(wedding) {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//upskill.ai.my//Wedding samples//EN',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    'UID:' + wedding.slug + '-sample-2026@upskill.ai.my',
    'DTSTAMP:20261121T000000Z',
    'DTSTART:' + utcTime(wedding.start), 'DTEND:' + utcTime(wedding.end),
    'SUMMARY:' + calendarEscape('Sample wedding - ' + wedding.names.join(' & ')),
    'LOCATION:' + calendarEscape(wedding.venue + ', ' + wedding.address),
    'DESCRIPTION:Sample invitation only. This is a fictional wedding event.',
    'END:VEVENT', 'END:VCALENDAR', ''
  ].map(foldCalendarLine).join('\r\n');
}

function page(wedding) {
  const names = wedding.names.map(escape);
  const day = dateFormat(wedding.start, { weekday: 'long' });
  const date = dateFormat(wedding.start, { day: 'numeric', month: 'long', year: 'numeric' });
  const time = dateFormat(wedding.start, { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(wedding.venue + ', ' + wedding.address);
  const metaHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const origin = metaHost && /^[a-z0-9.-]+$/i.test(metaHost) ? 'https://' + metaHost : '';
  const path = '/jemputan/' + wedding.slug + '/';
  const stamp = wedding.theme === 'chinese'
    ? '<span class="double-happiness" lang="zh-Hans">囍</span>'
    : '<span class="flower-stamp" aria-hidden="true">✺</span>';
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(wedding.collection)} · ${names.join(' &amp; ')} | Sample wedding invitation</title>
<meta name="description" content="An illustrated ${wedding.theme === 'chinese' ? 'Chinese' : 'Tamil Hindu'} wedding invitation. ${names.join(' &amp; ')} · ${date}. Sample wedding details.">
<meta name="theme-color" content="${wedding.accent}">
<meta property="og:type" content="website"><meta property="og:locale" content="en_MY">
<meta property="og:title" content="${escape(wedding.collection)} · ${names.join(' &amp; ')}">
<meta property="og:description" content="Open our sample invitation · ${date} · ${escape(wedding.city)}">
<meta property="og:image" content="${origin}${path}courtyard.webp">
${origin ? `<meta property="og:url" content="${origin}${path}">` : ''}
<link rel="icon" href="../../assets/flower.svg">
<link rel="preload" href="../../assets/serif.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="../assets/celebration.css"><script src="../assets/celebration.js" defer></script>
</head><body class="${wedding.theme}" id="top">
<a class="skip-content" href="#invitation">Skip to invitation</a>
<dialog class="opening" aria-label="${escape(wedding.collection)} invitation cover" aria-describedby="cover-description">
  <p id="cover-description" class="visually-hidden">${names.join(' and ')}. ${date}. ${escape(wedding.city)}. Activate the card to open the invitation.</p>
  <div class="opening-stage">
    <button class="skip-opening" type="button">Skip opening</button>
    <div class="stationery">
      <p class="collection-name">${escape(wedding.collection)}</p>
      <button class="sealed-card" type="button" aria-label="Open ${names.join(' and ')}’s wedding invitation" autofocus>
        <span class="paper-leaf paper-left" aria-hidden="true"><span></span></span>
        <span class="paper-leaf paper-right" aria-hidden="true"><span></span></span>
        <span class="envelope-flap" aria-hidden="true"></span>
        <span class="cover-native native" lang="${wedding.lang}" aria-hidden="true">${wedding.nativeTitle}</span>
        <span class="seal" aria-hidden="true">${stamp}</span>
        <span class="cover-names" aria-hidden="true">${names[0]} <i>&amp;</i> ${names[1]}</span>
        <span class="open-label" aria-hidden="true">${wedding.openLabel}<small ${wedding.theme === 'chinese' ? 'lang="zh-Hans"' : ''}>${wedding.openNative}</small></span>
      </button>
      <p class="cover-date">${date} <span aria-hidden="true">·</span> ${escape(wedding.city)}</p>
    </div>
  </div>
</dialog>
<header class="site-header"><a class="wordmark" href="#top">${stamp}<span>${escape(wedding.collection)}</span></a>
<nav aria-label="Invitation menu"><a href="#invitation">Invitation</a><a href="#celebration">The day</a><a href="#rsvp">RSVP</a></nav>
<details class="share"><summary>Share card</summary><div class="share-panel">
<a id="whatsapp" href="https://wa.me/?text=${encodeURIComponent(wedding.collection + ' sample invitation')}" target="_blank" rel="noopener">Share on WhatsApp</a>
<button id="copy-link" type="button" hidden>Copy link</button><input id="manual-link" aria-label="Invitation link to copy" readonly hidden><p id="share-status" role="status"></p>
</div></details></header>
<main>
<section class="hero" aria-labelledby="names">
  <div class="hero-copy"><span class="sample-label">Sample invitation</span>
    <p class="native hero-native" lang="${wedding.lang}">${wedding.nativeTitle}</p>
    <p class="eyebrow">We’re getting married</p>
    <h1 id="names" tabindex="-1"><span>${names[0]}</span><i>&amp;</i><span>${names[1]}</span></h1>
    ${wedding.nativeNames ? `<p class="native chinese-names" lang="zh-Hans">${wedding.nativeNames}</p>` : ''}
    <p class="hero-intro">${wedding.intro}</p>
    <div class="hero-date"><p>${day}, ${date}</p><span>${escape(wedding.city)}</span></div>
    <a class="button" href="#invitation">You’re warmly invited</a>
  </div>
  <div class="hero-art"><img src="courtyard.webp" width="960" height="1200" fetchpriority="high" alt="${wedding.artworkAlt}">
  <span class="petal-shower ${wedding.particles}" aria-hidden="true">${'<i></i>'.repeat(9)}</span>
  <p class="artwork-caption">${wedding.artworkCaption}</p></div>
</section>
<section class="invitation section" id="invitation" aria-labelledby="invitation-title">
  <p class="greeting native" lang="${wedding.lang}">${wedding.nativeGreeting}</p>
  <h2 id="invitation-title">${wedding.invitationTitle}</h2>
  <p class="invitation-message">${wedding.invitationCopy}</p>
  <div class="family-signature"><span>${wedding.familyNames[0]}</span><i>&amp;</i><span>${wedding.familyNames[1]}</span></div>
  <p class="blessing ${wedding.theme === 'chinese' ? 'native' : ''}" ${wedding.theme === 'chinese' ? 'lang="zh-Hans"' : ''}>${wedding.blessing}</p>
  ${wedding.blessingEnglish ? `<p class="blessing-translation">${wedding.blessingEnglish}</p>` : ''}
</section>
<section class="celebration" id="celebration" aria-labelledby="day-title"><div class="section celebration-layout">
  <div class="day-intro"><p class="eyebrow">A day with our favourite people</p><h2 id="day-title">The celebration</h2><p>${wedding.dateLabel}</p>
  <div class="date-ticket"><span>${day}</span><strong>${date}</strong><span>From ${time} · Malaysia time</span></div>
  <a class="text-link" href="wedding.ics" download>Save to your calendar</a></div>
  <ol class="programme">${wedding.programme.map(item => `<li><time>${item.time}</time><div><h3>${item.title}</h3><p>${item.detail}</p></div></li>`).join('')}</ol>
</div></section>
<section class="venue section" id="venue" aria-labelledby="venue-title">
  <div class="venue-heading"><p class="eyebrow">We’ll meet you here</p><h2 id="venue-title">A place to celebrate.</h2></div>
  <div class="venue-details"><h3>${escape(wedding.venue)}</h3><p>${escape(wedding.address)}</p><p class="venue-note">Example venue for this sample invitation.</p>
  <div class="venue-links"><a class="button" href="${maps}" target="_blank" rel="noopener">Get directions</a><a class="text-link" href="${wedding.venueUrl}" target="_blank" rel="noopener">Venue website</a></div></div>
</section>
<section class="reply" id="rsvp" aria-labelledby="rsvp-title"><div class="section reply-layout">
  <div><p class="eyebrow">Save you a seat?</p><h2 id="rsvp-title">We’d love to see you.</h2><p>Try a guest reply below. This sample only previews your response on this page.</p></div>
  <form id="reply-form" hidden><fieldset><legend>Will you be joining us?</legend>
    <label><input type="radio" name="attendance" value="yes" required> Joyfully attending</label>
    <label><input type="radio" name="attendance" value="no"> Sending our love from afar</label>
  </fieldset><label class="guest-count" hidden>Number of guests <select name="guests">${Array.from({length:8},(_,i)=>`<option value="${i+1}">${i+1} ${i === 0 ? 'guest' : 'guests'}</option>`).join('')}</select></label>
  <button class="button" type="submit">Preview reply</button><p class="reply-result" role="status"></p></form>
  <noscript>Enable JavaScript to try a sample guest reply.</noscript>
</div></section>
</main>
<footer><p class="footer-symbol" aria-hidden="true">${stamp}</p><p class="footer-message">${wedding.footer}</p><p>${names.join(' &amp; ')} · ${date}</p>
<button class="replay" type="button" hidden>Replay card opening</button><a href="../../index.html#wedding-cards">Wedding cards by upskill.ai.my</a></footer>
<nav class="mobile-menu" aria-label="Quick links"><a href="#celebration">The day</a><a href="#venue">Directions</a><a href="#rsvp">RSVP</a></nav>
</body></html>\n`;
}

export async function buildCelebrations() {
  for (const wedding of celebrations) {
    const directory = new URL('../../dist/jemputan/' + wedding.slug + '/', import.meta.url);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL('index.html', directory), page(wedding));
    await writeFile(new URL('wedding.ics', directory), calendar(wedding));
  }
}
