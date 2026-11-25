/* ============================================================
   TANSY SVERRE HOMES — GALLERY LIGHTBOX (Version 17)
   Loaded site-wide from the Body tracking code with ONE line:
     <script src="https://buzz-png.github.io/nsb-widgets/tansy/lightbox.js" defer></script>
   Click any image in an Image Slider (or any image with the class
   "lightbox") to open it full screen. Arrows / swipe to flick through,
   Esc / X / click outside to close.
   ============================================================ */
(function(){
  if (window.__tsLightbox) return; window.__tsLightbox = true;

  var css =
    ".ts-lb{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;background:rgba(0,26,36,.96);font-family:'Montserrat','Helvetica Neue',Arial,sans-serif;-webkit-user-select:none;user-select:none}" +
    ".ts-lb.open{display:flex}" +
    ".ts-lb-img{max-width:92vw;max-height:84vh;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.45);opacity:0;transition:opacity .25s ease}" +
    ".ts-lb-img.ready{opacity:1}" +
    ".ts-lb button{position:absolute;background:none;border:1px solid rgba(217,148,59,.0);color:#fff;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;transition:color .2s ease,border-color .2s ease}" +
    ".ts-lb button:hover,.ts-lb button:focus-visible{color:#D9943B;border-color:#D9943B;outline:none}" +
    ".ts-lb-close{top:18px;right:18px;width:48px;height:48px;font-size:34px;line-height:1}" +
    ".ts-lb-prev,.ts-lb-next{top:50%;transform:translateY(-50%);width:56px;height:56px;font-size:40px;line-height:1}" +
    ".ts-lb-prev{left:18px}.ts-lb-next{right:18px}" +
    ".ts-lb-count{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);color:#D9943B;font-size:13px;letter-spacing:.3em;font-weight:500;font-variant-numeric:tabular-nums}" +
    "@media (max-width:640px){.ts-lb-prev,.ts-lb-next{top:auto;bottom:10px;transform:none;width:48px;height:48px}.ts-lb-img{max-height:76vh}}" +
    ".c-image-slider .carousel__slide img,img.lightbox,.lightbox img{cursor:zoom-in}";
  var st = document.createElement('style'); st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  // Full-size URL: the builder serves resized copies; pull the original if present
  function fullSrc(img){
    var s = img.currentSrc || img.src || '';
    var i = s.indexOf('/u_');
    return i > -1 ? decodeURIComponent(s.slice(i + 3)) : s;
  }

  var lb, imgEl, countEl, list = [], idx = 0, lastFocus;

  function build(){
    lb = document.createElement('div');
    lb.className = 'ts-lb';
    lb.setAttribute('role','dialog');
    lb.setAttribute('aria-modal','true');
    lb.setAttribute('aria-label','Photo gallery');
    lb.innerHTML =
      '<img class="ts-lb-img" alt="">' +
      '<button type="button" class="ts-lb-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="ts-lb-prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="ts-lb-next" aria-label="Next photo">&#8250;</button>' +
      '<div class="ts-lb-count"></div>';
    document.body.appendChild(lb);
    imgEl = lb.querySelector('.ts-lb-img');
    countEl = lb.querySelector('.ts-lb-count');
    lb.querySelector('.ts-lb-close').onclick = close;
    lb.querySelector('.ts-lb-prev').onclick = function(e){ e.stopPropagation(); go(-1); };
    lb.querySelector('.ts-lb-next').onclick = function(e){ e.stopPropagation(); go(1); };
    lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
    imgEl.addEventListener('load', function(){ imgEl.classList.add('ready'); });

    // Swipe on phones
    var x0 = null;
    lb.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  function show(){
    imgEl.classList.remove('ready');
    imgEl.src = list[idx];
    countEl.textContent = (idx + 1) + ' / ' + list.length;
    var multi = list.length > 1;
    lb.querySelector('.ts-lb-prev').style.display = multi ? '' : 'none';
    lb.querySelector('.ts-lb-next').style.display = multi ? '' : 'none';
    // Preload neighbours so flicking is instant
    [idx + 1, idx - 1].forEach(function(n){
      var j = (n + list.length) % list.length; (new Image()).src = list[j];
    });
  }
  function go(step){ idx = (idx + step + list.length) % list.length; show(); }

  function open(urls, start){
    if (!lb) build();
    list = urls; idx = start; lastFocus = document.activeElement;
    show();
    lb.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    lb.querySelector('.ts-lb-close').focus();
  }
  function close(){
    lb.classList.remove('open');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', function(e){
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });

  // Capture phase so the builder's own slider click doesn't swallow it
  document.addEventListener('click', function(e){
    var img = e.target.closest && e.target.closest('img');
    if (!img) return;
    var group = img.closest('.c-image-slider');
    var tagged = img.classList.contains('lightbox') || img.closest('.lightbox');
    if (!group && !tagged) return;

    e.preventDefault(); e.stopPropagation();

    var scope = group || img.closest('.c-section') || document;
    var sel = group ? '.carousel__slide img' : 'img.lightbox, .lightbox img';
    var urls = [];
    scope.querySelectorAll(sel).forEach(function(el){
      var u = fullSrc(el); if (u && urls.indexOf(u) === -1) urls.push(u);
    });
    var start = Math.max(0, urls.indexOf(fullSrc(img)));
    open(urls, start);
  }, true);
})();
