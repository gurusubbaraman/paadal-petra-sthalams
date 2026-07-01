/**
 * NAALVAR JOURNEYS — Self-Contained Module
 * ================================================================
 * Adds animated pilgrimage trails for the four Saiva Kuravars
 * on the Leaflet map, with a floating UI panel.
 *
 * This file is fully self-contained:
 *   - Journey data (Periya Puranam sequences)
 *   - CSS styles (injected at load)
 *   - UI panel (self-mounts on <body>)
 *   - Map animation (Leaflet integration)
 *
 * Dependencies: window.TEMPLES, window.map, window.L (Leaflet)
 * If any dependency is missing, this module silently no-ops.
 *
 * Traditional pilgrimage sequences per Periya Puranam (Sekkizhar, 12th c.).
 * Exact historical routes are debated among scholars.
 */
(function() {
  'use strict';

  // ============================================================
  // JOURNEY DATA
  // ============================================================
  var JOURNEYS = {
    sambandar: {
      name: "Thirugnanasambandar",
      name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0B9E\u0BBE\u0BA9\u0B9A\u0BAE\u0BCD\u0BAA\u0BA8\u0BCD\u0BA4\u0BB0\u0BCD",
      century: "7th c. CE",
      color: "#D2691E",
      icon: "\uD83E\uDE94",
      born_place: "Sirkazhi",
      moksha_place: "Nallur Perumanam (age 16)",
      summary: "Born to Sivapada Hrudiyar in Sirkazhi. At age 3, sang his first pathigam. Defeated the Jain scholars at Madurai and merged with divine effulgence at age 16.",
      sequence: [47, 3, 44, 49, 15, 72, 87, 34, 27, 130, 168, 201, 203, 205, 199, 198, 226, 237, 47]
    },
    appar: {
      name: "Tirunavukkarasar (Appar)",
      name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BA8\u0BBE\u0BB5\u0BC1\u0B95\u0BCD\u0B95\u0BB0\u0B9A\u0BB0\u0BCD",
      century: "6-7th c. CE",
      color: "#8B4513",
      icon: "\uD83E\uDE94",
      born_place: "Tiruvamur, Panruti",
      moksha_place: "Thiruppugalur (age 81)",
      summary: "Converted from Jainism to Saivism at Thiruvathigai. Sambandar named him Appar. Traveled to ~125 temples carrying a farmer hoe, cleaning temple pathways.",
      sequence: [221, 3, 27, 130, 47, 44, 72, 34, 168, 181, 163, 226, 237, 153]
    },
    sundarar: {
      name: "Sundaramurthi (Sundarar)",
      name_ta: "\u0B9A\u0BC1\u0BA8\u0BCD\u0BA4\u0BB0\u0BAE\u0BC2\u0BB0\u0BCD\u0BA4\u0BCD\u0BA4\u0BBF \u0BA8\u0BBE\u0BAF\u0BA9\u0BBE\u0BB0\u0BCD",
      century: "8th c. CE",
      color: "#B8860B",
      icon: "\uD83E\uDE94",
      born_place: "Thirunavalur",
      moksha_place: "Thiruvanchikulam, Kerala (on white elephant to Kailasa)",
      summary: "At his wedding at Puttur, Shiva appeared as an old Brahmin and claimed him as a hereditary servant. His first pathigam at Thiruvennainallur begins Pittha Pirai Sudi. Only Nayanmar to attain moksha in Kerala.",
      sequence: [228, 233, 221, 3, 130, 153, 222, 27, 72, 15, 181, 262, 252, 201, 271]
    },
    manickavasakar: {
      name: "Manickavasakar",
      name_ta: "\u0BAE\u0BBE\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BBE\u0B9A\u0B95\u0BB0\u0BCD",
      century: "9th c. CE",
      color: "#4A0E4E",
      icon: "\uD83E\uDE94",
      born_place: "Thiruvadhavur (near Madurai)",
      moksha_place: "Chidambaram (merged into Nataraja)",
      summary: "Pandya prime minister who met Shiva as guru at Perundurai. Imprisoned at Madurai, Shiva turned foxes into horses. Composed Thiruvasagam mainly at Chidambaram, where he attained moksha.",
      sequence: [201, 3]
    }
  };

  // ============================================================
  // CSS INJECTION
  // ============================================================
  var cssRules = [
    ".naalvar-selector{position:fixed;bottom:20px;left:20px;z-index:1100;background:#fff;border:2px solid #e8dcc0;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.18);max-width:340px;overflow:hidden;font-family:Inter,sans-serif}",
    ".naalvar-header{background:linear-gradient(135deg,#FFF8E7 0%,#FEF0C7 100%);padding:10px 14px;border-bottom:1px solid #e8dcc0;display:flex;align-items:center;gap:8px}",
    ".naalvar-title{font-size:.88rem;font-weight:700;color:#2A1810;flex:1}",
    ".naalvar-subtitle{font-family:Noto Serif Tamil,serif;font-size:.72rem;color:#7a6b5a}",
    ".naalvar-toggle{background:transparent;border:none;cursor:pointer;font-size:1.2rem;color:#A0522D;padding:0 4px;font-weight:700}",
    ".naalvar-body{padding:12px}",
    ".naalvar-selector.minimized .naalvar-body{display:none}",
    ".naalvar-buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}",
    ".naalvar-btn{padding:10px 6px;background:#fff;border:2px solid #e8dcc0;border-radius:8px;cursor:pointer;text-align:center;transition:all .15s;line-height:1.2;font-family:inherit}",
    ".naalvar-btn:hover{background:#FFF8E7;transform:translateY(-1px);box-shadow:0 2px 6px rgba(0,0,0,.1)}",
    ".naalvar-btn.active{background:#FFF8E7;box-shadow:0 2px 8px rgba(210,105,30,.35)}",
    ".naalvar-btn-icon{font-size:1.2rem;margin-bottom:2px}",
    ".naalvar-btn-name{font-size:.78rem;font-weight:700}",
    ".naalvar-btn-name-ta{font-family:Noto Serif Tamil,serif;font-size:.72rem;color:#7a6b5a;margin-top:2px}",
    ".naalvar-btn-century{font-size:.62rem;color:#999;margin-top:2px}",
    ".naalvar-btn-clear{width:100%;padding:6px;background:#f5f0e6;color:#7a6b5a;border:1.5px solid #e8dcc0;border-radius:6px;cursor:pointer;font-size:.75rem;font-weight:600;margin-bottom:8px;font-family:inherit}",
    ".naalvar-btn-clear:hover{background:#e8dcc0}",
    ".naalvar-disclaimer{font-size:.65rem;color:#7a6b5a;line-height:1.4;padding-top:8px;border-top:1px solid #e8dcc0}",
    ".naalvar-disclaimer a{color:#D4AF37;text-decoration:none}",
    ".naalvar-disclaimer a:hover{text-decoration:underline}",
    ".journey-marker{background:rgba(255,255,255,.95);border:3px solid #D2691E;border-radius:50%;width:40px;height:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:.55rem;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,.35)}",
    ".journey-marker span{font-size:.7rem;margin-top:1px}",
    ".journey-marker-start{background:#D4AF37;color:#fff}",
    ".journey-marker-end{background:#4A0E4E;color:#fff}",
    "@media(max-width:900px){.naalvar-selector{bottom:10px;left:10px;right:10px;max-width:none}}"
  ];

  var styleEl = document.createElement("style");
  styleEl.setAttribute("data-source", "naalvar_journeys");
  styleEl.textContent = cssRules.join("");
  document.head.appendChild(styleEl);

  // ============================================================
  // ANIMATION STATE
  // ============================================================
  var currentPolyline = null;
  var currentMarkers = [];
  var currentInterval = null;

  function clearJourney() {
    if (typeof window.map === 'undefined') return;
    if (currentPolyline) {
      window.map.removeLayer(currentPolyline);
      currentPolyline = null;
    }
    currentMarkers.forEach(function(m) {
      window.map.removeLayer(m);
    });
    currentMarkers = [];
    if (currentInterval) {
      clearInterval(currentInterval);
      currentInterval = null;
    }
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[c];
    });
  }

  function drawJourney(saintKey) {
    if (typeof window.map === 'undefined' || typeof window.TEMPLES === 'undefined' || typeof window.L === 'undefined') {
      console.warn("[naalvar_journeys] Dependencies not ready");
      return;
    }
    clearJourney();

    var journey = JOURNEYS[saintKey];
    if (!journey) return;

    var points = [];
    var stops = [];
    journey.sequence.forEach(function(sno, idx) {
      var t = window.TEMPLES.find(function(x) {
        return x.sno === sno;
      });
      if (t && t.lat != null && t.lng != null) {
        points.push([t.lat, t.lng]);
        stops.push({ latlng: [t.lat, t.lng], temple: t, order: idx + 1 });
      }
    });

    if (points.length < 2) {
      console.warn("[naalvar_journeys] Journey has fewer than 2 valid stops");
      return;
    }

    window.map.fitBounds(window.L.latLngBounds(points), { padding: [50, 50] });

    currentPolyline = window.L.polyline([points[0]], {
      color: journey.color,
      weight: 4,
      opacity: 0.85,
      lineJoin: 'round'
    }).addTo(window.map);

    var startIconHtml = '<div class="journey-marker journey-marker-start" style="border-color:' + journey.color + '">' +
      '\uD83D\uDEA9<br><span>1</span></div>';
    var startMarker = window.L.marker(stops[0].latlng, {
      icon: window.L.divIcon({
        html: startIconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: ''
      }),
      zIndexOffset: 1000
    }).addTo(window.map);

    var startPopupHtml = '<b style="color:' + journey.color + '">Start: ' + escapeHtml(journey.name) + '</b><br>' +
      '<b>' + escapeHtml(stops[0].temple.name) + '</b><br>' +
      escapeHtml(stops[0].temple.town) + ', ' + escapeHtml(stops[0].temple.district) + '<br>' +
      '<small><i>' + escapeHtml(journey.born_place) + '</i></small>';
    startMarker.bindPopup(startPopupHtml);
    currentMarkers.push(startMarker);

    var idx = 1;
    var stepMs = Math.max(500, 15000 / points.length);

    currentInterval = setInterval(function() {
      if (idx >= points.length) {
        clearInterval(currentInterval);
        currentInterval = null;

        var endStop = stops[stops.length - 1];
        var endIconHtml = '<div class="journey-marker journey-marker-end" style="border-color:' + journey.color + '">' +
          '\uD83D\uDD49\uFE0F<br><span>' + endStop.order + '</span></div>';
        var endMarker = window.L.marker(endStop.latlng, {
          icon: window.L.divIcon({
            html: endIconHtml,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            className: ''
          }),
          zIndexOffset: 1000
        }).addTo(window.map);

        var endPopupHtml = '<b style="color:' + journey.color + '">Final destination</b><br>' +
          '<b>' + escapeHtml(endStop.temple.name) + '</b><br>' +
          escapeHtml(endStop.temple.town) + '<br>' +
          '<small><i>' + escapeHtml(journey.moksha_place) + '</i></small>';
        endMarker.bindPopup(endPopupHtml);
        currentMarkers.push(endMarker);
        return;
      }

      currentPolyline.addLatLng(points[idx]);

      if (idx < points.length - 1) {
        var stop = stops[idx];
        var stopMarker = window.L.circleMarker(stop.latlng, {
          radius: 7,
          fillColor: journey.color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(window.map);
        stopMarker.bindTooltip('#' + stop.order + ' ' + stop.temple.name, { direction: 'top' });
        var stopPopupHtml = '<b>Stop #' + stop.order + '</b><br>' +
          '<b style="color:' + journey.color + '">' + escapeHtml(stop.temple.name) + '</b><br>' +
          escapeHtml(stop.temple.town) + ', ' + escapeHtml(stop.temple.district);
        stopMarker.bindPopup(stopPopupHtml);
        currentMarkers.push(stopMarker);
      }
      idx++;
    }, stepMs);
  }

  // ============================================================
  // UI PANEL
  // ============================================================
  function buildUI() {
    if (document.querySelector('.naalvar-selector')) return;

    var container = document.createElement('div');
    container.className = 'naalvar-selector';

    var buttonsHtml = '';
    Object.keys(JOURNEYS).forEach(function(key) {
      var s = JOURNEYS[key];
      var shortName = s.name.split(' ')[0].split('(')[0].replace(/[^a-zA-Z]/g, '').trim();
      var shortNameTa = s.name_ta.split(' ')[0].trim();
      buttonsHtml += '<button class="naalvar-btn" data-saint="' + key + '" style="border-color:' + s.color + '">' +
        '<div class="naalvar-btn-icon">' + s.icon + '</div>' +
        '<div class="naalvar-btn-name" style="color:' + s.color + '">' + shortName + '</div>' +
        '<div class="naalvar-btn-name-ta">' + shortNameTa + '</div>' +
        '<div class="naalvar-btn-century">' + s.century + '</div>' +
        '</button>';
    });

    var innerHtml = '<div class="naalvar-header">' +
      '<div>' +
      '<div class="naalvar-title">\uD83D\uDEB6 Trace a saint pilgrimage</div>' +
      '<div class="naalvar-subtitle">\u0BA8\u0BBE\u0BB2\u0BCD\u0BB5\u0BB0\u0BBF\u0BA9\u0BCD \u0BAF\u0BBE\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0\u0BC8</div>' +
      '</div>' +
      '<button class="naalvar-toggle" title="Minimize">-</button>' +
      '</div>' +
      '<div class="naalvar-body">' +
      '<div class="naalvar-buttons">' + buttonsHtml + '</div>' +
      '<button class="naalvar-btn-clear" data-saint="clear">Clear map</button>' +
      '<div class="naalvar-disclaimer">' +
      '<i>Traditional pilgrimage sequence per ' +
      'a href="https://en.wikipedia.org/wiki/Periya_Puranam" target="_blank" rel="noopener">Periya Puranam</a> ' +
      '(Sekkizhar, 12th c.). Exact historical routes are debated among scholars.</i>' +
      '</div>' +
      '</div>';

    container.innerHTML = innerHtml;
    document.body.appendChild(container);

    container.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-saint]');
      if (btn) {
        e.stopPropagation();
        var saint = btn.dataset.saint;
        container.querySelectorAll('.naalvar-btn').forEach(function(b) {
          b.classList.remove('active');
        });
        if (saint === 'clear') {
          clearJourney();
        } else {
          btn.classList.add('active');
          drawJourney(saint);
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'naalvar_journey', {
              event_category: 'engagement',
              event_label: saint
            });
          }
        }
        return;
      }
      var toggle = e.target.closest('.naalvar-toggle');
      if (toggle) {
        e.stopPropagation();
        container.classList.toggle('minimized');
        toggle.textContent = container.classList.contains('minimized') ? '+' : '-';
      }
    });
  }

  // ============================================================
  // BOOT
  // ============================================================
  function boot() {
    if (typeof window.TEMPLES === 'undefined' || typeof window.map === 'undefined' || typeof window.L === 'undefined') {
      setTimeout(boot, 200);
      return;
    }
    buildUI();
    var totalStops = 0;
    Object.keys(JOURNEYS).forEach(function(k) {
      totalStops += JOURNEYS[k].sequence.length;
    });
    console.log("[naalvar_journeys] Loaded - 4 saints, " + totalStops + " total temple stops");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();