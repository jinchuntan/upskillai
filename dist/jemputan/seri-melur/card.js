const share = document.querySelector('.share');
const shareUrl = new URL(location.href);
shareUrl.hash = '';
shareUrl.search = '';
const sharingText = document.querySelector('meta[property="og:title"]').content;
document.querySelector('#whatsapp').href = 'https://wa.me/?text=' +
  encodeURIComponent(sharingText + '\n\nBuka kad contoh ini:\n' + shareUrl.href);
const copy = document.querySelector('#copy');
const manual = document.querySelector('#share-url');
const shareStatus = document.querySelector('#share-msg');
copy.hidden = false;
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.href);
    shareStatus.textContent = 'Pautan telah disalin.';
  } catch {
    manual.hidden = false;
    manual.value = shareUrl.href;
    manual.focus();
    manual.select();
    shareStatus.textContent = 'Pilih dan salin pautan di atas.';
  }
});
document.addEventListener('click', event => {
  if (share.open && !share.contains(event.target)) share.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && share.open) {
    share.open = false;
    share.querySelector('summary').focus();
  }
});
const form = document.querySelector('#rsvp-form');
form.hidden = false;
const party = document.querySelector('#party');
const result = document.querySelector('#result');
form.addEventListener('change', () => {
  party.hidden = form.elements.attend.value !== 'yes';
  result.textContent = '';
});
form.addEventListener('submit', event => {
  event.preventDefault();
  result.textContent = form.elements.attend.value === 'yes'
    ? 'Contoh jawapan anda: Insya-Allah, saya akan hadir. Bilangan tetamu: ' + form.elements.guests.value + ' orang.'
    : 'Contoh jawapan anda: Maaf, saya tidak dapat hadir. Selamat pengantin baharu!';
});

function enableCardOpening() {
  const opening = document.querySelector('#opening');
  if (typeof opening.showModal !== 'function') return;

  const foldedCard = opening.querySelector('.folded-card');
  const skip = opening.querySelector('.opening-skip');
  const replay = document.querySelector('.replay');
  const petals = document.querySelector('.petals');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let closeTimer;

  function showCover() {
    petals.classList.remove('drifting');
    opening.showModal();
    document.documentElement.classList.add('card-closed');
  }

  function revealInvitation(withPetals = false) {
    if (!opening.open) return;
    window.clearTimeout(closeTimer);
    opening.close();
    opening.classList.remove('is-opening');
    document.documentElement.classList.remove('card-closed');
    document.querySelector('#names').focus({preventScroll: true});
    if (withPetals && !reducedMotion.matches) petals.classList.add('drifting');
  }

  function openFold() {
    if (opening.classList.contains('is-opening')) return;
    if (reducedMotion.matches) {
      revealInvitation();
      return;
    }
    opening.classList.add('is-opening');
    // Embedded browsers can suppress animationend when the tab is backgrounded.
    closeTimer = window.setTimeout(() => revealInvitation(true), 1300);
  }

  foldedCard.addEventListener('click', openFold);
  opening.querySelector('.opening-mat').addEventListener('animationend', event => {
    if (event.target === event.currentTarget && event.animationName === 'clear-mat') {
      revealInvitation(true);
    }
  });
  skip.addEventListener('click', () => revealInvitation());
  opening.addEventListener('cancel', event => {
    event.preventDefault();
    revealInvitation();
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches && opening.classList.contains('is-opening')) revealInvitation();
  });

  replay.hidden = false;
  replay.addEventListener('click', () => {
    showCover();
    window.scrollTo({top: 0, behavior: 'instant'});
  });

  if (!location.hash && window.scrollY === 0) showCover();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('flourish');
        observer.unobserve(entry.target);
      }
    }, {threshold: .25});
    observer.observe(document.querySelector('.families'));
  }
}
enableCardOpening();
