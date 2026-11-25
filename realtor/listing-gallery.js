/* ============================================================
   NSB LISTING GALLERY SCRIPT (Version 31)
   Shared by every realtor client. Loaded site-wide from the Body
   tracking code with ONE line:
     <script src="https://buzz-png.github.io/nsb-widgets/realtor/listing-gallery.js" defer></script>
   Styles live in realtor/master.css (.lg-*). The page only holds the
   [data-lg] markup fed by the listing_NN_gallery custom value.
   ============================================================ */
(function(){
  var CDN='https://assets.cdn.filesafe.space/';
  function sized(u,w){return u.indexOf(CDN)===0?'https://images.leadconnectorhq.com/image/f_webp/q_80/r_'+w+'/u_'+u:u;}
  var box,boxImg,boxCount,cur=null;
  function makeBox(){
    if(box)return;
    box=document.createElement('div');box.className='lg-box';
    box.innerHTML='<img alt=""><button type="button" class="lg-btn lg-prev" aria-label="Previous photo">&#8249;</button><button type="button" class="lg-btn lg-next" aria-label="Next photo">&#8250;</button><button type="button" class="lg-btn lg-x" aria-label="Close">&#10005;</button><span class="lg-count"></span>';
    document.body.appendChild(box);
    boxImg=box.querySelector('img');boxCount=box.querySelector('.lg-count');
    box.querySelector('.lg-prev').onclick=function(e){e.stopPropagation();cur.go(cur.i-1);};
    box.querySelector('.lg-next').onclick=function(e){e.stopPropagation();cur.go(cur.i+1);};
    box.querySelector('.lg-x').onclick=closeBox;
    box.onclick=function(e){if(e.target===box)closeBox();};
    swipe(box,function(d){cur.go(cur.i+d);});
    document.addEventListener('keydown',function(e){
      if(!box.classList.contains('open'))return;
      if(e.key==='Escape')closeBox();
      if(e.key==='ArrowLeft')cur.go(cur.i-1);
      if(e.key==='ArrowRight')cur.go(cur.i+1);
    });
  }
  function closeBox(){box.classList.remove('open');document.documentElement.style.overflow='';}
  function swipe(el,fn){
    var x=null;
    el.addEventListener('touchstart',function(e){x=e.touches[0].clientX;},{passive:true});
    el.addEventListener('touchend',function(e){
      if(x===null)return;var dx=e.changedTouches[0].clientX-x;x=null;
      if(Math.abs(dx)>40)fn(dx<0?1:-1);
    });
  }
  function init(root){
    if(root.getAttribute('data-lg-ready'))return;root.setAttribute('data-lg-ready','1');
    var hero=root.getAttribute('data-hero');
    if(hero&&hero.indexOf('{{')<0){
      var sec=document.querySelector('.house-hero');
      if(sec){var tgt=sec.querySelector(':scope > .bg')||sec;
        tgt.style.backgroundImage='url("'+sized(hero,2000)+'")';tgt.style.backgroundSize='cover';tgt.style.backgroundPosition='center';}
    }
    var tpl=root.querySelector('.lg-src');
    var holder=document.createElement('div');holder.innerHTML=tpl.innerHTML;
    var pics=[].map.call(holder.querySelectorAll('img'),function(im){return{src:im.getAttribute('src'),alt:im.getAttribute('alt')||''};}).filter(function(p){return p.src;});
    if(!pics.length){root.style.display='none';return;}
    var main=root.querySelector('.lg-main'),count=root.querySelector('.lg-count'),strip=root.querySelector('.lg-thumbs'),n=pics.length;
    var thumbs=pics.map(function(p,k){
      var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show photo '+(k+1));
      b.innerHTML='<img loading="lazy" alt="">';b.firstChild.src=sized(p.src,240);
      b.onclick=function(){g.go(k);};strip.appendChild(b);return b;
    });
    var g={i:0,go:function(k){
      g.i=(k+n)%n;var p=pics[g.i];
      main.src=sized(p.src,1400);main.alt=p.alt;count.textContent=(g.i+1)+' / '+n;
      thumbs.forEach(function(t,j){t.classList.toggle('on',j===g.i);});
      var t=thumbs[g.i];strip.scrollLeft=t.offsetLeft-strip.clientWidth/2+t.clientWidth/2;
      new Image().src=sized(pics[(g.i+1)%n].src,1400);
      if(box&&box.classList.contains('open')&&cur===g){boxImg.src=sized(p.src,2000);boxImg.alt=p.alt;boxCount.textContent=count.textContent;}
    }};
    if(n<2){root.querySelector('.lg-prev').style.display='none';root.querySelector('.lg-next').style.display='none';strip.style.display='none';}
    root.querySelector('.lg-prev').onclick=function(e){e.stopPropagation();g.go(g.i-1);};
    root.querySelector('.lg-next').onclick=function(e){e.stopPropagation();g.go(g.i+1);};
    function open(){makeBox();cur=g;box.classList.add('open');document.documentElement.style.overflow='hidden';g.go(g.i);}
    root.querySelector('.lg-full').onclick=function(e){e.stopPropagation();open();};
    root.querySelector('.lg-stage').onclick=open;
    swipe(root.querySelector('.lg-stage'),function(d){g.go(g.i+d);});
    g.go(0);
  }
  function run(){[].forEach.call(document.querySelectorAll('[data-lg]'),init);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
