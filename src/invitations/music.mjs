export const musicAssets = '<link rel="stylesheet" href="../assets/music.css"><script src="../assets/music.js" defer></script>';

export function musicButton(language, placement) {
  const malay = language === 'ms';
  const play = malay ? 'Mainkan muzik' : 'Play music';
  const pause = malay ? 'Jeda muzik' : 'Pause music';
  return `<button type="button" class="music-control music-${placement}" data-play="${play}" data-pause="${pause}" hidden><span aria-hidden="true">♫</span> <span data-label>${play}</span></button><span class="music-feedback" role="status"></span>`;
}

export const musicAudio = '<audio id="wedding-music" preload="none" loop src="music.mp3"></audio>';
