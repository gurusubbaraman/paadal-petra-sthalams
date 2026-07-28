/* ================================================================== */
/* SESSION_2C1_LOADED — Category-based Map UX (Nov 2026)              */
/*   v2c1f (Session 2C.5 — REVERTS the tier half of 2C.2):             */
/*     Session 2C.2 conflated TWO DIFFERENT AXES that happen to share  */
/*     the labels T1/T2/T3, and that was wrong:                        */
/*        t.tier        = EPIGRAPHIC documentation status. index.html   */
/*                        titles it "Tiers of Epigraphy / கல்வெட்டு" and    */
/*                        defines T1 "Extensively documented in        */
/*                        SII/ASI/ARE", T2 "Regionally documented",    */
/*                        T3 "Likely but not formally catalogued",     */
/*                        T4 "Outside TN epigraphy corpus".            */
/*        content_tier  = EDITORIAL CONTENT DEPTH written by the        */
/*                        enrichment sessions (anchor/T1/T2/T3).        */
/*     Filtering an EPIGRAPHY control by CONTENT DEPTH produced three   */
/*     user-visible defects, all fixed here:                           */
/*     (1) ANCHOR PILL REMOVED. It was injected AFTER index.html had    */
/*         already bound its click handlers at parse time              */
/*         (querySelectorAll('.pill[data-tier]') on load), so it had    */
/*         NO onclick and did nothing when clicked. Reset also rebuilt  */
/*         state.tiers as {T1,T2,T3,T4} and the 1-4 keyboard shortcuts  */
/*         never knew about it. "Anchor" is also not an epigraphic      */
/*         category at all, so the pill was conceptually wrong beside   */
/*         four epigraphy pills.                                       */
/*     (2) passesBase() REVERTED to filter on t.tier. The base site's   */
/*         own passes() has always filtered the SIDEBAR CARDS on        */
/*         t.tier, while 2C.2 filtered the MAP MARKERS on content_tier  */
/*         -- so on the 55 temples where the two fields diverge the     */
/*         list and the map could show different sets. Now aligned.     */
/*     (3) TIER LABELS rebuilt from t.tier, restoring the true counts   */
/*         70 / 197 / 2 / 7. Under 2C.2 they read 81 / 175 / 1 / 0 --   */
/*         and "Outside TN (0)" was plainly false, since seven temples  */
/*         (Koneswaram, Ketheeswaram, Gokarna, Thiruvanchikulam,        */
/*         Srisailam, Pashupatinath, Kailash) lie outside the Tamil     */
/*         Nadu epigraphy corpus.                                      */
/*     content_tier remains the editorial depth field -- it still       */
/*     drives content composition and is documented in README.md. It is */
/*     simply no longer wired to the epigraphy filter. If a content-    */
/*     depth filter is ever wanted it needs its own separate control.   */
/*     (3) CANON: shakti_peetam 10 -> 15 (+44,130,201,237,273);        */
/*         maada_koil 29 -> 33 (+149,158,179,180);                     */
/*         divya_desam 25 -> 26 (+81);                                 */
/*         nava_puliyur 6 -> 9 (+281,282,283 disclosed non-PPS).       */
/*     (4) NEW SET pancha_ishwaram [192,193,284,285,286] with          */
/*         PRECEDENCE / CAT_META / ICONS entries (conch icon).         */
/*   v2c1d: DATA-ONLY edits. NO UI code touched.                       */
/*     (1) CANON.shakti_peetam += 263 Thiruvakkarai (Vakrakali).       */
/*         The Shakti Peetam pill count goes 9 -> 10.                  */
/*     (2) NAME_FIXES += 260 'Oondreswarar' (was 'Oontheeswarar').     */
/*     (3) NEW NAME_TA_FIXES map + loop, for #260 ஊன்றீஸ்வரர். The old      */
/*         Tamil transliterated the wrong English and was itself wrong. */
/*     (4) Pancha Ishwaram prepared but NOT enabled — only 2 of the 5  */
/*         are Paadal Petra Sthalams. See the note by NAME_FIXES.      */
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
    /* 2C.3 FIX: #185 Keelaparasalur (historically THIRUPARIYALUR) was MISSING.
       It is the DAKSHA-SAMHARA member of the eight Atta Veerattanam and IS a
       Paadal Petra Sthalam (sung by Sambandar; 41st south of the Kaveri).
       Without it the set showed only 7 of 8, the pill count was wrong, and
       #185 received no category colour on the map despite its own enrichment
       text declaring it 'one of the eight ATTA VEERATTANAM temples'.
       Confirmed by Wikipedia (Ashta Veeratta Stalam list; Veerateeswarar
       Temple, Thirupariyalur), shivatemples.com (#41 Kaveri Then Karai) and
       the TN Temples Project. The set is now complete at 8:
         59 Korukkai      - Kama Dahana
         95 Thirukandiyur - Brahmasiro-cheda
        156 Thiruvirkudi  - Jalandhara Samhara
        163 Thirukkadaiyur- Kala/Yama Samhara
        185 Thirupariyalur- Daksha Samhara      <-- ADDED
        221 Thiruvathigai - Tripura Samhara
        230 Thirukovilur  - Andhakasura Samhara
        280 Vazhuvur      - Gajasamhara (disclosed non-PPS set-completer)
       Seven of the eight are Paadal Petra Sthalams; only Vazhuvur is not. */
    atta_veerattanam: [59, 95, 156, 163, 185, 221, 230, 280],
    saptha_sthana:    [26, 27, 28, 83, 95, 96, 100],
    navagraha:        [12, 44, 49, 66, 71, 87, 277, 278, 279],
    /* #263 Thiruvakkarai added by owner ruling (2B.36): the shrine of
       VAKRAKALI, who tore the child from the pregnant Dhunmukhi and wears
       it as an earring in her right ear. It is the ONLY Kali in the Tamil
       country enshrined INSIDE a Shiva temple - everywhere else she stands
       outside the village at the burning ground - and she is the FIRST
       darshan a pilgrim has, immediately within the rajagopuram, before
       the Lord. Adi Sankara stilled her anger with a SRI CHAKRA at her
       left foot, whence the place is VAKRA SHANTI TIRUTHALAM. Her shrine
       is grouped in tradition with the Durga of Patteeswaram and the
       Thillai Kali of Chidambaram. */
    /* 2C.2 owner ruling — five added on explicit textual evidence found in
       the enrichment audit:
         #44  Thiruvenkadu — "one of the 51 SHAKTI PEETAMS"
         #130 Thiruvarur   — exceptional Shakti Peetha status (Kamalambika)
         #201 Madurai      — the FINGERNAIL (kai viral) of Devi Sati
         #237 Kanchipuram  — ADJACENT: Kamakshi Ambal, one of the most
                             important Peetams in India, is a SEPARATE great
                             temple in the same town, not inside #237.
         #273 Kathmandu    — ADJACENT: GUHYESHWARI, a Peetam in its own
                             right, stands a short way UPSTREAM on the same
                             Bagmati and is worshipped with Pashupatinath.
       #237 and #273 are included on the same "worshipped together / same
       town" principle that governs CANON.divya_desam, and the adjacency is
       disclosed in each temple's cross_tradition text in pps_v3_patch.js. */
    shakti_peetam:    [44, 72, 97, 130, 163, 168, 175, 198, 199, 201, 237,
                       262, 263, 272, 273],
    /* Kaumara (Murugan) pilgrimage nodes — temples where Murugan/Skanda is a
       primary cross-tradition thread (Vel/Singaravelar/Amrita Subrahmanyar/
       Arupadai). Retrofit pass 2B.22-K. Distinct from the detail-panel
       'kaumara' cross_tradition tag (which may appear on more temples, e.g.
       #201 Madurai, that are NOT Murugan pilgrimage nodes themselves). */
    /* #218 Rajendrapattinam added by owner ruling (2B.29): Muruga, born as
       the mute child RUDRASARMA for casting the Vedic scriptures into the
       sea, did penance here and was freed - whence the town's other name
       KUMARESAPATTINAM. It therefore carries three sets: nava_puliyur,
       nayanmar_birthplace_63 and kaumara. */
    /* #236 Thiruvamathur added by owner ruling (2B.32): the FIRST KAUMARA
       MADAM was established at this place, and the Kaumara acharya
       Vannacharabam Dandapani Swamigal lived here; Arunagirinathar sang
       the Thiruppugazh on the shrine and a separate Subrahmanya sannidhi
       stands in the second prakaram. NOTE: the "Vel before Surapadma"
       wording carried in the 2B.30/2B.31 flags could NOT be corroborated
       at #236 - that Vel tradition belongs to #244 Thiruverkadu, which is
       flagged separately and NOT added here. */
    kaumara:          [80, 111, 117, 169, 176, 178, 180, 182, 203, 209, 218,
                       236],
    /* NAVA PULIYUR - the Puliyur ("tiger-town") shrines of the tiger-footed
       sage VYAGHRAPADA, headed by Chidambaram. Tradition names nine; SIX are
       Paadal Petra Sthalams and present in this corpus. #218 Rajendrapattinam
       = Erukkathampuliyur (its Lord is called both Neelakandeswarar and
       Swetharanyeswarar, which is why it does not match by name alone). */
    /* 2C.2: the set is now COMPLETE at nine. #281 Sirupuliyur, #282
       Atthippuliyur and #283 Thaplampuliyur are DISCLOSED NON-PPS
       set-completers (sno > 276), added under the same policy already used
       for Navagraha (277-279) and Atta Veerattanam (280). None of the three
       is a Paadal Petra Sthalam; each carries an explicit pps_status
       disclosure in English and Tamil. */
    nava_puliyur:     [3, 7, 8, 29, 218, 225, 281, 282, 283],

    /* PANCHA ISHWARAM — the five ancient coastal Shiva kovils ringing Sri
       Lanka. NEW SET (2C.2, owner ruling). Only TWO are Paadal Petra
       Sthalams: #192 Koneswaram (east) and #193 Ketheeswaram (north-west).
       #284 Naguleswaram (north), #285 Munneswaram (west) and #286
       Tondeswaram (south) are DISCLOSED NON-PPS set-completers. Dr Paul E.
       Pieris, Royal Asiatic Society 1917: "Long before the arrival of
       Vijaya there was in Lanka five recognised Ishwarams of Shiva which
       claimed and received adoration of all India." */
    pancha_ishwaram:  [192, 193, 284, 285, 286],
    /* PANCHA ARANYA KSHETRAM - the five "forest" shrines near Kumbakonam,
       traditionally worshipped in ONE day in this order: Thirukarukavur
       (Mullai) -> Avalivanallur (Paadhiri) -> Aritthuvaramangalam (Vanni)
       -> Alangudi (Poolai) -> Thirukollampudur (Vilva, at arthajama).
       The separate COASTAL Pancha Aranya is described in temple text but
       deliberately NOT merged here, to keep one verifiable circuit. */
    pancha_aranya:    [71, 98, 126, 140, 155],
    /* KASHI-EQUIVALENT - the canonical SIX Kaveri shrines held equal to Kasi,
       each the centre of its town as Visvanatha is of Kasi. Avinashi (#208),
       Bhavani (#210) and Vriddhachalam (#222) carry their own looser
       "Dakshina Kasi" epithets, noted in their temple text, but are not part
       of this named six-shrine circuit. */
    /* Owner ruling (2B.28): #204 Thiruvedagam added. The Vaigai runs SOUTH
       TO NORTH at that point and sources hold one day of worship there equal
       to a lifetime at Varanasi, so it joins the six canonical Kaveri
       shrines - making this a seven-member set. */
    kashi_equivalent: [27, 42, 44, 97, 154, 181, 204],
    /* NAYANMAR BIRTHPLACES - avatara sthalams of the 63 Nayanmars that are
       themselves Paadal Petra Sthalams, including the qualifying Naalvar
       birthplaces #47 Sirkazhi (Sambandar) and #228 Thirunavalur (Sundarar).
       Appar's Tiruvamur and Manickavasakar's Thiruvathavur are NOT Paadal
       Petra Sthalams and so cannot appear. This set GROWS with enrichment;
       it is a partial list by nature, not a closed circuit. */
    /* #244 Thiruverkadu added in 2B.32: avatara sthalam of MURKHA NAYANAR,
       whose guru puja falls on the Moolam nakshatram in Karthigai. Added
       under the standing "this set GROWS with enrichment" policy above. */
    nayanmar_birthplace_63: [9, 16, 43, 47, 53, 81, 96, 108, 112, 150, 153,
                       162, 164, 168, 173, 190, 218, 221, 228, 244, 252,
                       253, 258, 262],
    /* DIVYA DESAM NEARBY - Paadal Petra Sthalams where one of the 108 Vishnu
       Divya Desams stands in the SAME TOWN or an immediately adjacent one,
       so both may be worshipped in a single visit. Two of these are unique
       in all India: the Divya Desam lies INSIDE the Shiva temple complex -
       #3 Chidambaram (Thiruchitrakoodam / Govindaraja) and #237 Kanchipuram
       Ekambareswarar (Nilathingal Thundam Perumal).
       Same town: 3, 9, 31, 47, 72, 76, 77, 82, 89, 105, 151, 168, 171, 181,
       186, 201, 230, 237, 238, 240, 241.
       Adjacent town: 27 (Thirukkandiyur), 34 (Srirangam),
       221 (Thiruvahindrapuram). */
    /* 2C.2: #81 Keelapalayam added — the 108 Divya Desam of Thirunandipura
       Vinnagaram stands in the same ancient Pazhayarai city, meeting this
       set's own same-town test. */
    divya_desam:      [3, 9, 27, 31, 34, 47, 72, 76, 77, 80, 81, 82, 89, 105,
                       151, 168, 171, 181, 186, 201, 221, 230, 237, 238, 240,
                       241],
    /* Kochengat Chola Maadakkoils present in the PPS corpus (29 mapped).
       #34 is the first Maadakkoil (Thiruvanaikka); #142 Ambal the last of
       the 60. Verified by town+deity vs the Shaivam.org / Aravind S /
       FamousFix Maadakkoil catalogues. #91 Nallur resolved (dual name).
       The traditional set is 70 (Thirumangai) / 78 (Appar), of which ~31
       are Paadal Petra Sthalams; remaining candidates still TBD. */
    /* 2C.2: four added on explicit textual evidence — #149 Thirumiyachur,
       #158 Kovilvenni, #179 Thirukkuvalai and #180 Valivalam each state in
       their enrichment that they are counted among the SEVENTY MAADAKKOILS
       of Kochengat Cholan. Now 33 mapped. */
    /* 2C.4: #30 THIRUKKANUR added by OWNER RULING. The tradition recorded by
       the owner is that Thirukkanur was ORIGINALLY a Maada Koil -- one of the
       Kochengat Chola raised-platform temples, built high with narrow
       entrances so an elephant could not enter -- but that it was later
       REBUILT BY THE CHOLA KING PARANTAKA I WITHOUT THE ELEVATED PLATFORM
       STRUCTURE, so the Maadakkoil form is no longer visible on the ground.
       DISCLOSURE: this project could NOT corroborate the Parantaka I
       rebuilding or the loss of the platform in the published sources
       consulted (Wikipedia, shivatemples.com, lightuptemples, Grokipedia,
       Dinamalar), which state only that the temple was founded by the Pandyas
       and renovated by the Cholas, naming no ruler. The membership is carried
       on the owner's authority; the caveat is recorded in the temple's own
       data_notes and cross_tradition text in pps_v3_patch.js so a reader of
       the site sees it too. Because reconcileCategories() strips every
       colored slug from the base records and re-stamps only CANON, the tag
       had to be added HERE as well as on the record, or it would be wiped on
       load. Maada Koil now 34 mapped.
       NOTE the set remains OPEN-ENDED: the traditional count is 70
       (Thirumangai) / 78 (Appar), of which roughly 31 are Paadal Petra
       Sthalams, so this list is expected to keep growing. Two further
       text-claim candidates surfaced by the 2B.40 audit -- #31 Anbil and
       #260 Poondi -- are NOT added here, pending an owner ruling. */
    maada_koil:       [15, 17, 30, 34, 42, 47, 52, 60, 63, 81, 89, 90, 91, 92,
                       149, 158, 179, 180,
                       105, 111, 117, 118, 120, 132, 142, 145, 171, 172,
                       173, 176, 182, 183, 187, 216]
  };

  /* Dual-name / alias resolutions applied to window.TEMPLES (display). */
  var NAME_FIXES = {
    91:  'Panchavarneeswarar / Kalyanasundareswarar', /* Nallur Maadakkoil */
    /* #260 Poondi corrected by owner ruling. The base record read
       "Oontheeswarar", which is not the attested form. The Lord is
       OONDRESWARAR, from OONDRU-KOL - the walking STICK Shiva gave the
       blinded Sundarar at Thiruvenpakkam after he broke his word to
       Sangili Nachiyar. Also given as Aadharadhandeswarar. */
    260: 'Oondreswarar'
  };

  /* Tamil display-name corrections. The base NAME_TA_MORE map in
     pps_v3_patch.js transliterated the INCORRECT English for #260 and so
     was itself wrong (it read ஊந்தீஸ்வரர்). The correct Tamil is ஊன்றீஸ்வரர்,
     from ஊன்றுகோல். Applied here so 2C.1 is self-contained for display
     names; pps_v3_patch.js also carries the same value and rebuilds the
     Wikipedia search URLs. Both are idempotent. */
  var NAME_TA_FIXES = {
    260: 'ஊன்றீஸ்வரர்'
  };

  /* ----------------------------------------------------------------
     PANCHA ISHWARAM - PREPARED BUT NOT ENABLED. The owner asked whether
     all five are Paadal Petra Sthalams. They are NOT: only TWO of the
     five are in the Tevaram canon.
         Naguleswaram   (Keerimalai, Jaffna)   - NOT a PPS
         Koneswaram     (Trincomalee)          - PPS #192
         Tondeswaram    (Matara, south)        - NOT a PPS
         Munneswaram    (Chilaw, west)         - NOT a PPS
         Ketheeswaram   (Mannar)               - PPS #193
     shivatemples.com gives the regional count plainly: "Sri Lanka
     (Eezha Naadu) - 2".
     Two ways to proceed, neither applied here:
       OPTION A - two-member set. Uncomment the CANON line below and add
         'pancha_ishwaram' to PRECEDENCE, CAT_META and ICONS. Honest, but
         a "Pancha" (five) set showing only two members reads oddly.
       OPTION B - full five, using the established disclosed non-PPS
         set-completer policy already used for Navagraha (277-279) and
         Atta Veerattanam (280). Needs three new records at snos 281-283
         injected into window.TEMPLES with explicit non-PPS disclosure in
         English and Tamil. Say the word and that block will be built.
     ---------------------------------------------------------------- */
  /* CANON.pancha_ishwaram = [192, 193]; */

  /* Colored sets, ordered = FILL precedence (highest first). D.
     maada_koil is placed LAST so temples already in a deity/element
     set keep that fill (and gain a gold ring), while purely-Maadakkoil
     temples light up in the Maada Koil color instead of slate. */
  var PRECEDENCE = [
    'pancha_bhoota', 'pancha_sabhai', 'atta_veerattanam',
    'sapta_vidanga', 'saptha_sthana', 'navagraha', 'shakti_peetam',
    'kaumara', 'nava_puliyur', 'pancha_ishwaram', 'pancha_aranya', 'kashi_equivalent',
    'divya_desam', 'nayanmar_birthplace_63', 'maada_koil'
  ];

  var CAT_META = {
    pancha_bhoota:    { label: 'Pancha Bhoota',    color: '#C0392B' },
    pancha_sabhai:    { label: 'Pancha Sabhai',    color: '#8E44AD' },
    navagraha:        { label: 'Navagraha',        color: '#2980B9' },
    atta_veerattanam: { label: 'Atta Veerattanam', color: '#D35400' },
    sapta_vidanga:    { label: 'Sapta Vidanga',    color: '#16A085' },
    saptha_sthana:    { label: 'Saptha Sthana',    color: '#F39C12' },
    shakti_peetam:    { label: 'Shakti Peetam',    color: '#C2185B' },
    kaumara:          { label: 'Kaumara (Murugan)', color: '#2E7D32' },
    nava_puliyur:     { label: 'Nava Puliyur',     color: '#37474F' },
    pancha_ishwaram:  { label: 'Pancha Ishwaram', color: '#00695C' },
    pancha_aranya:    { label: 'Pancha Aranya',    color: '#558B2F' },
    kashi_equivalent: { label: 'Kashi Equivalent', color: '#00838F' },
    divya_desam:      { label: 'Divya Desam Nearby', color: '#AD1457' },
    nayanmar_birthplace_63: { label: 'Nayanmar Birthplace', color: '#303F9F' },
    maada_koil:       { label: 'Maada Koil',       color: '#6D4C41' }
  };
  /* ---- Category icons (Session 2C.2) -------------------------------
     Eight sets use emoji; PANCHA SABHAI uses the project's own Nataraja
     artwork, embedded here as a 48px transparent PNG data-URI (displayed
     at ~19px, so 2.4x for retina). Embedding avoids any extra repo asset
     or 404 risk. To change an icon, edit the ICONS map below only.       */
  var NATARAJA_IMG = 'data:image/png;base64,'
    + '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';

  /* Divya Desam pill icon: the Sri Vaishnava THIRUMAN (Urdhva Pundra),
     rendered as a dark circular badge because the namam is white and the
     pills are white - a plain cutout would be invisible. 48px for retina. */
  var DIVYADESAM_IMG = 'data:image/png;base64,'
    + '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'
    + '/XWb/wOgBJZ2oAxHZAAAAABJRU5ErkJggg==';

  var ICONS = {
    pancha_bhoota:    '\uD83D\uDD25',           /* fire \u2014 the five elements    */
    pancha_sabhai:    '@img',                    /* Nataraja \u2014 five dance halls */
    navagraha:        '\uD83E\uDE90',           /* planet \u2014 the nine grahas    */
    atta_veerattanam: '\u2694\uFE0F',           /* swords \u2014 eight destructions */
    sapta_vidanga:    '\uD83E\uDE98',           /* drum \u2014 the seven natanams   */
    saptha_sthana:    '\uD83D\uDC02',           /* bull \u2014 Nandi's wedding set  */
    shakti_peetam:    '\uD83C\uDF3A',           /* hibiscus \u2014 matches Shakta   */
    kaumara:          '\uD83E\uDD9A',           /* peacock \u2014 Murugan's vahana  */
    nava_puliyur:     '\uD83D\uDC05',           /* tiger \u2014 Vyaghrapada's feet  */
    pancha_ishwaram:  '\uD83D\uDC1A',           /* conch \u2014 the island's coast */
    pancha_aranya:    '\uD83C\uDF33',           /* tree \u2014 the five groves      */
    kashi_equivalent: '\uD83D\uDED5',           /* gopuram \u2014 Kasi of the South */
    divya_desam:      '@dd',                     /* Thiruman \u2014 Sri Vaishnava    */
    nayanmar_birthplace_63: '\uD83D\uDE4F',     /* folded hands \u2014 the 63 saints*/
    maada_koil:       '\uD83D\uDC18'            /* elephant \u2014 raised sanctum   */
  };


  /* Render an icon as inline HTML (emoji wrapped in a span, image as <img>). */
  /* ---- Per-icon OPTICAL nudge (Session 2C.2c) ----------------------
     The icons are already geometrically centred (measured: the Nataraja
     asset is a 50.0%/50.0% top-bottom ink split, and every icon sits in
     an identical 18px flex box). Two still READ high, for two different
     reasons:
       • pancha_bhoota  — the flame emoji's ink is drawn tapering upward,
         so its visual mass sits above the glyph-box centre.
       • pancha_sabhai  — the Nataraja is full-bleed at 18px while emoji
         render ~15px of ink with ~1.5px of slack, so it is optically
         larger/heavier and any tiny offset shows.
     Optical centring cannot be solved by CSS centring, so these get a
     deliberate offset. Positive = move DOWN. Tune values HERE only;
     `transform` is purely visual (no reflow, no layout risk).           */
  var ICON_NUDGE = {
    pancha_bhoota: 1.5,
    pancha_sabhai: 1.5
  };

  function iconHtml(slug) {
    var ic = ICONS[slug];
    if (!ic) return '';
    var n = ICON_NUDGE[slug];
    var nudge = n ? ' style="transform:translateY(' + n + 'px)"' : '';
    if (ic === '@img') {
      return '<img class="pps-cat-ico-img" src="' + NATARAJA_IMG +
             '" alt="" aria-hidden="true"' + nudge + '>';
    }
    if (ic === '@dd') {
      return '<img class="pps-cat-ico-img" src="' + DIVYADESAM_IMG +
             '" alt="" aria-hidden="true"' + nudge + '>';
    }
    return '<span class="pps-cat-ico"' + nudge + '>' + ic + '</span>';
  }

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
    /* Apply dual-name / alias fixes (e.g. #91 both names, #260 Oondreswarar). */
    Object.keys(NAME_FIXES).forEach(function (k) {
      var t = bySno(parseInt(k, 10));
      if (t && t.name !== NAME_FIXES[k]) { t.name = NAME_FIXES[k]; }
    });

    /* Apply Tamil display-name fixes (#260). */
    Object.keys(NAME_TA_FIXES).forEach(function (k) {
      var t = bySno(parseInt(k, 10));
      if (t && t.name_ta !== NAME_TA_FIXES[k]) { t.name_ta = NAME_TA_FIXES[k]; }
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
      /* category pill row — Session 2C.2b ALIGNMENT FIX.
         Previously the pills were inline-level boxes inside a plain <span>,
         so they aligned on the BASELINE. An <img>'s baseline is its bottom
         edge (and a 1.42em emoji's baseline differs again), which pushed
         Pancha Sabhai / Pancha Bhoota out of line. Making the wrapper a
         flex container aligns every pill by its CENTRE instead. Icons are
         also normalised to one 18px box so all pills are the same height. */
      + '#pps-cat-pills{display:flex;flex-wrap:wrap;gap:8px;align-items:center}'
      + '#pps-cat-pills .pill{transition:all .15s;display:inline-flex;align-items:center;'
      + 'line-height:18px;vertical-align:middle}'
      + '.pps-cat-count{margin-left:5px;opacity:.7;font-weight:400}'
      /* category icons (Session 2C.2) — identical 18px box for emoji + image */
      + '.pps-cat-ico{display:inline-flex;align-items:center;justify-content:center;'
      + 'width:18px;height:18px;margin-right:5px;font-size:15px;line-height:1;flex:0 0 auto;'
      + 'font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif}'
      + '.pps-cat-ico-img{width:18px;height:18px;margin-right:5px;flex:0 0 auto;'
      + 'display:block;object-fit:contain}'
      /* legend */
      + '.pps-legend-row{align-items:center}'
      + '.pps-legend-row .pps-cat-ico{width:15px;height:15px;font-size:12.5px;margin-right:4px}'
      + '.pps-legend-row .pps-cat-ico-img{width:15px;height:15px;margin-right:4px}'
      /* marker tooltip set-icons */
      + '.pps-tip-sets{display:inline-flex;align-items:center;gap:2px;margin-top:3px}'
      + '.pps-tip-sets .pps-cat-ico{width:15px;height:15px;font-size:12.5px;margin-right:0}'
      + '.pps-tip-sets .pps-cat-ico-img{width:15px;height:15px;margin-right:0}'
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
      /* 2C.5 REVERT of the 2C.2 "fix". These pills are the EPIGRAPHY
         control ("Tiers of Epigraphy / கல்வெட்டு" in index.html): T1 is
         "Extensively documented in SII/ASI/ARE", T4 is "Outside TN
         epigraphy corpus". They must therefore filter on t.tier, the
         epigraphic field. 2C.2 filtered on content_tier -- editorial
         content depth -- which is a different axis that merely reuses the
         labels T1/T2/T3. Two consequences, both now fixed: the base
         site's own passes() filters the sidebar CARDS on t.tier, so the
         list and the map disagreed on the 55 temples where the fields
         diverge; and content_tier has no T4 bucket, so "Outside TN"
         counted 0 while seven temples genuinely sit outside the corpus.
         NOTE isAdd stays exempt: the ten disclosed set-completers
         (#277-286) carry marker tiers NAV/VAI/PUL/ISH, which are not
         epigraphy tiers, so they are never hidden by this control. */
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
      var setIcons = colorCatsOf(t).map(function (c) {
        return '<span title="' + CAT_META[c].label + '">' + iconHtml(c) + '</span>';
      }).join('');
      marker.bindTooltip('<b>#' + t.sno + '</b> ' + (t.name || '') +
        '<br><small>' + (t.town || '') + ', ' + (t.district || '') + '</small>' +
        (setIcons ? '<br><span class="pps-tip-sets">' + setIcons + '</span>' : ''),
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
      p.innerHTML = iconHtml(slug) + meta.label + '<span class="pps-cat-count">(' + memberCount(slug) + ')</span>';
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
        + CAT_META[slug].color + '"></span>' + iconHtml(slug) + CAT_META[slug].label + '</div>';
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
  /* ---------------------------------------------------------------- */
  /* 2C.5 — EPIGRAPHY TIER PILLS: LIVE COUNTS, NO ANCHOR PILL          */
  /* ---------------------------------------------------------------- */
  /* These four pills are the EPIGRAPHY control. They are rebuilt from  */
  /* t.tier so the counts are self-maintaining if an epigraphic tier is */
  /* ever corrected in the data -- but they now report the epigraphic   */
  /* field, not editorial content depth, so they read 70 / 197 / 2 / 7. */
  /*                                                                   */
  /* The ANCHOR pill added by 2C.2 is REMOVED, and removed defensively  */
  /* if a previously-loaded copy of that session already injected it.   */
  /* It never worked: index.html binds its tier-pill click handlers at  */
  /* parse time, long before this file runs, so the injected span had   */
  /* no onclick; Reset rebuilt state.tiers as {T1,T2,T3,T4} without it; */
  /* and the 1-4 keyboard shortcuts only ever mapped T1-T4. Removing it */
  /* therefore also re-aligns Reset and the keyboard with what is on    */
  /* screen. Idempotent: safe to run repeatedly.                       */
  function buildTierPills() {
    try {
      var existing = document.querySelectorAll('.pill[data-tier]');
      if (!existing || !existing.length) return;

      /* 1. Remove the inert anchor pill if present (from 2C.2 or a
            stale cached copy of this file). */
      var stale = document.querySelectorAll('.pill[data-tier="anchor"]');
      var removed = 0;
      stale.forEach(function (p) {
        if (p.parentNode) { p.parentNode.removeChild(p); removed++; }
      });

      /* 2. Count by the EPIGRAPHIC tier. Set-completers (#277-286) carry
            marker tiers NAV/VAI/PUL/ISH and are excluded from the counts,
            exactly as they are exempt from the filter itself. */
      var counts = {};
      window.TEMPLES.forEach(function (t) {
        if (t.sno > 276) return;
        var k = t.tier;
        if (k) counts[k] = (counts[k] || 0) + 1;
      });

      /* 3. Rewrite the four labels, preserving index.html's wording. */
      var LBL = { T1: '\u2605 Tier 1', T2: 'Tier 2', T3: 'Not Catalogued', T4: 'Outside TN' };
      document.querySelectorAll('.pill[data-tier]').forEach(function (p) {
        var k = p.getAttribute('data-tier');
        if (LBL[k]) p.innerHTML = LBL[k] + ' (' + (counts[k] || 0) + ')';
      });

      console.log('[Session 2C.5] Epigraphy tier pills rebuilt from t.tier: ' +
        ['T1', 'T2', 'T3', 'T4'].map(function (k) { return k + '=' + (counts[k] || 0); }).join(', ') +
        (removed ? '. Removed ' + removed + ' inert Anchor pill(s) left by 2C.2.' : '.'));
    } catch (e) {
      console.warn('[Session 2C.5] buildTierPills skipped:', e && e.message);
    }
  }

  function init() {
    if (!window.leafletMap || !window.TEMPLES || !window.TEMPLES.length ||
        typeof L === 'undefined') {
      setTimeout(init, 150); return;
    }
    reconcileCategories();
    injectCss();
    buildTierPills();
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
