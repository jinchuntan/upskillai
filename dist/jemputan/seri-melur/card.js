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
