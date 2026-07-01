(function() {
   var JOURNEYS = {
    sambandar: {
      name: "Sambandar",
      name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0B9E\u0BBE\u0BA9\u0B9A\u0BAE\u0BCD\u0BAA\u0BA8\u0BCD\u0BA4\u0BB0\u0BCD",
      century: "7th c.",
      color: "#D2691E",
      born_place: "Sirkazhi",
      moksha_place: "Nallur Perumanam (age 16)",
      sequence: [47,3,44,49,15,72,87,34,27,130,168,201,203,205,199,198,226,237,47]
    },
    appar: {
      name: "Appar",
      name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BA8\u0BBE\u0BB5\u0BC1\u0B95\u0BCD\u0B95\u0BB0\u0B9A\u0BB0\u0BCD",
      century: "6-7th c.",
      color: "#8B4513",
      born_place: "Tiruvamur, Panruti",
      moksha_place: "Thiruppugalur (age 81)",
      sequence: [221,3,27,130,47,44,72,34,168,181,163,226,237,153]
    },
    sundarar: {
      name: "Sundarar",
      name_ta: "\u0B9A\u0BC1\u0BA8\u0BCD\u0BA4\u0BB0\u0BB0\u0BCD",
      century: "8th c.",
      color: "#B8860B",
      born_place: "Thirunavalur",
      moksha_place: "Thiruvanchikulam, Kerala (on white elephant to Kailasa)",
      sequence: [228,233,221,3,130,153,222,27,72,15,181,262,252,201,271]
    },
    manickavasakar: {
      name: "Manickavasakar",
      name_ta: "\u0BAE\u0BBE\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BBE\u0B9A\u0B95\u0BB0\u0BCD",
      century: "9th c.",
      color: "#4A0E4E",
      born_place: "Thiruvadhavur (near Madurai)",
      moksha_place: "Chidambaram (merged into Nataraja)",
      sequence: [201,3]
    }
  };
``

  var css = ".nv-panel{position:fixed;bottom:20px;left:20px;z-index:1100;background:#fff;border:2px solid #e8dcc0;border-radius:10px;padding:12px;box-shadow:0 4px 20px rgba(0,0,0,.18);max-width:280px;font-family:Inter,sans-serif;transition:all .25s ease}"
    + ".nv-panel.minimized{padding:8px 12px;max-width:180px}"
    + ".nv-panel.minimized .nv-body{display:none}"
    + ".nv-panel.minimized .nv-title{margin-bottom:0}"
    + ".nv-header{display:flex;align-items:center;justify-content:space-between;gap:8px}"
    + ".nv-title{font-size:.9rem;font-weight:700;color:#2A1810;margin-bottom:8px;flex:1}"
    + ".nv-toggle{background:transparent;border:none;cursor:pointer;font-size:1.1rem;color:#A0522D;padding:2px 6px;font-weight:700;border-radius:4px}"
    + ".nv-toggle:hover{background:#FFF8E7}"
    + ".nv-btns{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}"
    + ".nv-btn{padding:8px;background:#fff;border:2px solid #e8dcc0;border-radius:6px;cursor:pointer;font-size:.75rem;font-weight:700;font-family:inherit}"
    + ".nv-btn:hover{background:#FFF8E7}"
    + ".nv-btn.active{background:#FFF8E7;box-shadow:0 2px 6px rgba(210,105,30,.35)}"
    + ".nv-btn.active{background:#FFF8E7;box-shadow:0 2px 6px rgba(210,105,30,.35)}"
    + ".nv-btn-clear{width:100%;padding:6px;background:#f5f0e6;color:#7a6b5a;border:1.5px solid #e8dcc0;border-radius:6px;cursor:pointer;font-size:.72rem;font-family:inherit}"
    + ".nv-btn-clear:hover{background:#e8dcc0}"
    + ".nv-note{font-size:.65rem;color:#7a6b5a;margin-top:6px;line-height:1.3}"
    + ".journey-marker{background:rgba(255,255,255,.95);border-radius:50%;width:44px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:.5rem;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,.35);line-height:1}"
    + ".journey-marker-icon{font-size:1.1rem;line-height:1}"
    + ".journey-marker-num{font-size:.65rem;margin-top:2px;color:#333}"
    + ".journey-marker-start{background:#FFF8DC;border:3px solid #D4AF37}"
    + ".journey-marker-end{background:#F0E6FF;border:3px solid #4A0E4E}"
    + ".journey-popup{font-family:Inter,sans-serif;line-height:1.4;min-width:180px}"
    + ".journey-popup-header{font-size:.7rem;text-transform:uppercase;letter-spacing:.5px;color:#7a6b5a;font-weight:700;margin-bottom:4px}"
    + ".journey-popup-title{font-family:Noto Serif Tamil,serif;font-size:.95rem;font-weight:700;margin-bottom:4px}"
    + ".journey-popup-loc{font-size:.78rem;color:#4a3528;margin-bottom:4px}"
    + ".journey-popup-note{font-size:.72rem;color:#7a6b5a;font-style:italic}";

  var s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);

  var poly = null;
  var markers = [];
  var anim = null;

  function esc(str) {
    return String(str || '').replace(/[&<>"']/g, function(c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  function clear() {
    if (!window.leafletMap) return;
    if (poly) { window.leafletMap.removeLayer(poly); poly = null; }
    markers.forEach(function(m) { window.leafletMap.removeLayer(m); });
    markers = [];
    if (anim) { clearInterval(anim); anim = null; }
  }

  function draw(key) {
    if (!window.leafletMap || !window.TEMPLES || !window.L) return;
    clear();
    var j = JOURNEYS[key];
    if (!j) return;

    var pts = [];
    var stops = [];
    j.sequence.forEach(function(sno, i) {
      var t = window.TEMPLES.find(function(x) { return x.sno === sno; });
      if (t && t.lat != null) {
        pts.push([parseFloat(t.lat), parseFloat(t.lng)]);
        stops.push({ t: t, order: i + 1 });
      }
    });

    if (pts.length < 2) return;
    window.leafletMap.fitBounds(window.L.latLngBounds(pts), { padding: [60, 60] });

    poly = window.L.polyline([pts[0]], { color: j.color, weight: 4, opacity: 0.85 }).addTo(window.leafletMap);

    // START MARKER (birthplace)
    var startStop = stops[0];
    var startHtml = '<div class="journey-marker journey-marker-start" style="border-color:' + j.color + '">'
      + '<div class="journey-marker-icon">🚩</div>'
      + '<div class="journey-marker-num">1</div>'
      + '</div>';
    var startMarker = window.L.marker(pts[0], {
      icon: window.L.divIcon({ html: startHtml, iconSize: [44, 44], iconAnchor: [22, 22], className: '' }),
      zIndexOffset: 1000
    }).addTo(window.leafletMap);
    var startPopup = '<div class="journey-popup">'
      + '<div class="journey-popup-header" style="color:' + j.color + '">🚩 Birthplace · ' + esc(j.name) + '</div>'
      + '<div class="journey-popup-title">' + esc(startStop.t.name) + '</div>'
      + '<div class="journey-popup-loc">' + esc(startStop.t.town) + ', ' + esc(startStop.t.district) + '</div>'
      + '<div class="journey-popup-note">' + esc(j.born_place) + '</div>'
      + '</div>';
    startMarker.bindPopup(startPopup);
    markers.push(startMarker);

    var i = 1;
    var step = Math.max(500, 15000 / pts.length);
    anim = setInterval(function() {
      if (i >= pts.length) {
        clearInterval(anim);
        anim = null;

        // END MARKER (moksha)
        var endStop = stops[stops.length - 1];
        var endHtml = '<div class="journey-marker journey-marker-end" style="border-color:' + j.color + '">'
          + '<div class="journey-marker-icon">🕉️</div>'
          + '<div class="journey-marker-num">' + endStop.order + '</div>'
          + '</div>';
        var endMarker = window.L.marker(pts[pts.length - 1], {
          icon: window.L.divIcon({ html: endHtml, iconSize: [44, 44], iconAnchor: [22, 22], className: '' }),
          zIndexOffset: 1000
        }).addTo(window.leafletMap);
        var endPopup = '<div class="journey-popup">'
          + '<div class="journey-popup-header" style="color:' + j.color + '">🕉️ Moksha · ' + esc(j.name) + '</div>'
          + '<div class="journey-popup-title">' + esc(endStop.t.name) + '</div>'
          + '<div class="journey-popup-loc">' + esc(endStop.t.town) + ', ' + esc(endStop.t.district) + '</div>'
          + '<div class="journey-popup-note">' + esc(j.moksha_place) + '</div>'
          + '</div>';
        endMarker.bindPopup(endPopup);
        markers.push(endMarker);
        return;
      }

      poly.addLatLng(pts[i]);
      var st = stops[i];
      var m = window.L.circleMarker(pts[i], { radius: 8, fillColor: j.color, color: "#fff", weight: 2, fillOpacity: 1 }).addTo(window.leafletMap);
      m.bindTooltip("#" + st.order + " " + st.t.name, { direction: 'top' });

      var stopPopup = '<div class="journey-popup">'
        + '<div class="journey-popup-header" style="color:' + j.color + '">Stop #' + st.order + ' · ' + esc(j.name) + '</div>'
        + '<div class="journey-popup-title">' + esc(st.t.name) + '</div>'
        + '<div class="journey-popup-loc">' + esc(st.t.town) + ', ' + esc(st.t.district) + '</div>'
        + (st.t.saints ? '<div class="journey-popup-note">Sung by: ' + esc(st.t.saints) + '</div>' : '')
        + '</div>';
      m.bindPopup(stopPopup);

      markers.push(m);
      i++;
    }, step);
  }

  function build() {
    if (!window.TEMPLES || !window.leafletMap || !window.L) {
      setTimeout(build, 200);
      return;
    }
    if (document.querySelector(".nv-panel")) return;

    var c = document.createElement("div");
    c.className = "nv-panel";
    var btnHtml = "";
    Object.keys(JOURNEYS).forEach(function(k) {
      var jr = JOURNEYS[k];
            btnHtml += '<button class="nv-btn" data-saint="' + k + '" style="border-color:' + jr.color + ';color:' + jr.color + '">🪔 ' + jr.name + '<span class="nv-btn-ta">' + jr.name_ta + '</span><small>' + jr.century + '</small></button>';
    });

    c.innerHTML = '<div class="nv-header">'
      + '<div class="nv-title">Trace a saint\'s pilgrimage</div>'
      + '<button class="nv-toggle" title="Minimize/Expand">−</button>'
      + '</div>'
      + '<div class="nv-body">'
      + '<div class="nv-btns">' + btnHtml + '</div>'
      + '<button class="nv-btn-clear" data-saint="clear">Clear map</button>'
      + '<div class="nv-note">Traditional sequence per Periya Puranam (Sekkizhar, 12th c.). Historical routes debated among scholars.</div>'
      + '</div>';

    document.body.appendChild(c);

    c.addEventListener("click", function(e) {
      // Minimize toggle
      var toggleBtn = e.target.closest(".nv-toggle");
      if (toggleBtn) {
        e.stopPropagation();
        c.classList.toggle("minimized");
        toggleBtn.textContent = c.classList.contains("minimized") ? "+" : "−";
        toggleBtn.title = c.classList.contains("minimized") ? "Expand" : "Minimize";
        return;
      }
      // Saint button or clear
      var b = e.target.closest("[data-saint]");
      if (!b) return;
      e.stopPropagation();
      c.querySelectorAll(".nv-btn").forEach(function(x) { x.classList.remove("active"); });
      if (b.dataset.saint === "clear") {
        clear();
      } else {
        b.classList.add("active");
        draw(b.dataset.saint);
      }
    });

    console.log("[naalvar_journeys] Loaded - 4 saints, 50 stops");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();