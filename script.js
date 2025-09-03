(() => {
  const hero   = document.getElementById('df-hero');
  const slides = Array.from(hero.querySelectorAll('.df-slide'));
  if (!slides.length) return;

  // Build ghost list
  const ghosts = hero.querySelector('.df-ghosts');
  ghosts.innerHTML = slides.map(s => `<h2>${s.dataset.word}.</h2>`).join('');

  const svgNS = 'http://www.w3.org/2000/svg';
  const xhtml = 'http://www.w3.org/1999/xhtml';

  function buildSlide(slide, i){
    const word = slide.dataset.word || 'Word';
    const src  = slide.dataset.video || '';
    const clipId = `df-clip-${i}`;

    const layer = document.createElement('div');
    layer.className = 'df-word-layer';

    const svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('viewBox','0 0 100 100');
    svg.setAttribute('preserveAspectRatio','xMidYMid slice');
    svg.style.width = '100%';
    svg.style.height = '100%';

    // defs + clipPath
    const defs = document.createElementNS(svgNS,'defs');
    const clip = document.createElementNS(svgNS,'clipPath');
    clip.setAttribute('id', clipId);
    clip.setAttribute('clipPathUnits','userSpaceOnUse');

    const text = document.createElementNS(svgNS,'text');
    text.setAttribute('x','50%');
    text.setAttribute('y','50%');
    text.setAttribute('text-anchor','middle');
    text.setAttribute('dominant-baseline','central');
    text.setAttribute('font-family','Inter, system-ui, sans-serif');
    text.setAttribute('font-weight','800');
    text.textContent = word + '.';
    clip.appendChild(text);
    defs.appendChild(clip);
    svg.appendChild(defs);

    // Group clipped by text
    const g = document.createElementNS(svgNS,'g');
    g.setAttribute('clip-path', `url(#${clipId})`);

    const fo = document.createElementNS(svgNS,'foreignObject');
    fo.setAttribute('class','df-fo');
    fo.setAttribute('x','0'); fo.setAttribute('y','0');
    fo.setAttribute('width','100%'); fo.setAttribute('height','100%');

    const div = document.createElementNS(xhtml,'div');
    const video = document.createElementNS(xhtml,'video');
    video.setAttribute('autoplay','');
    video.setAttribute('muted','');
    video.setAttribute('loop','');
    video.setAttribute('playsinline','');
    video.setAttribute('preload','metadata');
    video.innerHTML = `<source src="${src}" type="video/mp4">`;

    div.appendChild(video);
    fo.appendChild(div);
    g.appendChild(fo);
    svg.appendChild(g);

    layer.appendChild(svg);
    slide.appendChild(layer);

    // keep font-size responsive
    const updateFontSize = () => {
      const fs = getComputedStyle(document.documentElement).getPropertyValue('--df-fs') || '120px';
      text.setAttribute('font-size', fs.trim());
    };
    new ResizeObserver(updateFontSize).observe(hero);
    updateFontSize();
  }

  slides.forEach(buildSlide);

  // cycle slides
  let i = 0;
  slides[0].classList.add('is-active');
  const HOLD = parseInt(getComputedStyle(hero).getPropertyValue('--df-hold')) || 2600;

  setInterval(() => {
    const cur = slides[i];
    i = (i + 1) % slides.length;
    const nxt = slides[i];
    cur.classList.remove('is-active');
    nxt.classList.add('is-active');
  }, HOLD);
})();
