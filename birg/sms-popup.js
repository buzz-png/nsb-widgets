/* ============================================================
   BIRG — "Get SMS updates on this home" pop-up
   Loaded on each listing page with ONE line:
     <script src="https://buzz-png.github.io/nsb-widgets/birg/sms-popup.js" defer></script>

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
    statusUrl: "https://listing-matches.vibepreview.app/api/public/widget-status",
    buttonText: "Want live text updates?",
    autoOpenSeconds: 0,          // 0 = only opens on click. e.g. 20 = opens itself after 20s (once per visit)
    title: "Don't miss a move on {address}.",
    sub: "We'll text you when there's:",
    bullets: ["Price drops", "Open houses", "Just sold", "Big news"],
    // Screen 2 (shows after the form is sent; needs the form to redirect to birg/thanks.html)
    doneText: "You're in ✓",
    moreText: "Love this one? We'll find you more like it, before they hit the MLS.",
    similarButton: "Yes, find me similar homes",
    quizUrl: "https://listing-matches.vibepreview.app/quiz/bowen"
  };
  // ------------------------------------------------------------------

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Kill switch: Quickfire SMS > Settings > Website pop-ups.
  // Hide only if it clearly says off; if it can't be reached, stay on.
  function checkSwitch(cb) {
    var done = false;
    function go(on) { if (!done) { done = true; if (on) cb(); } }
    setTimeout(function () { go(true); }, 3000);
    try {
      fetch(SETTINGS.statusUrl, { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (j) { go(!(j && j.popups === false)); })
        .catch(function () { go(true); });
    } catch (err) { go(true); }
  }

  ready(function () { checkSwitch(build); });

  function build() {
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
      "#sms-watch-frame iframe{width:100%;height:600px;border:0;display:block}" +
      ".sms-watch-step2{text-align:center;padding:8px 12px 18px}" +
      ".sms-watch-step2 .sms-watch-done{font-family:'DM Sans',sans-serif;font-weight:800;font-size:24px;color:#435249;margin:6px 0 10px}" +
      ".sms-watch-step2 .sms-watch-ok{font-family:'DM Sans',sans-serif;font-size:14px;color:#6b7a70;margin:4px 0 6px}" +
      ".sms-watch-step2 .sms-watch-note{font-family:'Bitter',serif;font-size:14px;color:#6b7a70;margin:12px 0 0}" +
      ".sms-watch-step2 .sms-watch-more{font-family:'Bitter',serif;font-size:17px;line-height:1.5;color:#435249;margin:0 auto 22px;max-width:380px}" +
      ".sms-watch-modal.step2 .sms-watch-sub,.sms-watch-modal.step2 .sms-watch-list,.sms-watch-modal.step2 .sms-watch-title{display:none}" +
      ".sms-watch-modal.quiz #sms-watch-frame iframe{height:78vh}";
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // ---- floating button (listing pages only) ----
    if (isListing && auto.address) {
      var fb = document.createElement("button");
      fb.type = "button";
      fb.className = "sms-watch-btn sms-watch-float";
      fb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="11" height="19" rx="2.2"/><path d="M10.5 18.5h2"/><circle cx="18" cy="5" r="2.6" fill="currentColor" stroke="none"/></svg><span></span>';
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
      modal.classList.remove("step2", "quiz");
      frameWrap.innerHTML = '<iframe src="' + src + '" title="Get SMS updates"></iframe>';
      // Screen 2: when the form finishes and redirects (2nd load), swap to "You're in" + similar homes
      var loads = 0;
      frameWrap.querySelector("iframe").addEventListener("load", function () {
        loads++;
        if (loads === 2) showStep2(address, id);
      });
      modal.querySelector(".sms-watch-title").textContent = address
        ? SETTINGS.title.replace("{address}", address)
        : "Don't miss a move on this home.";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }
    var signup = { cid: "" };
    window.addEventListener("message", function (e) {
      if (e.origin === "https://buzz-png.github.io" && e.data && e.data.qf === "thanks") {
        signup.cid = String(e.data.cid || "");
      }
    });
    function showStep2(address, id) {
      modal.classList.add("step2");
      frameWrap.innerHTML =
        '<div class="sms-watch-step2"><p class="sms-watch-ok"></p><p class="sms-watch-done"></p>' +
        '<p class="sms-watch-more"></p>' +
        '<button type="button" class="sms-watch-btn sms-watch-similar"></button><p class="sms-watch-note"></p></div>';
      frameWrap.querySelector(".sms-watch-ok").textContent = SETTINGS.doneText;
      frameWrap.querySelector(".sms-watch-done").textContent = SETTINGS.knowText;
      frameWrap.querySelector(".sms-watch-note").textContent = SETTINGS.noteText;
      frameWrap.querySelector(".sms-watch-more").textContent = SETTINGS.moreText;
      var b = frameWrap.querySelector(".sms-watch-similar");
      b.textContent = SETTINGS.similarButton;
      b.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        modal.classList.add("quiz");
        var q = SETTINGS.quizUrl + "?similar=" + encodeURIComponent(id || "") + "&listing=" + encodeURIComponent(address || "") +
          (signup.cid && signup.cid.indexOf("{{") < 0 ? "&cid=" + encodeURIComponent(signup.cid) : "");
        frameWrap.innerHTML = '<iframe src="' + q + '" title="Find similar homes"></iframe>';
        var hero = modal.querySelector(".sms-watch-hero"); if (hero) hero.hidden = true;
      });
    }
    function closeModal() {
      modal.classList.remove("step2", "quiz");
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
    // Back from the form's thank-you bounce (?qf=done): open straight on screen 2, then tidy the address bar
    var qs = new URLSearchParams(location.search);
    if (qs.get("qf") === "done") {
      signup.cid = qs.get("qf_cid") || "";
      try { qs.delete("qf"); qs.delete("qf_cid"); history.replaceState(null, "", location.pathname + (qs.toString() ? "?" + qs : "") + location.hash); } catch (e) {}
      var h = modal.querySelector(".sms-watch-hero");
      if (auto.image) { h.src = auto.image; h.hidden = false; }
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      showStep2(auto.address, auto.id);
    }

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
  }
})();
