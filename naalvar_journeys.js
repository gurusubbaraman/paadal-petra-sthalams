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
    if (typeof 