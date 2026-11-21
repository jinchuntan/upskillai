const styles={
  garden:{names:['Alya','Danish'],greeting:'Walimatulurus',occasion:'Majlis perkahwinan',motif:'❦',venue:'The Garden Pavilion',welcome:'Dengan penuh kesyukuran, kami menjemput anda sekeluarga untuk meraikan hari bahagia kami. We would love to share this afternoon with you.',schedule:[['11:30 am','Guests arrive'],['12:00 pm','Bersanding'],['12:30 pm','Lunch with the family']],start:'033000',end:'060000'},
  'double-happiness':{names:['Mei Lin','Jun Wei'],greeting:'囍 · Double Happiness',occasion:'Wedding reception',motif:'囍',venue:'The Courtyard Hall',welcome:'Together with our families, we warmly invite you to share a toast and celebrate the beginning of our life together.',schedule:[['6:00 pm','Welcome and photographs'],['6:30 pm','Family tea ceremony'],['7:00 pm','Wedding dinner']],start:'100000',end:'140000'},
  marigold:{names:['Ananya','Kavin'],greeting:'A wedding celebration',occasion:'With our families',motif:'✿',venue:'The Marigold Hall',welcome:'With the blessings of our families, we invite you to join us for our wedding ceremony and a meal shared with the people we love.',schedule:[['9:00 am','Welcome refreshments'],['9:30 am','Wedding ceremony'],['11:30 am','Family lunch']],start:'010000',end:'050000'}
};
const el=id=>document.getElementById(id);
let calendarUrl;
function render(key){
  const s=styles[key];
  document.body.dataset.theme=key;
  el('style').value=key;
  el('couple').replaceChildren(s.names[0]+' ',Object.assign(document.createElement('em'),{textContent:'&'}),' '+s.names[1]);
  document.querySelector('.ornament').textContent=s.motif;
  for(const field of ['greeting','occasion','welcome','venue'])el(field).textContent=s[field];
  el('schedule').replaceChildren(...s.schedule.map(([time,event])=>{
    const row=document.createElement('li');
    row.append(Object.assign(document.createElement('time'),{textContent:time}),event);
    return row;
  }));
  if(calendarUrl)URL.revokeObjectURL(calendarUrl);
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//upskill.ai.my//Sample invitations//EN','BEGIN:VEVENT',
    'UID:'+key+'-20261219@upskill.ai.my','DTSTAMP:20261121T000000Z','DTSTART:20261219T'+s.start+'Z','DTEND:20261219T'+s.end+'Z',
    'SUMMARY:Sample wedding - '+s.names.join(' and '),'LOCATION:'+s.venue+' (sample venue)','END:VEVENT','END:VCALENDAR',''].join('\r\n');
  calendarUrl=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  el('calendar').href=calendarUrl;
  el('guest-page').hidden=true;el('open-invite').hidden=false;el('open-invite').setAttribute('aria-expanded','false');
  el('rsvp').reset();el('rsvp-result').textContent='';
}
const selected=new URL(location.href).searchParams.get('style');
render(Object.hasOwn(styles,selected)?selected:'garden');
el('style').addEventListener('change',e=>{
  const url=new URL(location.href);url.searchParams.set('style',e.target.value);
  history.replaceState(null,'',url);render(e.target.value);
});
el('open-invite').addEventListener('click',()=>{
  el('guest-page').hidden=false;el('open-invite').setAttribute('aria-expanded','true');el('open-invite').hidden=true;el('guest-page').focus();
});
el('rsvp').addEventListener('submit',e=>{
  e.preventDefault();const reply=new FormData(e.currentTarget).get('reply');
  el('rsvp-result').textContent=reply==='yes'?'Sample reply: Joyfully accepted.':'Sample reply: Regretfully declined.';
});
