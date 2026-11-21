const share = document.querySelector('.share');
const cleanUrl = new URL(location.href);
cleanUrl.hash = '';
cleanUrl.search = '';
const invitationTitle = document.querySelector('meta[property="og:title"]').content;
document.querySelector('#whatsapp').href = 'https://wa.me/?text=' +
  encodeURIComponent(invitationTitle + '\nSample wedding invitation\n' + cleanUrl.href);

const copyButton = document.querySelector('#copy-link');
const manualLink = document.querySelector('#manual-link');
const shareStatus = document.querySelector('#share-status');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(cleanUrl.href);
    shareStatus.textContent = 'Invitation link copied.';
  } catch {
    manualLink.hidden = false;
    manualLink.value = cleanUrl.href;
    manualLink.focus();
    manualLink.select();
    shareStatus.textContent = 'Select and copy the link above.';
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

const replyForm = document.querySelector('#reply-form');
const guestCount = document.querySelector('.guest-count');
const replyResult = document.querySelector('.reply-result');
replyForm.hidden = false;
replyForm.addEventListener('change', () => {
  guestCount.hidden = replyForm.elements.attendance.value !== 'yes';
  replyResult.textContent = '';
});
replyForm.addEventListener('submit', event => {
  event.preventDefault();
  const guests = Number(replyForm.elements.guests.value);
  replyResult.textContent = replyForm.elements.attendance.value === 'yes'
    ? 'Your sample reply: Joyfully attending with ' + guests + (guests === 1 ? ' guest in total.' : ' guests in total.')
    : 'Your sample reply: Sending our love from afar. Wishing you a beautiful wedding!';
});

function enableOpening() {
  const cover = document.querySelector('.opening');
  if (typeof cover.showModal !== 'function') return;

  const replay = document.querySelector('.replay');
  const card = cover.querySelector('.sealed-card');
  const petals = document.querySelector('.petal-shower');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let openingTimer;
  let openingRun = 0;
  let animating = false;

  function showCover() {
    window.clearTimeout(openingTimer);
    openingRun += 1;
    animating = false;
    cover.classList.remove('is-opening');
    petals.classList.remove('drifting');
    cover.showModal();
    document.documentElement.classList.add('cover-closed');
  }

  function finishOpening(withPetals = false) {
    if (!cover.open) return;
    window.clearTimeout(openingTimer);
    openingRun += 1;
    animating = false;
    cover.close();
    cover.classList.remove('is-opening');
    document.documentElement.classList.remove('cover-closed');
    document.querySelector('#names').focus({ preventScroll: true });
    if (withPetals && !motionPreference.matches) petals.classList.add('drifting');
  }

  card.addEventListener('click', () => {
    if (animating) return;
    if (motionPreference.matches) {
      finishOpening();
      return;
    }
    animating = true;
    const activeRun = openingRun;
    cover.classList.add('is-opening');
    // The run guard also covers a skip followed immediately by replay.
    openingTimer = window.setTimeout(() => {
      if (activeRun === openingRun) finishOpening(true);
    }, 1280);
  });
  cover.querySelector('.skip-opening').addEventListener('click', () => finishOpening());
  cover.addEventListener('cancel', event => {
    event.preventDefault();
    finishOpening();
  });
  replay.hidden = false;
  replay.addEventListener('click', () => {
    showCover();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  motionPreference.addEventListener?.('change', () => {
    if (!motionPreference.matches) return;
    petals.classList.remove('drifting');
    if (animating) finishOpening();
  });

  // A link to a ceremony section or reply form should take the guest straight there.
  if (!location.hash && window.scrollY === 0) showCover();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('arrived');
        observer.unobserve(entry.target);
      }
    }, { threshold: .2 });
    document.querySelectorAll('.invitation, .programme').forEach(element => observer.observe(element));
  }
}
enableOpening();
