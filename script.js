// Simple client-side navigation with keyboard support
// 👉 Replace the destination with your existing page (relative path or full URL)
const DESTINATION = 'boardgame.html';

document.addEventListener('DOMContentLoaded', () => {
  const cta = document.getElementById('cta');
  if (!cta) return;

  const go = () => { window.location.href = DESTINATION; };

  cta.addEventListener('click', go);
  cta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      go();
    }
  });
});

