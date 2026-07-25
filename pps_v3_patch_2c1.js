/* ================================================================== */
/* SESSION_2C1_LOADED — Category-based Map UX (Nov 2026)              */
/*   v2c1c: (1) FIX marker click -> detail-panel/scroll regression by  */
/*          adding a group-level click handler (robust vs Session 1B.5 */
/*          per-marker rewiring) + hardened opener fallback.           */
/*          (2) Maada Koil expanded 19 -> 29 members; #91 dual name.   */
/*   v2c1b: added Maada Koil as the 8th colored category + pill.       */
/* ------------------------------------------------------------------ */
/*  Ports the Divya Desams marker engine to PPS and re-keys the       */
/*  color scheme from epigraphy tier -> pilgrimage-category sets.     */
/*                                                                    */
/*   1) Numbered divIcon markers (temple sno on the pin)              */
/*   2) Gold pulsing-ring feedback on selection                      */
/*   3) Leaflet.markercluster + category-tinted cluster disambiguation*/
/*   4) Color driver = 8 canonical category sets; multi-select        */
/*      category filter pills; gold ring for temples in 2+ sets;      */
/*      muted slate for uncategorized temples.                        */
/*                                                                    */
/*  A: reconciles canonical categories onto window.TEMPLES.           */
/*  Maada Koil: 19 corpus Maadakkoils verified vs the Kochengat Chola */
/*     catalogue (Aravind S / Shaivam.org / FamousFix). #91 Nallur    */
/*     deferred (deity mismatch). ~31 PPS Maadakkoils exist of the    */
/*     traditional 70 (Thirumangai) / 78 (Appar); remainder TBD.      */
/*  C: canonical set membership overrides looser 2A/2B stamps.        */
/*  D: palette / precedence / ring / slate as agreed.                 */
/*                                                                    */
/*  Regression-safe: keeps Tier + Nadu (Region) filters, keeps the    */
/*  Session 1B card/marker->detail-panel wiring, keeps naalvar via    */
/*  window.TEMPLES. Base circleMarkers are suppressed (not deleted).  */
/* ================================================================== */
(function () {
  'use strict';
  if (window.SESSION_2C1_LOADED) return;
  window.SESSION_2C1_LOADED = true;
  console.log('[Session 2C.1] Loading category map UX (v2c1b + Maada Koil)...');

  /* ---------------------------------------------------------------- */
  /* 1. CANONICAL SET MEMBERSHIP (C: authoritative, overrides stamps)  */
  /* ---------------------------------------------------------------- */
  /* In-corpus sno's + disclosed non-PPS set-completers (277-280).    */
  var CANON = {
    pancha_bhoota:    [3, 34, 226, 237, 249],
    pancha_sabhai:    [3, 198, 199, 201, 258],
    sapta_vidanga:    [66, 114, 130, 168, 175, 179, 184],
    atta_veerattanam: [59, 95, 156, 163, 221, 230, 280],
    saptha_sthana:    [26, 27, 28, 83, 95, 96, 100],
    navagraha:        [12, 44, 49, 66, 71, 87, 277, 278, 279],
    shakti_peetam:    [72, 97, 163, 168, 175, 198, 199, 262, 272],
    /* Kochengat Chola Maadakkoils present in the PPS corpus (29 mapped).
       #34 is the first Maadakkoil (Thiruvanaikka); #142 Ambal the last of
       the 60. Verified by town+deity vs the Shaivam.org / Aravind S /
       FamousFix Maadakkoil catalogues. #91 Nallur resolved (dual name).
       The traditional set is 70 (Thirumangai) / 78 (Appar), of which ~31
       are Paadal Petra Sthalams; remaining candidates still TBD. */
    maada_koil:       [15, 17, 34, 42, 47, 52, 60, 63, 81, 89, 90, 91, 92,
                       105, 111, 117, 118, 120, 132, 142, 145, 171, 172,
                       173, 176, 182, 183, 187, 216]
  };

  /* Dual-name / alias resolutions applied to window.TEMPLES (display). */
  var NAME_FIXES = {
    91: 'Panchavarneeswarar / Kalyanasundareswarar'   /* Nallur Maadakkoil */
  };

  /* Colored sets, ordered = FILL precedence (highest first). D.
     maada_koil is placed LAST so temples already in a deity/element
     set keep that fill (and gain a gold ring), while purely-Maadakkoil
     temples light up in the Maada Koil color instead of slate. */
  var PRECEDENCE = [
    'pancha_bhoota', 'pancha_sabhai', 'atta_veerattanam',
    'sapta_vidanga', 'saptha_sthana', 'navagraha', 'shakti_peetam',
    'maada_koil'
  ];

  var CAT_META = {
    pancha_bhoota:    { label: 'Pancha Bhoota',    color: '#C0392B' },
    pancha_sabhai:    { label: 'Pancha Sabhai',    color: '#8E44AD' },
    navagraha:        { label: 'Navagraha',        color: '#2980B9' },
    atta_veerattanam: { label: 'Atta Veerattanam', color: '#D35400' },
    sapta_vidanga:    { label: 'Sapta Vidanga',    color: '#16A085' },
    saptha_sthana:    { label: 'Saptha Sthana',    color: '#F39C12' },
    shakti_peetam:    { label: 'Shakti Peetam',    color: '#C2185B' },
    maada_koil:       { label: 'Maada Koil',       color: '#6D4C41' }
  };
  /* Pill display order (matches precedence for consistency). */
  var PILL_ORDER = PRECEDENCE.slice();

  var UNCAT_COLOR = '#7F8C8D';   /* muted slate */
  var MULTI_RING  = '#D4AF37';   /* gold */
  var COLORED = Object.keys(CAT_META);

  /* ---------------------------------------------------------------- */
  /* 2. RECONCILE canonical categories onto window.TEMPLES (A: yes)    */
  /* ---------------------------------------------------------------- */
  function bySno(sno) {
    if (!window.TEMPLES) return null;
    for (var i = 0; i < window.TEMPLES.length; i++) {
      if (window.TEMPLES[i].sno === sno) return window.TEMPLES[i];
    }
    return null;
  }

  function reconcileCategories() {
    if (!window.TEMPLES || !Array.isArray(window.TEMPLES)) return 0;
    /* Strip all colored-set slugs (keeps non-colored tags like
       nayanmar_birthplace_63, kashi_equivalent, vaippu_stalam, etc.). */
    window.TEMPLES.forEach(function (t) {
      if (!Array.isArray(t.categories)) t.categories = [];
      t.categories = t.categories.filter(function (c) {
        return COLORED.indexOf(c) < 0;
      });
    });
    /* Re-stamp exactly the canonical membership. */
    var stamped = 0;
    Object.keys(CANON).forEach(function (slug) {
      CANON[slug].forEach(function (sno) {
        var t = bySno(sno);
        if (t) {
          if (t.categories.indexOf(slug) < 0) { t.categories.push(slug); stamped++; }
        }
      });
    });
    /* Apply dual-name / alias fixes (e.g. #91 both names). */
    Object.keys(NAME_FIXES).forEach(function (k) {
      var t = bySno(parseInt(k, 10));
      if (t && t.name !== NAME_FIXES[k]) { t.name = NAME_FIXES[k]; }
    });
    console.log('[Session 2C.1] Reconciled canonical categories onto TEMPLES (' + stamped + ' stamps).');
    return stamped;
  }

  /* Colored-set membership for a temple (canonical, post-reconcile). */
  function colorCatsOf(t) {
    if (!t || !Array.isArray(t.categories)) return [];
    return t.categories.filter(function (c) { return COLORED.indexOf(c) >= 0; });
  }
  function fillColorOf(t) {
    var cats = colorCatsOf(t);
    if (!cats.length) return UNCAT_COLOR;
    for (var i = 0; i < PRECEDENCE.length; i++) {
      if (cats.indexOf(PRECEDENCE[i]) >= 0) return CAT_META[PRECEDENCE[i]].color;
    }
    return UNCAT_COLOR;
  }
  function isMultiSet(t) { return colorCatsOf(t).length >= 2; }

  /* ---------------------------------------------------------------- */
  /* 3. STATE                                                          */
  /* ---------------------------------------------------------------- */
  window.pps2c1 = window.pps2c1 || {};
  var S = window.pps2c1;
  S.activeCats = S.activeCats || new Set();   /* empty = show all */
  S.markers = {};                              /* sno -> L.marker  */
  S.group = null;                              /* cluster group    */
  S.selectedSno = null;

  /* ---------------------------------------------------------------- */
  /* 4. CSS                                                            */
  /* ---------------------------------------------------------------- */
  function injectCss() {
    if (document.getElementById('pps-2c1-css')) return;
    var css = ''
      + '.pps-marker-wrap{background:transparent!important;border:none!important}'
      + '.pps-cat-marker{width:30px;height:30px;border-radius:50%;border:2.5px solid #fff;'
      + 'box-shadow:0 2px 6px rgba(0,0,0,.35);color:#fff;font-weight:700;font-size:.72rem;'
      + 'display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;'
      + 'transition:transform .15s ease;cursor:pointer;position:relative}'
      + '.pps-cat-marker:hover{transform:scale(1.18);z-index:1000;box-shadow:0 3px 10px rgba(0,0,0,.5)}'
      + '.pps-cat-marker.multi{box-shadow:0 0 0 3px ' + MULTI_RING + ',0 2px 7px rgba(0,0,0,.45)}'
      /* pulse */
      + '.pps-cat-marker.selected::before{content:"";position:absolute;top:50%;left:50%;width:30px;height:30px;'
      + 'border-radius:50%;border:3px solid ' + MULTI_RING + ';transform:translate(-50%,-50%);'
      + 'animation:pps-pulse 1.2s ease-out;animation-iteration-count:4;pointer-events:none;opacity:0}'
      + '@keyframes pps-pulse{0%{transform:translate(-50%,-50%) scale(1);opacity:.85}'
      + '100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}'
      /* cluster */
      + '.pps-cluster-wrap{background:transparent!important;border:none!important}'
      + '.pps-cluster{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;'
      + 'justify-content:center;font-family:Inter,sans-serif;font-weight:900;font-size:1.02rem;'
      + 'color:#2A1810;border:3px solid #A89370;background:linear-gradient(135deg,#F5EBD3,#E8DCC0);'
      + 'box-shadow:0 0 0 3px #fff,0 0 0 4px #A89370,inset 0 -2px 4px rgba(0,0,0,.15),0 3px 10px rgba(0,0,0,.35);'
      + 'transition:transform .15s ease;cursor:pointer}'
      + '.pps-cluster:hover{transform:scale(1.1)}'
      /* legend */
      + '.pps-legend{position:absolute;left:10px;bottom:20px;z-index:800;background:rgba(255,255,255,.96);'
      + 'border:1.5px solid #e8dcc0;border-radius:10px;padding:8px 10px;font-family:Inter,sans-serif;'
      + 'font-size:.72rem;color:#2A1810;box-shadow:0 3px 12px rgba(0,0,0,.15);max-width:200px}'
      + '.pps-legend h4{font-size:.66rem;text-transform:uppercase;letter-spacing:.06em;color:#7a6b5a;'
      + 'margin:0 0 6px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer}'
      + '.pps-legend-row{display:flex;align-items:center;gap:7px;margin:3px 0;line-height:1.2}'
      + '.pps-legend-sw{width:13px;height:13px;border-radius:50%;border:2px solid #fff;'
      + 'box-shadow:0 0 0 1px rgba(0,0,0,.15);flex:0 0 auto}'
      + '.pps-legend-sw.ring{box-shadow:0 0 0 2px ' + MULTI_RING + '}'
      + '.pps-legend.collapsed .pps-legend-body{display:none}'
      /* category pill row */
      + '#pps-cat-pills .pill{transition:all .15s}'
      + '.pps-cat-count{margin-left:5px;opacity:.7;font-weight:400}'
      + '@media(max-width:900px){.pps-legend{bottom:auto;top:10px;left:10px;font-size:.66rem;max-width:150px}}';
    var st = document.createElement('style');
    st.id = 'pps-2c1-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------------------------------------------------------------- */
  /* 5. FILTER READERS (read live DOM; independent of const state)     */
  /* ---------------------------------------------------------------- */
  function activeTierSet() {
    var s = {};
    document.querySelectorAll('.pill[data-tier].active').forEach(function (p) {
      s[p.getAttribute('data-tier')] = 1;
    });
    return s;
  }
  function activeRegions() {
    var arr = [];
    document.querySelectorAll('#region-pills .pill.active').forEach(function (p) {
      if (p.dataset && p.dataset.region) arr.push(p.dataset.region);
    });
    return arr;
  }
  function searchVal() {
    var a = document.getElementById('search');
    var b = document.getElementById('search-main');
    var v = (a && a.value) || (b && b.value) || '';
    return String(v).toLowerCase().trim();
  }
  function passesBase(t) {
    var isAdd = t.sno > 276;            /* disclosed set-completers */
    var tiers = activeTierSet();
    if (!isAdd) {
      /* if some tier pills exist and this tier isn't active -> hide */
      if (Object.keys(tiers).length && !tiers[t.tier]) return false;
    }
    var regs = activeRegions();
    if (regs.length && !isAdd && regs.indexOf(t.region) < 0) return false;
    var q = searchVal();
    if (q) {
      var hay = ((t.name || '') + ' ' + (t.town || '') + ' ' +
                 (t.district || '') + ' ' + (t.region || '')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }
  function passesCat(t) {
    if (S.activeCats.size === 0) return true;
    var cats = colorCatsOf(t);
    for (var i = 0; i < cats.length; i++) {
      if (S.activeCats.has(cats[i])) return true;   /* OR / union */
    }
    return false;
  }

  /* ---------------------------------------------------------------- */
  /* 6. MARKERS + CLUSTER                                              */
  /* ---------------------------------------------------------------- */
  function makeIcon(t) {
    var color = fillColorOf(t);
    var cls = 'pps-cat-marker' + (isMultiSet(t) ? ' multi' : '');
    return L.divIcon({
      html: '<div class="' + cls + '" data-sno="' + t.sno + '" style="background:' + color + ';">' + t.sno + '</div>',
      className: 'pps-marker-wrap',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  function clusterIcon(cluster) {
    var kids = cluster.getAllChildMarkers();
    var counts = {};
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i]._ppsFill || UNCAT_COLOR;
      counts[c] = (counts[c] || 0) + 1;
    }
    var keys = Object.keys(counts);
    var style = '';
    if (keys.length === 1 && keys[0] !== UNCAT_COLOR) {
      var col = keys[0];
      style = 'border-color:' + col + ';background:' + col + '22;color:#2A1810;'
            + 'box-shadow:0 0 0 3px #fff,0 0 0 4px ' + col
            + ',inset 0 -2px 4px rgba(0,0,0,.18),0 3px 10px rgba(0,0,0,.35);';
    }
    return L.divIcon({
      html: '<div class="pps-cluster" style="' + style + '">' + cluster.getChildCount() + '</div>',
      className: 'pps-cluster-wrap',
      iconSize: [50, 50]
    });
  }

  function selectMarker(sno) {
    document.querySelectorAll('.pps-cat-marker.selected').forEach(function (el) {
      el.classList.remove('selected');
    });
    var m = S.markers[sno];
    if (m && m._icon) {
      var inner = m._icon.querySelector('.pps-cat-marker');
      if (inner) {
        inner.classList.add('selected');
        inner.style.animation = 'none';
        setTimeout(function () { inner.style.animation = ''; }, 10);
      }
    }
    S.selectedSno = sno;
  }
  window.pps2c1.selectMarker = selectMarker;

  /* Open the detail panel robustly, mirroring the proven sidebar-card
     path. Tries the known opener(s); if unavailable, dispatches a real
     click on the matching sidebar card (which Session 1B.3 has wired). */
  function openPanel(sno) {
    var opened = false;
    if (typeof window.showTempleInPanel === 'function') {
      try { window.showTempleInPanel(sno); opened = true; } catch (e) {}
    }
    if (!opened && typeof window.openTemplePopup === 'function') {
      try { window.openTemplePopup(sno); opened = true; } catch (e) {}
    }
    /* Fallback: replay the working card-click path via event delegation. */
    if (!opened) {
      var card = document.querySelector('#cards .card[data-sno="' + sno + '"]');
      if (card && typeof card.click === 'function') { try { card.click(); opened = true; } catch (e) {} }
    }
    return opened;
  }

  function onMarkerClick(sno) {
    selectMarker(sno);
    openPanel(sno);
    if (typeof window.flashCard === 'function')   { try { window.flashCard(sno); } catch (e) {} }
    if (typeof window.scrollToCard === 'function'){ try { window.scrollToCard(sno); } catch (e) {} }
  }

  /* Dedupe so per-marker AND group-level handlers don't double-fire. */
  var _lastClick = { sno: null, t: 0 };
  function handleClick(sno) {
    if (sno == null) return;
    var now = Date.now();
    if (_lastClick.sno === sno && (now - _lastClick.t) < 350) return;
    _lastClick = { sno: sno, t: now };
    onMarkerClick(sno);
  }
  window.pps2c1.handleClick = handleClick;

  function buildMarkers() {
    if (S.group) {
      try { window.leafletMap.removeLayer(S.group); } catch (e) {}
      S.group = null; S.markers = {};
    }
    S.group = L.markerClusterGroup({
      iconCreateFunction: clusterIcon,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
      zoomToBoundsOnClick: true
    });

    var seen = {};
    window.TEMPLES.forEach(function (t) {
      if (t.lat == null || t.lng == null) return;
      if (seen[t.sno]) return;
      seen[t.sno] = 1;
      var marker = L.marker([t.lat, t.lng], { icon: makeIcon(t) });
      marker._ppsFill = fillColorOf(t);
      marker._ppsSno = t.sno;                       /* for group-level click */
      marker.bindTooltip('<b>#' + t.sno + '</b> ' + (t.name || '') +
        '<br><small>' + (t.town || '') + ', ' + (t.district || '') + '</small>',
        { direction: 'top', offset: [0, -12] });
      (function (sno) {
        marker.on('click', function () { handleClick(sno); });
      })(t.sno);
      S.markers[t.sno] = marker;
    });

    /* Group-level click: the markercluster-standard, robust path. Survives
       any per-marker handler stripping/rewiring by other sessions (e.g.
       Session 1B.5's marker-hook watcher). Deduped vs per-marker click. */
    S.group.on('click', function (e) {
      if (e && e.layer && e.layer._ppsSno != null) handleClick(e.layer._ppsSno);
    });

    window.leafletMap.addLayer(S.group);
    console.log('[Session 2C.1] Built ' + Object.keys(S.markers).length + ' category markers.');
  }

  /* ---------------------------------------------------------------- */
  /* 7. REFRESH VIEW (markers + sidebar category hide + counter)       */
  /* ---------------------------------------------------------------- */
  var refreshTimer = null;
  function refreshView() {
    if (!S.group) return;
    var visibleCorpus = 0;

    /* markers */
    window.TEMPLES.forEach(function (t) {
      if (t.lat == null || t.lng == null) return;
      var m = S.markers[t.sno];
      if (!m) return;
      var show = passesBase(t) && passesCat(t);
      var inGroup = S.group.hasLayer(m);
      if (show && !inGroup) S.group.addLayer(m);
      else if (!show && inGroup) S.group.removeLayer(m);
      if (show && t.sno <= 276) visibleCorpus++;
    });

    /* sidebar cards: base render() already applied tier/region/search
       to the 276; we additionally hide cards failing the category filter */
    var cards = document.querySelectorAll('#cards .card[data-sno]');
    cards.forEach(function (c) {
      var sno = parseInt(c.getAttribute('data-sno'), 10);
      var t = bySno(sno);
      var ok = t ? passesCat(t) : true;
      c.style.display = ok ? '' : 'none';
    });

    /* counter reflects the 276 corpus (adds are disclosed extras) */
    var cnt = document.getElementById('count');
    if (cnt) cnt.textContent = visibleCorpus;

    if (S.selectedSno) selectMarker(S.selectedSno);
  }
  function refreshSoon() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshView, 60);
  }
  window.pps2c1.refreshView = refreshView;

  /* ---------------------------------------------------------------- */
  /* 8. CATEGORY PILL ROW + LEGEND                                     */
  /* ---------------------------------------------------------------- */
  function buildCatPills() {
    var filters = document.querySelector('.filters');
    if (!filters || document.getElementById('pps-cat-row')) return;

    var row = document.createElement('div');
    row.className = 'filter-row';
    row.id = 'pps-cat-row';

    var label = document.createElement('span');
    label.className = 'label-mini';
    label.textContent = 'Pilgrimage Sets / தலத் தொகுப்புகள்:';
    row.appendChild(label);

    var wrap = document.createElement('span');
    wrap.id = 'pps-cat-pills';

    /* All pill */
    var allPill = document.createElement('span');
    allPill.className = 'pill active';
    allPill.textContent = 'All Sets';
    allPill.dataset.cat = '__all__';
    allPill.onclick = function () {
      S.activeCats.clear();
      syncPillStyles();
      refreshView();
    };
    wrap.appendChild(allPill);

    /* count members per set (in-corpus + adds that have markers) */
    function memberCount(slug) {
      return (CANON[slug] || []).filter(function (sno) {
        var t = bySno(sno); return t && t.lat != null;
      }).length;
    }

    PILL_ORDER.forEach(function (slug) {
      var meta = CAT_META[slug];
      var p = document.createElement('span');
      p.className = 'pill';
      p.dataset.cat = slug;
      p.innerHTML = meta.label + '<span class="pps-cat-count">(' + memberCount(slug) + ')</span>';
      p.title = meta.label + ' — colored ' + meta.color;
      p.onclick = function () {
        if (S.activeCats.has(slug)) S.activeCats.delete(slug);
        else S.activeCats.add(slug);
        syncPillStyles();
        refreshView();
      };
      wrap.appendChild(p);
    });
    row.appendChild(wrap);
    filters.appendChild(row);
    syncPillStyles();
  }

  function syncPillStyles() {
    var pills = document.querySelectorAll('#pps-cat-pills .pill');
    pills.forEach(function (p) {
      var cat = p.dataset.cat;
      if (cat === '__all__') {
        var none = S.activeCats.size === 0;
        p.classList.toggle('active', none);
        p.style.background = none ? '' : '#fff';
        p.style.color = '';
        p.style.borderColor = '';
        return;
      }
      var on = S.activeCats.has(cat);
      p.classList.toggle('active', on);
      if (on) {
        p.style.background = CAT_META[cat].color;
        p.style.borderColor = CAT_META[cat].color;
        p.style.color = '#fff';
      } else {
        p.style.background = '';
        p.style.borderColor = '';
        p.style.color = '';
      }
    });
  }

  function buildLegend() {
    var mapEl = document.getElementById('map');
    if (!mapEl || document.getElementById('pps-legend')) return;
    var box = document.createElement('div');
    box.className = 'pps-legend';
    box.id = 'pps-legend';
    var rows = '';
    PILL_ORDER.forEach(function (slug) {
      rows += '<div class="pps-legend-row"><span class="pps-legend-sw" style="background:'
        + CAT_META[slug].color + '"></span>' + CAT_META[slug].label + '</div>';
    });
    rows += '<div class="pps-legend-row"><span class="pps-legend-sw" style="background:'
      + UNCAT_COLOR + '"></span>Other PPS temple</div>';
    rows += '<div class="pps-legend-row"><span class="pps-legend-sw ring" style="background:#fff"></span>In 2+ sets (gold ring)</div>';
    box.innerHTML = '<h4><span>Marker Colors</span><span id="pps-legend-tog">–</span></h4>'
      + '<div class="pps-legend-body">' + rows + '</div>';
    mapEl.appendChild(box);
    var h4 = box.querySelector('h4');
    h4.onclick = function () {
      box.classList.toggle('collapsed');
      var tog = document.getElementById('pps-legend-tog');
      if (tog) tog.textContent = box.classList.contains('collapsed') ? '+' : '–';
    };
  }

  /* ---------------------------------------------------------------- */
  /* 9. SUPPRESS BASE CIRCLE MARKERS (keep naalvar via window.TEMPLES) */
  /* ---------------------------------------------------------------- */
  function suppressBaseMarkers() {
    /* window.makeMarker is a top-level function decl -> global prop.
       Overriding it makes render() add nothing to the base layer.   */
    if (typeof window.makeMarker === 'function' && !window._pps2c1_makeMarkerPatched) {
      window._pps2c1_makeMarkerPatched = true;
      window.makeMarker = function () { return null; };
    }
    /* Force one re-render to clear any circleMarkers already drawn.  */
    if (typeof window.render === 'function') {
      try { window.render(); } catch (e) {}
    }
  }

  /* ---------------------------------------------------------------- */
  /* 10. OBSERVERS + LISTENERS                                         */
  /* ---------------------------------------------------------------- */
  function setupSync() {
    /* re-apply category hide + marker refresh whenever base render()
       rebuilds the sidebar cards (tier/region/search changes). */
    var cardsWrap = document.getElementById('cards');
    if (cardsWrap && !window._pps2c1_obs) {
      window._pps2c1_obs = new MutationObserver(refreshSoon);
      window._pps2c1_obs.observe(cardsWrap, { childList: true });
    }
    /* sidebar card click -> pulse the matching marker (panel opening
       is already handled by Session 1B.3). */
    if (cardsWrap && !window._pps2c1_cardClick) {
      window._pps2c1_cardClick = true;
      cardsWrap.addEventListener('click', function (e) {
        var card = e.target.closest && e.target.closest('.card[data-sno]');
        if (!card) return;
        var sno = parseInt(card.getAttribute('data-sno'), 10);
        if (sno) selectMarker(sno);
      });
    }
    /* Reset button should also clear category selection. */
    var reset = document.getElementById('reset');
    if (reset && !window._pps2c1_reset) {
      window._pps2c1_reset = true;
      reset.addEventListener('click', function () {
        S.activeCats.clear();
        syncPillStyles();
        refreshSoon();
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* 11. LOAD markercluster PLUGIN (index.html doesn't include it)     */
  /* ---------------------------------------------------------------- */
  function ensureCluster(cb) {
    if (typeof L !== 'undefined' && typeof L.markerClusterGroup === 'function') {
      cb(); return;
    }
    var base = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/';
    ['MarkerCluster.css', 'MarkerCluster.Default.css'].forEach(function (f) {
      if (!document.querySelector('link[href="' + base + f + '"]')) {
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = base + f;
        document.head.appendChild(l);
      }
    });
    if (!document.querySelector('script[data-pps-mc]')) {
      var s = document.createElement('script');
      s.src = base + 'leaflet.markercluster.js';
      s.setAttribute('data-pps-mc', '1');
      s.onload = function () { console.log('[Session 2C.1] markercluster plugin loaded.'); };
      document.head.appendChild(s);
    }
    var tries = 0;
    (function poll() {
      if (typeof L !== 'undefined' && typeof L.markerClusterGroup === 'function') { cb(); return; }
      if (++tries > 100) { console.error('[Session 2C.1] markercluster failed to load.'); return; }
      setTimeout(poll, 100);
    })();
  }

  /* ---------------------------------------------------------------- */
  /* 12. INIT                                                          */
  /* ---------------------------------------------------------------- */
  function init() {
    if (!window.leafletMap || !window.TEMPLES || !window.TEMPLES.length ||
        typeof L === 'undefined') {
      setTimeout(init, 150); return;
    }
    reconcileCategories();
    injectCss();
    buildCatPills();
    buildLegend();
    ensureCluster(function () {
      suppressBaseMarkers();
      buildMarkers();
      setupSync();
      refreshView();
      console.log('[Session 2C.1] Category map UX active. Test: window.pps2c1.refreshView()');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 400); });
  } else {
    setTimeout(init, 400);
  }
})();
