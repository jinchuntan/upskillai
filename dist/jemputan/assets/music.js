(() => {
  const player = document.querySelector('#wedding-music');
  const controls = document.querySelectorAll('.music-control');
  const feedback = document.querySelectorAll('.music-feedback');
  const malay = document.documentElement.lang === 'ms';
  player.volume = 0.75;

  function updateControls() {
    for (const button of controls) {
      button.querySelector('[data-label]').textContent = player.paused ? button.dataset.play : button.dataset.pause;
    }
  }

  function reportFailure() {
    for (const status of feedback) status.textContent = malay ? 'Muzik tidak dapat dimainkan. Cuba lagi.' : 'Music could not play. Please try again.';
  }

  for (const button of controls) {
    button.hidden = false;
    button.addEventListener('click', async () => {
      for (const status of feedback) status.textContent = '';
      if (!player.paused) {
        player.pause();
        return;
      }
      try {
        if (player.error) player.load();
        await player.play();
      } catch (error) {
        if (error.name !== 'AbortError') reportFailure();
      }
    });
  }

  player.addEventListener('play', updateControls);
  player.addEventListener('pause', updateControls);
  player.addEventListener('error', () => { player.pause(); updateControls(); reportFailure(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) player.pause(); });
  window.addEventListener('pagehide', () => player.pause());
})();
