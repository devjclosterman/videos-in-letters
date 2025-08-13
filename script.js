(() => {
  const hero = document.getElementById('df-hero');
  const slides = Array.from(hero.querySelectorAll('.df-slide'));
  if (!slides.length) return;

  // Build static “ghost” stack once (for that staggered faded list vibe)
  const ghostWords = slides.map(s => s.dataset.word);
  const ghostWrap = document.createElement('div');
  ghostWrap.className = 'df-ghosts';
  ghostWrap.innerHTML = ghostWords.map(w => `<h2>${w}.</h2>`).join('');
  hero.appendChild(ghostWrap);

  // For each slide, inject an SVG foreignObject + video clipped to text
  const svgNS = 'http://www.w3.org/2000/svg';
  const xhtml = 'http://www.w3.org/1999/xhtml';
  const defsText = document.getElementById('df-clip-text');

  function setClipWord(word){
    defsText.textContent = word + '.';
    // center baseline in objectBoundingBox space:
    defsText.setAttribute('x','0.5');
    defsText.setAttribute('y','0.5');
  }

  slides.forEach((slide, i) => {
    const word = slide.dataset.word || 'Word';
    const vid = slide.dataset.video;

    // Word layer (SVG foreignObject that gets clipped by the <clipPath>)
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class','df-word-layer');
    svg.setAttribute('viewBox','0 0 100 100');
    svg.setAttribute('preserveAspectRatio','xMidYMid slice');

    const fo = document.createElementNS(svgNS, 'foreignObject');
    fo.setAttribute('class', 'df-fo');
    fo.setAttribute('x','0'); fo.setAttribute('y','0'); fo.setAttribute('width','100%'); fo.setAttribute('height','100%');
    fo.setAttribute('clip-path','url(#df-text-clip)');

    const div = document.createElementNS(xhtml, 'div');
    const video = document.createElementNS(xhtml, 'video');
    video.setAttribute('autoplay','');
    video.setAttribute('muted','');
    video.setAttribute('loop','');
    video.setAttribute('playsinline','');
    video.setAttribute('preload','metadata');
    video.innerHTML = `<source src="${vid}" type="video/mp4" />`;
    div.appendChild(video);
    fo.appendChild(div);
    svg.appendChild(fo);

    // Label for screen readers (hidden visually)
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = word;

    slide.appendChild(svg);
    slide.appendChild(sr);

    // First slide visible immediately
    if (i === 0) {
      setClipWord(word);
      slide.classList.add('is-active');
    }
  });

  // Cycle slides
  let idx = 0;
  const DELAY = parseInt(getComputedStyle(hero).getPropertyValue('--df-delay')) || 2600;

  setInterval(() => {
    const current = slides[idx];
    idx = (idx + 1) % slides.length;
    const next = slides[idx];

    // Update the mask text to the next word
    setClipWord(next.dataset.word);

    current.classList.remove('is-active');
    next.classList.add('is-active');
  }, DELAY);
})();

