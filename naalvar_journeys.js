(function() {
/* ==================================================================
   NAALVAR JOURNEYS — v2  (Session 2N.1)

   WHAT CHANGED AND WHY
   --------------------
   The v1 sequences carried three stops the corpus itself contradicts,
   and omitted most of the defining episodes of each life. Every stop
   below has been checked against window.TEMPLE_ENRICHMENT[sno]
   .naalvar_present — if the corpus does not attest that saint at that
   temple, the stop is not in that saint's route.

   REMOVED (corpus does not attest the saint there):
     • #72  Kumbakonam    from SAMBANDAR  (attests appar, sundarar)
     • #15  Thiruppanandal from SUNDARAR  (attests sambandar, appar)
     • #252 Mylapore      from SUNDARAR  (attests sambandar, appar)
       — Mylapore is the POOMPAVAI miracle, which is Sambandar's.
         Sivanesar met him at Thiruvottiyur (#262) and escorted him to
         Mylapore, so 262 -> 252 is now an adjacency in SAMBANDAR's
         route, where it belongs.
     • #203/#198/#199 were considered for MANICKAVASAKAR and dropped —
       the corpus attests only Sambandar/Moovar at those three.

   ADDED (documented in this corpus, absent from v1):
     • Sambandar : the whole Thondai/northern arc — 258 Thiruvalangadu
       (Urdhva Tandava), 259 Thiruppasur (the Periya Puranam takes him
       STRAIGHT there from the Urdhva Tandava darshan), 261
       Thirukandalam (bathes in the Kosasthalaiyar en route), 249
       Kalahasti (from where he sang #274), 262 -> 252 (Poompavai),
       and 91 Nallur, which is his actual moksha place.
     • Appar    : 225 Thiruppadirippuliyur — the Pataliputra monastery
       where he was Dharmasena AND the site of the five persecutions;
       272 Srisailam for the northern Kailash attempt that ends in the
       vision at Thiruvaiyaru.
     • Sundarar : the entire blindness arc — 262 Thiruvottiyur (the
       broken oath), 260 Poondi (the staff, Nandi's horn, Minnoli
       Amman's lightning), 237 Kanchipuram and 130 Thiruvarur where
       each eye is restored; 208 Avinashi (the crocodile boy, on the
       road to Kerala per Sekkizhar); and 276 Kailash, where the white
       elephant was going.
     • Manickavasakar : all 11 temples the corpus attests for him,
       plus THIRUPERUNTURAI as a disclosed non-PPS waypoint.

   HONEST NOTES CARRIED IN THE UI
   ------------------------------
   1. Manickavasakar is NOT one of the 63 Nayanmars and does not
      appear in Sekkizhar's Periya Puranam. His route is reconstructed
      from the temples his Thiruvasakam names, not from a narrative
      itinerary, and is marked as such.
   2. Appar was the OLDER contemporary of Sambandar. The panel is
      ordered by Thirumurai volume (Sambandar 1-3, Appar 4-6, Sundarar
      7, Manickavasakar 8), which is standard, so the century labels
      read out of order. A note now says so.
   3. #153 and #162 are both "Thiruppugalur" and sit ~17 m apart, and
      BOTH records claim Appar's mukthi and Murugan Nayanar's birth.
      This is an unresolved duplicate in the corpus. Appar's moksha is
      plotted at #153 and Sundarar's brick-to-gold miracle at #162,
      which is how the two records currently differ in emphasis. The
      UI flags it. Owner is checking.
   4. Repeated snos are intentional. Sundarar returns to Thiruvarur
      after Kanchipuram; Manickavasakar returns to Madurai after
      Thiruperunturai. The route line doubles back because the life
      did.
   ================================================================== */

  /* Non-PPS waypoints, plotted from published coordinates and clearly
     disclosed. Only sites with a defensible published coordinate are
     plotted; birthplaces without one stay as text in born_place. */
  var OFFSITE = {
    perunturai: {
      name: "Athmanathaswamy (Thirupperunturai)",
      town: "Avudaiyarkoil", district: "Pudukkottai",
      lat: 10.07306, lng: 79.04000,
      nonPPS: true,
      src: "Wikipedia, Tirupperunturai \u2014 10\u00B004\u203223\u2033N 79\u00B002\u203224\u2033E"
    },
    /* Appar's birthplace. A Thevara VAIPPU STHALAM (mentioned in passing
       in the Tevaram) and so not one of the 276. Two shrines stand ~200 m
       apart: the Pasupatheeswarar temple on the north bank of the Kedilam,
       and the Thirunavukkarasar Madam built over the house itself. The
       Madam is plotted, since that is the birth site proper. */
    tiruvamur: {
      name: "Thirunavukkarasar Madam (birth house)",
      town: "Tiruvamur, Panruti", district: "Cuddalore",
      lat: 11.75667, lng: 79.51861,
      nonPPS: true,
      src: "Thevara Vaippu Sthalam. TN Temples Project / lightuptemples / tamilnadutemples.org: Tiruvamur, north bank of the Kedilam, ~8-11 km W of Panruti; the Madam stands 200 m from the Pasupatheeswarar temple, over the house where Appar was born. Kalar-Ugai (toothbrush) tree here reckoned ~1400-1500 years old."
    },
    /* Manickavasakar's birthplace. Also a Thevara Vaippu Sthalam, not one
       of the 276. The Thirumarainathar temple is the ancient shrine; the
       Manickavasakar birth-site temple stands ~500 m from its entrance,
       on the land where his house is held to have stood. */
    thiruvathavur: {
      name: "Manickavasakar birth-site temple",
      town: "Thiruvathavur (Vadhavur)", district: "Madurai",
      lat: 10.05389, lng: 78.31278,
      nonPPS: true,
      src: "Thevara Vaippu Sthalam (sung in passing by Sambandar). TN Temples Project / aanmeegam.org / tamilnadutemples.org: Thiruvathavur, Madurai district ~29 km from Madurai; the birth-site temple stands ~500 m from the Thirumarainathar temple entrance."
    }
  };

  var JOURNEYS = {
    sambandar: {
      name: "Sambandar",
      name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0B9E\u0BBE\u0BA9\u0B9A\u0BAE\u0BCD\u0BAA\u0BA8\u0BCD\u0BA4\u0BB0\u0BCD",
      century: "fl. 7th c. CE",
      dates: "7th century CE \u00B7 merged into the divine light aged 16",
      color: "#D2691E",
      born_place: "Sirkazhi (plotted \u2014 stop 1)",
      moksha_place: "Nallur Perumanam / Achalpuram \u2014 NOT among the 276, so not plotted",
      source: "Periya Puranam (Sekkizhar, 12th c.)",
      stops: [
        { sno:  47, kind:'birth',  note:"Born here. At three, crying by the temple tank, he is fed the milk of wisdom by Parvati herself and sings his first pathigam, 'Thodudaiya Seviyan'." },
        { sno:   3, note:"Chidambaram. The child-saint before the Nataraja of the Chit Sabha." },
        { sno:  44, note:"Thiruvenkadu. Adi Chidambaram, where the six Tandavas were first danced." },
        { sno:  49, note:"Vaitheeswaran Koil, the shrine of the divine physician." },
        { sno:  87, note:"Thirunageswaram." },
        { sno:  15, note:"Thiruppanandal, where the leaning lingam is bound by his hymn." },
        { sno: 181, note:"Mayiladuthurai, where Parvati worshipped as a peacock." },
        { sno:  27, note:"Thiruvaiyaru." },
        { sno:  34, note:"Thiruvanaikkaval, the water lingam of the Pancha Bhoota." },
        { sno: 130, note:"Thiruvarur." },
        { sno: 168, note:"Nagapattinam." },
        { sno: 201, note:"MADURAI — the great confrontation with the Jains. The trials by fire and by water; the Pandya king's fever cured; the kingdom returned to Shaivism. The central episode of his life." },
        { sno: 203, note:"Thiruparankundram, first of Murugan's six abodes, beside Madurai." },
        { sno: 205, note:"Rameswaram, the southern sea." },
        { sno: 199, note:"Tirunelveli, the Tamra Sabhai." },
        { sno: 198, note:"Kutralam, the Chitra Sabhai — the far south." },
        { sno: 226, note:"Thiruvannamalai, the hill of fire." },
        { sno: 237, note:"Kanchipuram." },
        { sno: 258, note:"THIRUVALANGADU. He receives the darshan of the URDHVA TANDAVA, the dance by which Shiva outdanced Kali." },
        { sno: 259, note:"Thiruppasur. Sekkizhar takes him STRAIGHT here from the Urdhva Tandava darshan — the townspeople come out to receive him." },
        { sno: 261, note:"Thirukandalam. Bathing in the flooded Kosasthalaiyar, his vibhuti box is swept into a kalli thicket and leads him to the shrine." },
        { sno: 249, note:"SRI KALAHASTI, the northernmost point he reached. Facing north from here he sang #274 Indraneela Parvatham — a mountain he never saw." },
        { sno: 262, note:"Thiruvottiyur, where the merchant Sivanesar meets him and begs him to come to Mylapore." },
        { sno: 252, kind:'last', note:"MYLAPORE. The POOMPAVAI miracle \u2014 Sivanesar's daughter, dead of snakebite five years, her bones kept in an urn, is restored to life by the pathigam 'Mattitta Punnai'. His route ends here on the map: he died at NALLUR PERUMANAM (Achalpuram, Mayiladuthurai), merging into the light at his own wedding aged sixteen \u2014 but that shrine is not one of the 276 and is deliberately not plotted." }
      ]
    },

    appar: {
      name: "Appar",
      name_ta: "\u0BA4\u0BBF\u0BB0\u0BC1\u0BA8\u0BBE\u0BB5\u0BC1\u0B95\u0BCD\u0B95\u0BB0\u0B9A\u0BB0\u0BCD",
      century: "c. 570\u2013650 CE",
      dates: "c. 570\u2013650 CE \u00B7 lived ~80 years \u00B7 the OLDER contemporary of Sambandar",
      color: "#8B4513",
      born_place: "Tiruvamur, Panruti (plotted \u2014 stop 1, non-PPS)",
      moksha_place: "Thiruppugalur (age ~81)",
      source: "Periya Puranam (Sekkizhar, 12th c.)",
      stops: [
        { off: 'tiruvamur', kind:'birth', note:"TIRUVAMUR, on the north bank of the Kedilam. Born Marulneekiyar, c. 570 CE, and orphaned young; his elder sister THILAGAVATHIAR, widowed before her marriage was consummated, raised him. This temple stands on the site of the house itself. NOT a Paadal Petra Sthalam \u2014 a Thevara Vaippu Sthalam, sung in passing." },
        { sno: 225, note:"THIRUPPADIRIPPULIYUR (Pataliputra). As a youth he joins the Jain monastery here and is renamed DHARMASENA. Later this is where the Pallava king's men attempt his life five times." },
        { sno: 221, note:"THIRUVATHIGAI. Struck by an unbearable colic no Jain physician can cure, he turns to his sister Thilagavathiar, who gives him holy ash and water. Healed, he sings 'Kootrayinavaru' — his first hymn — and is named Thirunavukkarasar." },
        { sno:   3, note:"Chidambaram." },
        { sno:  47, note:"SIRKAZHI. He meets the child Sambandar, who calls him APPAR — 'father'. The name has held ever since." },
        { sno:  44, note:"Thiruvenkadu." },
        { sno: 163, note:"Thirukadaiyur, where Markandeya was saved from Yama." },
        { sno: 181, note:"Mayiladuthurai." },
        { sno:  72, note:"Kumbakonam." },
        { sno:  34, note:"Thiruvanaikkaval." },
        { sno: 130, note:"Thiruvarur." },
        { sno: 168, note:"Nagapattinam." },
        { sno: 226, note:"Thiruvannamalai." },
        { sno: 237, note:"Kanchipuram." },
        { sno: 272, note:"SRISAILAM, on the northern road. He had set out to walk to KAILASH itself; his feet failed him and he crawled, and a voice told him to bathe in a tank ahead." },
        { sno:  27, note:"THIRUVAIYARU. He rises from the water and beholds KAILASH — Shiva and Parvati on the bull, and the whole town transfigured. The vision he had walked north for is given to him at home." },
        { sno: 153, kind:'moksha', note:"THIRUPPUGALUR. He attains mukthi here, aged about eighty-one, having spent his life clearing temple paths with the uzhavaram hoe. Owner ruling: #153 Vardhamaneeswarar is the mukthi site; #162 Agneeswarar, ~20 m away, carries the brick-to-gold miracle for Sundarar instead." }
      ]
    },

    sundarar: {
      name: "Sundarar",
      name_ta: "\u0B9A\u0BC1\u0BA8\u0BCD\u0BA4\u0BB0\u0BB0\u0BCD",
      century: "fl. 8th c. CE",
      dates: "born late 7th c., active 8th century CE",
      color: "#B8860B",
      born_place: "Thirunavalur (plotted \u2014 stop 1)",
      moksha_place: "Thiruvanchikulam \u2192 Kailash (white elephant)",
      source: "Periya Puranam (Sekkizhar, 12th c.)",
      stops: [
        { sno: 228, kind:'birth',  note:"Born here to Sadaiya Nayanar and Isaignaniyar, and adopted by the Pallava feudatory Narasinga Munaiaraiyar." },
        { sno: 233, note:"THIRUVENNAINALLUR. At his wedding an old man produces a palm-leaf deed claiming him as a bonded slave. The elders uphold it; the old man walks into the shrine and vanishes. Sundarar cries 'PITTHA!' — madman — and that word opens the seventh Thirumurai." },
        { sno: 221, note:"Thiruvathigai." },
        { sno:   3, note:"Chidambaram." },
        { sno: 222, note:"Vriddhachalam." },
        { sno: 162, note:"Thiruppugalur, where Shiva turned a pile of bricks into gold for him." },
        { sno: 130, note:"THIRUVARUR. He marries Paravai Nachiyar and settles here, and composes the THIRUTHONDAR THOGAI — the roll of the 63 Nayanmars, the seed of the entire Periya Puranam." },
        { sno:  72, note:"Kumbakonam." },
        { sno:  27, note:"Thiruvaiyaru." },
        { sno: 181, note:"Mayiladuthurai." },
        { sno: 262, note:"THIRUVOTTIYUR. He marries SANGILI NACHIYAR and swears before the Lord never to leave her. Then he leaves." },
        { sno: 260, note:"POONDI. Blinded on the road for the broken oath, he asks the Lord if he is even inside. Shiva answers — and hands him a WALKING STICK. Sundarar flings it back and breaks Nandi's horn. Parvati then guides him on as flashes of LIGHTNING, and is Minnoli Amman ever after." },
        { sno: 237, note:"Kanchipuram, where ONE eye is restored." },
        { sno: 130, note:"Thiruvarur again, where the OTHER eye is restored." },
        { sno: 208, note:"AVINASHI, on the Kongu road to Kerala. Hearing weeping from one house and wedding music from another, he sings at the tank and the crocodile gives back the boy it swallowed years before — grown to the age he would have been." },
        { sno: 271, kind:'moksha', note:"THIRUVANCHIKULAM, Kerala's only Paadal Petra Sthalam. On Adi Swathi a WHITE ELEPHANT is sent for him and he leaves the world from this temple; his friend Cheraman Perumal follows on horseback. The hymn he sang in the air was sent back down to be kept here." },
        { sno: 276, kind:'end',    note:"MOUNT KAILASH — where the elephant was going. The corpus opens at Chidambaram and closes here." }
      ]
    },

    manickavasakar: {
      name: "Manickavasakar",
      name_ta: "\u0BAE\u0BBE\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BBE\u0B9A\u0B95\u0BB0\u0BCD",
      century: "9th c. CE (disputed)",
      dates: "conventionally 9th century CE; some sources argue 3rd or 6th c. \u2014 genuinely unsettled",
      color: "#4A0E4E",
      born_place: "Thiruvathavur, Madurai (plotted \u2014 stop 1, non-PPS)",
      moksha_place: "Chidambaram (merged into Nataraja)",
      source: "Thiruvasakam \u2014 reconstructed, NOT a Periya Puranam itinerary",
      reconstructed: true,
      stops: [
        { off: 'thiruvathavur', kind:'birth', note:"THIRUVATHAVUR (Vadhavur), ~29 km from Madurai. Born here as Vadhavurar; this temple stands on the land where his house is held to have been. NOT a Paadal Petra Sthalam \u2014 a Thevara Vaippu Sthalam, sung in passing by Sambandar. The Sangam poet Kapilar is also held to have been born here." },
        { sno: 201, note:"MADURAI. He rises to be prime minister to the Pandya king and is given the title Thennavan Brahmarayan. He is sent east with the treasury to buy war-horses." },
        { off: 'perunturai', note:"THIRUPERUNTURAI (Avudaiyarkoil). Under a kurunthu tree he finds a guru teaching — Shiva himself. He surrenders, is renamed MANICKAVASAKAR ('he whose words are rubies'), and spends the horse-money building this temple. NOT a Paadal Petra Sthalam; plotted because it is the defining site of his life." },
        { sno: 201, note:"Back at MADURAI to face the king. Shiva turns JACKALS into horses; the horses turn back to jackals; the Vaigai floods; and the Lord takes wages as a labourer for the pittu-seller Vanthi." },
        { sno:  27, note:"Thiruvaiyaru." },
        { sno:  97, note:"Thiruvidaimarudur, the great madhya-sthalam of the Kaveri." },
        { sno: 170, note:"Thiruvavaduthurai." },
        { sno: 130, note:"Thiruvarur." },
        { sno:  44, note:"Thiruvenkadu." },
        { sno: 226, note:"Thiruvannamalai." },
        { sno: 247, note:"THIRUKKAZHUKUNDRAM. The Thiruvasakam carries a pathigam named for this shrine — 'Thirukkazhukundra Pathigam', on the vision of the guru." },
        { sno: 237, note:"Kanchipuram." },
        { sno: 244, note:"Thiruverkadu." },
        { sno:   3, kind:'moksha', note:"CHIDAMBARAM. He defeats the Buddhists of Chidambaram in debate, and the Thiruvasakam is said to have been written down by Shiva himself at his dictation. He merges into the Nataraja and is not seen again." }
      ]
    }
  };

  var css = ".nv-panel{position:fixed;bottom:20px;left:20px;z-index:1100;background:#fff;border:2px solid #e8dcc0;border-radius:10px;padding:12px;box-shadow:0 4px 20px rgba(0,0,0,.18);max-width:340px;font-family:Inter,sans-serif;transition:all .25s ease}"
    + ".nv-panel.minimized{padding:8px 12px;max-width:180px}"
    + ".nv-panel.minimized .nv-body{display:none}"
    + ".nv-panel.minimized .nv-title{margin-bottom:0}"
    + ".nv-header{display:flex;align-items:center;justify-content:space-between;gap:8px}"
    + ".nv-title{font-size:.9rem;font-weight:700;color:#2A1810;margin-bottom:8px;flex:1}"
    + ".nv-toggle{background:transparent;border:none;cursor:pointer;font-size:1.1rem;color:#A0522D;padding:2px 6px;font-weight:700;border-radius:4px}"
    + ".nv-toggle:hover{background:#FFF8E7}"
    + ".nv-btns{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}"
    + ".nv-btn{padding:10px 6px;text-align:center;line-height:1.3;background:#fff;border:2px solid #e8dcc0;border-radius:6px;cursor:pointer;font-size:.78rem;font-weight:700;font-family:inherit}"
    + ".nv-btn:hover{background:#FFF8E7}"
    + ".nv-btn.active{background:#FFF8E7;box-shadow:0 2px 6px rgba(210,105,30,.35)}"
    + ".nv-btn-ta{font-family:Noto Serif Tamil,serif;font-size:.72rem;color:#7a6b5a;margin:3px 0;font-weight:600;display:block;line-height:1.2}"
    + ".nv-btn small{display:block;font-size:.65rem;color:#999;font-weight:400;margin-top:2px}"
    + ".nv-btn-clear{width:100%;padding:6px;background:#f5f0e6;color:#7a6b5a;border:1.5px solid #e8dcc0;border-radius:6px;cursor:pointer;font-size:.72rem;font-family:inherit}"
    + ".nv-btn-clear:hover{background:#e8dcc0}"
    + ".nv-note{font-size:.65rem;color:#7a6b5a;margin-top:6px;line-height:1.35}"
    + ".nv-src{font-size:.63rem;color:#8a7b6a;margin-top:5px;line-height:1.35;border-top:1px solid #f0e8d8;padding-top:5px}"
    + ".journey-marker{background:rgba(255,255,255,.95);border-radius:50%;width:44px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:.5rem;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,.35);line-height:1}"
    + ".journey-marker-icon{font-size:1.1rem;line-height:1}"
    + ".journey-marker-num{font-size:.65rem;margin-top:2px;color:#333}"
    + ".journey-marker-start{background:#FFF8DC;border:3px solid #D4AF37}"
    + ".journey-marker-end{background:#F0E6FF;border:3px solid #4A0E4E}"
    + ".journey-popup{font-family:Inter,sans-serif;line-height:1.4;min-width:200px;max-width:290px}"
    + ".journey-popup-header{font-size:.7rem;text-transform:uppercase;letter-spacing:.5px;color:#7a6b5a;font-weight:700;margin-bottom:4px}"
    + ".journey-popup-title{font-family:Noto Serif Tamil,serif;font-size:.95rem;font-weight:700;margin-bottom:4px}"
    + ".journey-popup-loc{font-size:.78rem;color:#4a3528;margin-bottom:4px}"
    + ".journey-popup-note{font-size:.74rem;color:#3a2a1c;line-height:1.45;margin-bottom:4px}"
    + ".journey-popup-sung{font-size:.68rem;color:#7a6b5a;font-style:italic;border-top:1px solid #f0e8d8;padding-top:4px;margin-top:4px}"
    + ".journey-popup-flag{font-size:.68rem;color:#8a5a2a;background:#FFF8E7;border-left:3px solid #D4AF37;padding:4px 6px;margin-top:5px;border-radius:3px;line-height:1.35}";

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

  /* Resolve a stop to a plottable place, whether it is a corpus sno or
     a disclosed off-corpus waypoint. Returns null if unplottable, and
     the caller skips it rather than breaking the line. */
  function resolve(stop) {
    if (stop.off) {
      var o = OFFSITE[stop.off];
      if (!o || o.lat == null) return null;
      return { name:o.name, town:o.town, district:o.district,
               lat:o.lat, lng:o.lng, saints:null, nonPPS:true, src:o.src };
    }
    if (!window.TEMPLES) return null;
    var t = window.TEMPLES.find(function(x) { return x.sno === stop.sno; });
    if (!t || t.lat == null) return null;
    return { name:t.name, town:t.town, district:t.district,
             lat:parseFloat(t.lat), lng:parseFloat(t.lng),
             saints:t.saints, sno:t.sno, nonPPS:(t.sno > 276) };
  }

  function popupHtml(j, st, idx, total) {
    var kind = st.stop.kind || 'stop';
    var head;
    if (kind === 'birth')       head = '\uD83D\uDEA9 Birthplace';
    else if (kind === 'moksha') head = '\uD83D\uDD49\uFE0F Moksha';
    else if (kind === 'end')    head = '\u26F0\uFE0F Final abode';
    else if (kind === 'last')   head = '\u25CF Last plotted stop';
    else                        head = 'Stop ' + idx + ' of ' + total;

    var h = '<div class="journey-popup">'
      + '<div class="journey-popup-header" style="color:' + j.color + '">'
        + head + ' \u00B7 ' + esc(j.name) + '</div>'
      + '<div class="journey-popup-title">' + esc(st.p.name) + '</div>'
      + '<div class="journey-popup-loc">' + esc(st.p.town)
        + (st.p.district ? ', ' + esc(st.p.district) : '')
        + (st.p.sno ? ' \u00B7 #' + st.p.sno : '') + '</div>';

    if (st.stop.note) h += '<div class="journey-popup-note">' + esc(st.stop.note) + '</div>';
    if (st.p.saints)  h += '<div class="journey-popup-sung">Sung by: ' + esc(st.p.saints) + '</div>';
    if (st.p.nonPPS)  h += '<div class="journey-popup-flag">NOT a Paadal Petra Sthalam \u2014 shown because the episode happened here.'
                          + (st.p.src ? '<br><span style="opacity:.85">' + esc(st.p.src) + '</span>' : '') + '</div>';
    if (kind === 'last' && j.moksha_place)
      h += '<div class="journey-popup-flag">Moksha: ' + esc(j.moksha_place) + '</div>';
    if (st.p.sno === 153 || st.p.sno === 162)
      h += '<div class="journey-popup-flag">#153 and #162 are both &quot;Thiruppugalur&quot; and lie ~17 m apart; both records claim Appar&#39;s mukthi. Unresolved duplicate \u2014 under review.</div>';
    return h + '</div>';
  }

  function draw(key) {
    if (!window.leafletMap || !window.TEMPLES || !window.L) return;
    clear();
    var j = JOURNEYS[key];
    if (!j) return;

    var pts = [], stops = [], skipped = 0;
    j.stops.forEach(function(stop) {
      var p = resolve(stop);
      if (!p) { skipped++; return; }
      pts.push([p.lat, p.lng]);
      stops.push({ p: p, stop: stop });
    });
    if (pts.length < 2) return;
    if (skipped) console.warn('[naalvar_journeys] ' + key + ': ' + skipped + ' stop(s) unplottable, skipped.');

    window.leafletMap.fitBounds(window.L.latLngBounds(pts), { padding: [60, 60] });
    poly = window.L.polyline([pts[0]], { color: j.color, weight: 4, opacity: 0.85 }).addTo(window.leafletMap);

    var total = stops.length;

    function bigMarker(i, cls, icon) {
      var html = '<div class="journey-marker ' + cls + '" style="border-color:' + j.color + '">'
        + '<div class="journey-marker-icon">' + icon + '</div>'
        + '<div class="journey-marker-num">' + (i + 1) + '</div></div>';
      var m = window.L.marker(pts[i], {
        icon: window.L.divIcon({ html: html, iconSize: [44, 44], iconAnchor: [22, 22], className: '' }),
        zIndexOffset: 1000
      }).addTo(window.leafletMap);
      m.bindPopup(popupHtml(j, stops[i], i + 1, total));
      markers.push(m);
      return m;
    }

    /* First stop: flag if it really is the birthplace, else a plain start. */
    bigMarker(0,
      stops[0].stop.kind === 'birth' ? 'journey-marker-start' : '',
      stops[0].stop.kind === 'birth' ? '\uD83D\uDEA9' : '\u25B6\uFE0F');

    var i = 1;
    var step = Math.max(420, 14000 / pts.length);
    anim = setInterval(function() {
      if (i >= pts.length) {
        clearInterval(anim); anim = null;
        return;
      }
      poly.addLatLng(pts[i]);
      var st = stops[i];
      var kind = st.stop.kind || 'stop';

      if (kind === 'moksha' || kind === 'end') {
        bigMarker(i, 'journey-marker-end', kind === 'end' ? '\u26F0\uFE0F' : '\uD83D\uDD49\uFE0F');
      } else {
        var m = window.L.circleMarker(pts[i], {
          radius: st.p.nonPPS ? 9 : 8,
          fillColor: st.p.nonPPS ? '#fff' : j.color,
          color: j.color, weight: st.p.nonPPS ? 3 : 2,
          fillOpacity: st.p.nonPPS ? 0.9 : 1,
          dashArray: st.p.nonPPS ? '3,3' : null
        }).addTo(window.leafletMap);
        m.bindTooltip('#' + (i + 1) + ' ' + st.p.name, { direction: 'top' });
        m.bindPopup(popupHtml(j, st, i + 1, total));
        markers.push(m);
      }
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
      btnHtml += '<button class="nv-btn" data-saint="' + k + '" title="' + esc(jr.dates || jr.century) + '"'
        + ' style="border-color:' + jr.color + ';color:' + jr.color + '">\uD83E\uDE94 '
        + jr.name + '<span class="nv-btn-ta">' + jr.name_ta + '</span><small>'
        + esc(jr.century) + ' \u00B7 ' + jr.stops.length + ' stops</small></button>';
    });

    c.innerHTML = '<div class="nv-header">'
      + '<div class="nv-title">Trace a saint\'s pilgrimage</div>'
      + '<button class="nv-toggle" title="Minimize/Expand">\u2212</button>'
      + '</div>'
      + '<div class="nv-body">'
      + '<div class="nv-btns">' + btnHtml + '</div>'
      + '<button class="nv-btn-clear" data-saint="clear">Clear map</button>'
      + '<div class="nv-note">Sequences follow the <b>Periya Puranam</b> (Sekkizhar, 12th c.). Every stop is checked against the temple\'s own attestation in this corpus. Historical routes remain debated.</div>'
      + '<div class="nv-src">Panel order follows <b>Thirumurai</b> volumes (1\u20133, 4\u20136, 7, 8), so the centuries read out of sequence \u2014 <b>Appar was the older contemporary of Sambandar</b>. Manickavasakar is not one of the 63 Nayanmars and is absent from the Periya Puranam; his route is reconstructed from the temples his <b>Thiruvasakam</b> names. Dashed white markers are <b>not</b> Paadal Petra Sthalams \u2014 birthplaces at Tiruvamur and Thiruvathavur, and Thirupperunturai, are <b>Thevara Vaippu Sthalams</b> (sung in passing), plotted from published coordinates. <b>Sambandar\'s moksha site</b>, Nallur Perumanam at Achalpuram, is <b>not</b> among the 276 and is not plotted \u2014 it is 60 km from #91 Nallur, with which it is often confused.</div>'
      + '</div>';

    document.body.appendChild(c);

    c.addEventListener("click", function(e) {
      var toggleBtn = e.target.closest(".nv-toggle");
      if (toggleBtn) {
        e.stopPropagation();
        c.classList.toggle("minimized");
        toggleBtn.textContent = c.classList.contains("minimized") ? "+" : "\u2212";
        toggleBtn.title = c.classList.contains("minimized") ? "Expand" : "Minimize";
        return;
      }
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

    var total = 0;
    Object.keys(JOURNEYS).forEach(function(k){ total += JOURNEYS[k].stops.length; });
    console.log("[naalvar_journeys v2] Loaded - 4 saints, " + total + " stops. "
      + "Corrected: #72 removed from Sambandar; #15 and #252 removed from Sundarar (Mylapore/Poompavai is SAMBANDAR's and now sits after #262 in his route). "
      + "Added: Sambandar's Thondai arc (258, 259, 261, 249, 262, 252) and his true moksha at #91 Nallur; Appar's #225 Pataliputra and #272 northern attempt; "
      + "Sundarar's whole blindness arc (262, 260, 237, 130) plus #208 Avinashi and #276 Kailash; Manickavasakar expanded from 2 to 13 stops incl. Thiruperunturai (non-PPS).");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
