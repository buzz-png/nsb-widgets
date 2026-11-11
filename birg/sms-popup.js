/* ============================================================
   BIRG — "Get SMS updates on this home" pop-up
   Loaded on each listing page with ONE line:
     <script src="https://cdn.jsdelivr.net/gh/buzz-png/nsb-widgets@main/birg/sms-popup.js" defer></script>

   On listing pages (/property/...) it reads the address (H1),
   WordPress listing ID (postid-####) and photo (og:image),
   shows a floating button, and opens the NSB CRM form with
   ?listing=<address>&listing_id=<id>.

   Edit SETTINGS below to change behaviour for every listing at once.
   ============================================================ */
(function () {
  if (window.__birgSmsPopup) return; // never load twice on one page
  window.__birgSmsPopup = true;

  // ---------- SETTINGS (change here, all listings update) ----------
  var SETTINGS = {
    formUrl: "https://go.bowen-links.com/widget/form/UnsUbtDeRcsf4kFPJ61I",
    buttonText: "Live SMS Updates",
    autoOpenSeconds: 0,          // 0 = only opens on click. e.g. 20 = opens itself after 20s (once per visit)
    title: "Don't miss a move on {address}.",
    sub: "We'll text you when there's:",
    bullets: ["Price drops", "Open houses", "Just sold", "Big news"]
  };
  // ------------------------------------------------------------------

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var isListing = /^\/property\//.test(location.pathname) || document.body.classList.contains("single-property");
    var testBtn = document.querySelector(".sms-watch-btn[data-listing]");
    if (!isListing && !testBtn) return;

    var h1 = document.querySelector("h1");
    var m = /postid-(\d+)/.exec(document.body.className);
    var og = document.querySelector('meta[property="og:image"]');
    var auto = {
      address: h1 ? h1.textContent.replace(/\s+/g, " ").trim() : "",
      id: m ? m[1] : "",
      image: og ? og.content : ""
    };

    // ---- styles ----
    var css = "@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;500&family=DM+Sans:wght@500;800&display=swap');" +
      ".sms-watch-btn{font-family:'DM Sans',sans-serif!important;font-size:17.6px!important;font-weight:800!important;color:#fff!important;background:#435249!important;border:2px solid #435249!important;border-radius:0!important;padding:18px 48px!important;cursor:pointer;transition:all .2s ease;line-height:1.2!important;display:inline-block!important}" +
      ".sms-watch-btn:hover{background:#fff!important;color:#435249!important}" +
      ".sms-watch-btn.sms-watch-float{position:fixed!important;right:24px!important;bottom:24px!important;z-index:9998!important;display:inline-flex!important;align-items:center;gap:10px;padding:14px 24px!important;font-size:17px!important;background:#fff!important;color:#435249!important;border:3px solid #435249!important;border-radius:0!important;box-shadow:0 6px 20px rgba(0,0,0,.18)!important;margin:0!important}" +
      ".sms-watch-btn.sms-watch-float:hover{background:#435249!important;color:#fff!important}" +
      ".sms-watch-btn.sms-watch-float svg{width:22px;height:22px;flex:none}" +
      "@media (max-width:600px){.sms-watch-btn.sms-watch-float{right:14px!important;bottom:14px!important;padding:11px 16px!important;font-size:15px!important}}" +
      ".sms-watch-modal{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;z-index:99999;padding:16px}" +
      ".sms-watch-modal.open{display:flex}" +
      ".sms-watch-box{background:#fff;width:100%;max-width:520px;max-height:92vh;overflow:auto;overflow-x:hidden;border-radius:0;padding:0 20px 12px;position:relative;scrollbar-width:none}" +
      ".sms-watch-box::-webkit-scrollbar{display:none}" +
      ".sms-watch-close{position:absolute;top:6px;right:12px;border:0;font-size:30px;line-height:1;cursor:pointer;color:#435249;padding:4px;background:rgba(255,255,255,.9)!important;border-radius:50%!important;width:40px;height:40px;z-index:2}" +
      ".sms-watch-hero{display:block;width:calc(100% + 40px)!important;max-width:none!important;margin:0 -20px 18px;height:170px!important;object-fit:cover}" +
      ".sms-watch-hero[hidden]{display:none}" +
      ".sms-watch-box > .sms-watch-hero[hidden] + .sms-watch-title{margin-top:32px}" +
      ".sms-watch-title{font-family:'DM Sans',sans-serif;font-weight:800;font-size:22px;margin:0 0 2px;color:#435249;padding:0 12px}" +
      ".sms-watch-sub{font-family:'Bitter',serif;font-size:16px;margin:0 0 8px;color:#435249;padding:0 12px}" +
      ".sms-watch-list{list-style:none;margin:0 0 6px;padding:0 12px;font-family:'Bitter',serif;font-size:16px;color:#435249;display:grid;grid-template-columns:repeat(2,max-content);column-gap:28px;row-gap:2px}" +
      ".sms-watch-list li{padding:3px 0 3px 26px;position:relative;white-space:nowrap}" +
      ".sms-watch-list li:before{content:'\\2713';position:absolute;left:2px;top:3px;font-weight:700;color:#435249}" +
      "#sms-watch-frame iframe{width:100%;height:600px;border:0;display:block}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // ---- floating button (listing pages only) ----
    if (isListing && auto.address) {
      var fb = document.createElement("button");
      fb.type = "button";
      fb.className = "sms-watch-btn sms-watch-float";
      fb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg><span></span>';
      fb.querySelector("span").textContent = SETTINGS.buttonText;
      document.body.appendChild(fb);
    }

    // ---- pop-up ----
    var modal = document.createElement("div");
    modal.id = "sms-watch-modal";
    modal.className = "sms-watch-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="sms-watch-box" role="dialog" aria-modal="true" aria-label="Get SMS updates">' +
      '<button class="sms-watch-close" aria-label="Close">&times;</button>' +
      '<img class="sms-watch-hero" alt="" hidden>' +
      '<p class="sms-watch-title"></p>' +
      '<p class="sms-watch-sub"></p>' +
      '<ul class="sms-watch-list"></ul>' +
      '<div id="sms-watch-frame"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector(".sms-watch-sub").textContent = SETTINGS.sub;
    var ul = modal.querySelector(".sms-watch-list");
    SETTINGS.bullets.forEach(function (b) { var li = document.createElement("li"); li.textContent = b; ul.appendChild(li); });
    var frameWrap = modal.querySelector("#sms-watch-frame");

    function openModal(address, id, img) {
      var hero = modal.querySelector(".sms-watch-hero");
      if (img) { hero.src = img; hero.hidden = false; } else { hero.removeAttribute("src"); hero.hidden = true; }
      var src = SETTINGS.formUrl + "?listing=" + encodeURIComponent(address || "") + "&listing_id=" + encodeURIComponent(id || "");
      frameWrap.innerHTML = '<iframe src="' + src + '" title="Get SMS updates"></iframe>';
      modal.querySelector(".sms-watch-title").textContent = address
        ? SETTINGS.title.replace("{address}", address)
        : "Don't miss a move on this home.";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }
    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      frameWrap.innerHTML = "";
    }

    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".sms-watch-btn");
      if (btn) {
        e.preventDefault();
        openModal(
          btn.getAttribute("data-listing") || auto.address,
          btn.getAttribute("data-listing-id") || auto.id,
          btn.getAttribute("data-image") || auto.image
        );
        return;
      }
      if (e.target === modal || e.target.closest(".sms-watch-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    // ---- optional timed auto-open (once per visit) ----
    if (SETTINGS.autoOpenSeconds > 0 && isListing && auto.address) {
      var key = "birgSmsAuto:" + location.pathname, seen = false;
      try { seen = sessionStorage.getItem(key) === "1"; } catch (err) {}
      if (!seen) {
        setTimeout(function () {
          if (modal.classList.contains("open")) return;
          openModal(auto.address, auto.id, auto.image);
          try { sessionStorage.setItem(key, "1"); } catch (err) {}
        }, SETTINGS.autoOpenSeconds * 1000);
      }
    }
  });
})();
