/* ================================================================== */
/* SESSION 2C.3 — VISITOR FEEDBACK / COMMENT WIDGET                   */
/*                                                                    */
/*  A floating, bilingual comment box that delivers visitor comments  */
/*  straight to the site owner. Fully self-contained: no build step,  */
/*  no dependencies, no changes to any other patch file.              */
/*                                                                    */
/*  DELIVERY (two modes, automatic):                                  */
/*   A) FORMSPREE  — set FEEDBACK_ENDPOINT below to your Formspree    */
/*      form URL and comments are POSTed silently (AJAX); the visitor */
/*      never leaves the page and you get an email per submission.    */
/*      Sign up free at https://formspree.io (50 submissions/month),  */
/*      create a form pointed at OWNER_EMAIL, paste the URL below.    */
/*   B) MAILTO FALLBACK — if FEEDBACK_ENDPOINT is left blank, the     */
/*      widget opens the visitor's mail client with a pre-filled      */
/*      message to OWNER_EMAIL. Works with zero setup.                */
/*                                                                    */
/*  CONTEXT CAPTURE: the comment automatically records which temple   */
/*  the visitor is viewing (detail panel / selected marker) plus the  */
/*  active filters, so reports like "coordinates look wrong" arrive   */
/*  already identified.                                               */
/*                                                                    */
/*  SPAM: hidden honeypot field (_gotcha) + minimum-length check.     */
/* ================================================================== */
(function () {
  'use strict';
  if (window.PPS_FEEDBACK_LOADED) return;
  window.PPS_FEEDBACK_LOADED = true;

  /* ---------------------------------------------------------------- */
  /* CONFIG — the only lines you normally need to touch                */
  /* ---------------------------------------------------------------- */
  var OWNER_EMAIL       = 'webmasterppsdd@gmail.com';
  var FEEDBACK_ENDPOINT = 'https://formspree.io/f/mpqvkwrw';   /* e.g. 'https://formspree.io/f/xxxxxxxx' */
  var SITE_LABEL        = 'Paadal Petra Sthalams';

  /* ---------------------------------------------------------------- */
  /* 1. CSS                                                            */
  /* ---------------------------------------------------------------- */
  function injectCss() {
    if (document.getElementById('pps-fb-css')) return;
    var css = ''
      /* launcher */
      + '#pps-fb-btn{position:fixed;right:18px;bottom:18px;z-index:4000;width:52px;height:52px;'
      + 'border-radius:50%;border:none;cursor:pointer;background:linear-gradient(135deg,#E67E22,#C0392B);'
      + 'color:#fff;font-size:1.4rem;line-height:1;box-shadow:0 4px 14px rgba(0,0,0,.3);'
      + 'display:flex;align-items:center;justify-content:center;transition:transform .16s,box-shadow .16s}'
      + '#pps-fb-btn:hover{transform:scale(1.09);box-shadow:0 6px 20px rgba(0,0,0,.4)}'
      + '#pps-fb-btn:focus-visible{outline:3px solid #D4AF37;outline-offset:2px}'
      + '#pps-fb-btn.open{background:linear-gradient(135deg,#7f8c8d,#4d5656)}'
      /* panel */
      + '#pps-fb-panel{position:fixed;right:18px;bottom:80px;z-index:4001;width:330px;max-width:calc(100vw - 36px);'
      + 'background:#fff;border:1.5px solid #e8dcc0;border-radius:14px;'
      + 'box-shadow:0 10px 34px rgba(0,0,0,.26);font-family:Inter,system-ui,sans-serif;'
      + 'display:none;overflow:hidden}'
      + '#pps-fb-panel.show{display:block;animation:pps-fb-in .18s ease-out}'
      + '@keyframes pps-fb-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'
      + '#pps-fb-head{background:linear-gradient(135deg,#E67E22,#C0392B);color:#fff;padding:11px 14px}'
      + '#pps-fb-head h3{margin:0;font-size:.94rem;font-weight:700;letter-spacing:.01em}'
      + '#pps-fb-head p{margin:2px 0 0;font-size:.71rem;opacity:.93;line-height:1.35}'
      + '#pps-fb-body{padding:12px 14px 14px}'
      + '.pps-fb-ctx{background:#FDF6E9;border:1px solid #F0E2C6;border-radius:7px;padding:6px 9px;'
      + 'font-size:.71rem;color:#7a6b5a;margin-bottom:9px;line-height:1.35}'
      + '.pps-fb-ctx b{color:#2A1810}'
      + '#pps-fb-panel label{display:block;font-size:.72rem;font-weight:600;color:#5a4a3a;margin:0 0 3px}'
      + '#pps-fb-panel textarea,#pps-fb-panel input[type=text],#pps-fb-panel input[type=email]{'
      + 'width:100%;box-sizing:border-box;border:1.5px solid #e0d6c2;border-radius:7px;padding:7px 9px;'
      + 'font-family:inherit;font-size:.8rem;color:#2A1810;background:#fff;margin-bottom:9px;'
      + 'transition:border-color .15s;resize:vertical}'
      + '#pps-fb-panel textarea{min-height:82px}'
      + '#pps-fb-panel textarea:focus,#pps-fb-panel input:focus{outline:none;border-color:#E67E22}'
      + '.pps-fb-row{display:flex;gap:8px}'
      + '.pps-fb-row>div{flex:1;min-width:0}'
      + '#pps-fb-send{width:100%;border:none;border-radius:8px;padding:9px;cursor:pointer;'
      + 'background:linear-gradient(135deg,#E67E22,#C0392B);color:#fff;font-family:inherit;'
      + 'font-size:.84rem;font-weight:700;transition:opacity .15s}'
      + '#pps-fb-send:hover{opacity:.92}'
      + '#pps-fb-send:disabled{opacity:.55;cursor:default}'
      + '#pps-fb-msg{font-size:.76rem;margin-top:9px;padding:8px 10px;border-radius:7px;display:none;line-height:1.4}'
      + '#pps-fb-msg.ok{display:block;background:#EAF7EE;color:#1E6B34;border:1px solid #BFE3CB}'
      + '#pps-fb-msg.err{display:block;background:#FDECEA;color:#A32B1C;border:1px solid #F5C4BD}'
      + '.pps-fb-hp{position:absolute!important;left:-9999px!important;opacity:0!important;height:0!important}'
      + '.pps-fb-note{font-size:.66rem;color:#9b8b7a;margin-top:8px;line-height:1.4;text-align:center}'
      /* mobile: keep clear of the legend + bottom UI */
      + '@media(max-width:640px){#pps-fb-panel{right:10px;left:10px;width:auto;bottom:74px}'
      + '#pps-fb-btn{right:12px;bottom:12px;width:46px;height:46px;font-size:1.2rem}}';
    var st = document.createElement('style');
    st.id = 'pps-fb-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------------------------------------------------------------- */
  /* 2. CONTEXT CAPTURE                                                */
  /* ---------------------------------------------------------------- */
  /* Track the last temple opened in the detail panel by wrapping the
     existing opener non-invasively (call-through, never replaces).   */
  var lastSno = null;
  function hookPanel() {
    if (window._ppsFbHooked) return;
    if (typeof window.showTempleInPanel !== 'function') return;
    window._ppsFbHooked = true;
    var orig = window.showTempleInPanel;
    window.showTempleInPanel = function (sno) {
      try { lastSno = sno; } catch (e) {}
      return orig.apply(this, arguments);
    };
  }

  function currentSno() {
    /* prefer an open detail panel; else the selected map marker */
    var panel = document.getElementById('detail-panel');
    var panelOpen = panel && panel.classList && panel.classList.contains('open');
    if (!panelOpen && panel) {
      var c = document.getElementById('detail-panel-content');
      panelOpen = !!(c && c.innerHTML && c.innerHTML.trim().length > 40);
    }
    if (panelOpen && lastSno != null) return lastSno;
    if (window.pps2c1 && window.pps2c1.selectedSno != null) return window.pps2c1.selectedSno;
    return lastSno;
  }

  function templeLabel(sno) {
    if (sno == null || !window.TEMPLES) return '';
    for (var i = 0; i < window.TEMPLES.length; i++) {
      var t = window.TEMPLES[i];
      if (t.sno === sno) {
        return '#' + t.sno + ' ' + (t.name || '') +
               (t.town ? ' (' + t.town + ')' : '');
      }
    }
    return '#' + sno;
  }

  function activeFilters() {
    var bits = [];
    try {
      var cats = (window.pps2c1 && window.pps2c1.activeCats) ||
                 (window.pps2c1 && window.pps2c1.S && window.pps2c1.S.activeCats);
      if (window.pps2c1 && window.pps2c1.activeCats && window.pps2c1.activeCats.size) {
        bits.push('sets=' + Array.from(window.pps2c1.activeCats).join('|'));
      }
      var s = document.getElementById('search') || document.getElementById('search-main');
      if (s && s.value && s.value.trim()) bits.push('search="' + s.value.trim() + '"');
    } catch (e) {}
    return bits.join(', ');
  }

  function buildContext() {
    var sno = currentSno();
    var parts = [];
    if (sno != null) parts.push('Temple: ' + templeLabel(sno));
    var f = activeFilters();
    if (f) parts.push('Filters: ' + f);
    parts.push('Page: ' + location.href);
    return parts.join('\n');
  }

  /* ---------------------------------------------------------------- */
  /* 3. UI                                                             */
  /* ---------------------------------------------------------------- */
  function build() {
    if (document.getElementById('pps-fb-btn')) return;
    injectCss();

    var btn = document.createElement('button');
    btn.id = 'pps-fb-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Send a comment / கருத்து அனுப்பு');
    btn.title = 'Send a comment to the site owner / கருத்து அனுப்பு';
    btn.innerHTML = '\uD83D\uDCAC';
    document.body.appendChild(btn);

    var panel = document.createElement('div');
    panel.id = 'pps-fb-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Feedback form');
    panel.innerHTML =
        '<div id="pps-fb-head">'
      +   '<h3>\uD83D\uDCAC Send a comment</h3>'
      +   '<p>\u0BB5\u0BB2\u0BC8\u0BA4\u0BCD\u0BA4\u0BB3\u0BAE\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0BA4\u0BCD\u0BA4 \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BB3\u0BC8 \u0B85\u0BA9\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u2014 corrections, suggestions, or temple details welcome.</p>'
      + '</div>'
      + '<div id="pps-fb-body">'
      +   '<div class="pps-fb-ctx" id="pps-fb-ctx"></div>'
      +   '<label for="pps-fb-text">Your comment / \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 <span style="color:#C0392B">*</span></label>'
      +   '<textarea id="pps-fb-text" maxlength="4000" placeholder="Corrections, missing details, coordinates, suggestions\u2026"></textarea>'
      +   '<div class="pps-fb-row">'
      +     '<div><label for="pps-fb-name">Name (optional)</label>'
      +       '<input type="text" id="pps-fb-name" maxlength="120" autocomplete="name"></div>'
      +     '<div><label for="pps-fb-email">Email (optional)</label>'
      +       '<input type="email" id="pps-fb-email" maxlength="160" autocomplete="email"></div>'
      +   '</div>'
      +   '<input type="text" class="pps-fb-hp" id="pps-fb-hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">'
      +   '<button id="pps-fb-send" type="button">Send \uD83D\uDE4F</button>'
      +   '<div id="pps-fb-msg"></div>'
      +   '<div class="pps-fb-note">Your note goes directly to the site maintainer.</div>'
      + '</div>';
    document.body.appendChild(panel);

    var msg   = panel.querySelector('#pps-fb-msg');
    var text  = panel.querySelector('#pps-fb-text');
    var send  = panel.querySelector('#pps-fb-send');
    var ctxEl = panel.querySelector('#pps-fb-ctx');

    function refreshCtx() {
      var sno = currentSno();
      ctxEl.innerHTML = (sno != null)
        ? 'Attaching context: <b>' + templeLabel(sno).replace(/</g, '&lt;') + '</b>'
        : 'General comment about the site \u2014 open a temple first to attach it automatically.';
    }

    function setMsg(kind, html) {
      msg.className = kind || '';
      msg.innerHTML = html || '';
    }

    function toggle(force) {
      var open = (typeof force === 'boolean') ? force : !panel.classList.contains('show');
      panel.classList.toggle('show', open);
      btn.classList.toggle('open', open);
      btn.innerHTML = open ? '\u2715' : '\uD83D\uDCAC';
      if (open) { refreshCtx(); setMsg('', ''); setTimeout(function () { text.focus(); }, 60); }
    }

    btn.onclick = function () { toggle(); };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('show')) toggle(false);
    });

    send.onclick = function () {
      var body = (text.value || '').trim();
      if (body.length < 4) { setMsg('err', 'Please enter a comment first.'); text.focus(); return; }
      if ((panel.querySelector('#pps-fb-hp').value || '') !== '') { toggle(false); return; } /* bot */

      var name  = (panel.querySelector('#pps-fb-name').value || '').trim();
      var email = (panel.querySelector('#pps-fb-email').value || '').trim();
      var ctx   = buildContext();

      send.disabled = true;
      setMsg('', '');

      /* ---- Mode B: mailto fallback (no endpoint configured) ---- */
      if (!FEEDBACK_ENDPOINT) {
        var subj = SITE_LABEL + ' — comment' +
                   (currentSno() != null ? ' re ' + templeLabel(currentSno()) : '');
        var mailBody = body + '\n\n---\n' + ctx +
                       (name ? '\nFrom: ' + name : '') +
                       (email ? '\nEmail: ' + email : '');
        window.location.href = 'mailto:' + OWNER_EMAIL +
          '?subject=' + encodeURIComponent(subj) +
          '&body='    + encodeURIComponent(mailBody);
        setMsg('ok', 'Opening your email app\u2026 \uD83D\uDE4F<br><small>If nothing opened, email <b>' +
                     OWNER_EMAIL + '</b> directly.</small>');
        send.disabled = false;
        return;
      }

      /* ---- Mode A: Formspree AJAX ---- */
      /* Session 2C.3b FIX: Formspree treats the "email" field as the
         reply-to address and VALIDATES it. Previously we always sent
         email:"(not given)" when the visitor left it blank, which is not a
         valid address, so Formspree replied HTTP 400 and every submission
         failed. Only send "email" when it actually looks like an address. */
      var payload = {
        message: body,
        name:    name || '(not given)',
        context: ctx,
        _subject: SITE_LABEL + ' — comment' +
                  (currentSno() != null ? ' re ' + templeLabel(currentSno()) : '')
      };
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        payload.email = email;          /* valid -> Formspree Reply-To */
      } else if (email) {
        payload.contact_given = email;  /* keep whatever they typed, unvalidated */
      }

      /* Build a ready-to-use mailto so a failure never dead-ends the visitor. */
      function mailtoHref() {
        var subj = SITE_LABEL + ' — comment' +
                   (currentSno() != null ? ' re ' + templeLabel(currentSno()) : '');
        var mb = body + '\n\n---\n' + ctx +
                 (name ? '\nFrom: ' + name : '') +
                 (email ? '\nEmail: ' + email : '');
        return 'mailto:' + OWNER_EMAIL +
               '?subject=' + encodeURIComponent(subj) +
               '&body='    + encodeURIComponent(mb);
      }

      fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        /* Read the body too, so real Formspree errors are visible instead of
           being swallowed into a generic "could not send". */
        return r.text().then(function (txt) {
          return { ok: r.ok, status: r.status, txt: txt };
        });
      }).then(function (res) {
        if (!res.ok) {
          var detail = '';
          try {
            var j = JSON.parse(res.txt);
            if (j.errors && j.errors.length) {
              detail = j.errors.map(function (e) { return e.message; }).join('; ');
            } else if (j.error) { detail = j.error; }
          } catch (e) {}
          throw new Error('HTTP ' + res.status + (detail ? ' — ' + detail : ''));
        }
        setMsg('ok', 'Thank you \uD83D\uDE4F \u0BA8\u0BA9\u0BCD\u0BB1\u0BBF! Your comment has been sent.');
        text.value = '';
        setTimeout(function () { toggle(false); }, 2200);
      }).catch(function (err) {
        console.warn('[Session 2C.3] Feedback send failed:', err && err.message);
        setMsg('err',
          'Could not send just now.<br><a href="' + mailtoHref() +
          '" style="color:#A32B1C;font-weight:700;text-decoration:underline">' +
          'Send by email instead \u2709</a><br><small style="opacity:.8">' +
          (err && err.message ? err.message : 'network error') + '</small>');
      }).then(function () { send.disabled = false; });
    };

    console.log('[Session 2C.3] Feedback widget ready (' +
      (FEEDBACK_ENDPOINT ? 'Formspree mode' : 'mailto mode \u2014 set FEEDBACK_ENDPOINT for silent AJAX') + ').');
  }

  /* ---------------------------------------------------------------- */
  /* 4. INIT                                                           */
  /* ---------------------------------------------------------------- */
  function init() {
    if (!document.body) { setTimeout(init, 120); return; }
    build();
    hookPanel();
    /* the panel opener is defined by a later patch; retry briefly */
    var tries = 0;
    (function poll() {
      if (window._ppsFbHooked || ++tries > 60) return;
      hookPanel();
      setTimeout(poll, 250);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();
