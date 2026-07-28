# Paadal Petra Sthalams — Interactive Atlas

An interactive, bilingual (English / தமிழ்) map and reference for the **276 Paadal Petra Sthalams** — the Shiva temples sung in the *Thevaram* and *Thiruvasakam* by the four Saiva saints (the **Naalvar**) and the wider body of the **63 Nayanmars**, canonised in the twelve-book *Thirumurai*.

The site is a **pilgrimage-planning tool**, not just an encyclopedia. Every temple carries a verified location, a bilingual *sthala purana*, its goddess, tank, sacred tree, festivals, saint associations and cross-tradition links — and can be filtered by devotional theme so a visitor can plan a real journey.

> **Status:** Content and data phases complete. 276 temples enriched, 9 closed pilgrimage sets verified complete, 4 saint journeys mapped.

---

## Table of Contents

- [What the site does](#what-the-site-does)
- [Corpus at a glance](#corpus-at-a-glance)
- [Repository files](#repository-files)
- [Installation](#installation)
- [Data model](#data-model)
- [Content tiers](#content-tiers)
- [Pilgrimage sets and filters](#pilgrimage-sets-and-filters)
- [The Naalvar Journeys feature](#the-naalvar-journeys-feature)
- [Non-PPS records and disclosure policy](#non-pps-records-and-disclosure-policy)
- [Known unknowns and source conflicts](#known-unknowns-and-source-conflicts)
- [Change history — Phase 1 to Phase 2C](#change-history--phase-1-to-phase-2c)
- [Verification methodology](#verification-methodology)
- [Editing the corpus](#editing-the-corpus)
- [Open items](#open-items)
- [Sources](#sources)
- [Credits and licence](#credits-and-licence)

---

## What the site does

| Capability | Detail |
|---|---|
| **Interactive map** | Leaflet map of all 276 temples with numbered markers, clustering with disambiguation, and click-synchronised sidebar, popup and detail panel |
| **Bilingual throughout** | Every temple name, town, goddess, tank, sacred tree, festival list and *sthala purana* exists in both English and Tamil; a single toggle switches the whole UI |
| **Thematic filtering** | 15 category pills (Pancha Bhoota, Pancha Sabhai, Atta Veerattanam, Navagraha, Shakti Peetam, Maada Koil, Kaumara, Divya Desam nearby, and more) plus 4 content-tier pills and regional filters |
| **Deep temple records** | Bilingual *sthala purana*, presiding goddess, *pushkarini*, *sthala vriksha* with botanical name, festival calendar, temple size, Naalvar attestation, Nayanmar associations, cross-tradition entries |
| **Naalvar Journeys** | Animated route tracing for each of the four saints across 72 verified stops, with the episode narrated at each stop |
| **Navigation out** | Per-temple Apple Maps / Google Maps / OpenStreetMap links, copy-coordinates button, and English + Tamil Wikipedia links |
| **Tevaram audio** | Curated audio links for temples where a recording of the relevant *pathigam* is available |
| **Visitor feedback** | Floating bilingual comment widget that captures which temple the visitor is viewing and emails it to the maintainer |

---

## Corpus at a glance

**276** canonical Paadal Petra Sthalams · **286** total records (10 disclosed non-PPS additions) · **39** districts

### Regional distribution (traditional divisions)

| Region | Temples |
|---|---:|
| Chola Nadu — South of the Kaveri | 128 |
| Chola Nadu — North of the Kaveri | 63 |
| Thondai Nadu | 33 |
| Nadu Nadu | 22 |
| Pandya Nadu | 14 |
| Kongu Nadu | 7 |
| Vada Nadu | 5 |
| Eezha Nadu | 2 |
| Tuluva Nadu | 1 |
| Malai Nadu | 1 |
| **Total** | **276** |

Densest districts: **Thanjavur 55**, **Thiruvarur 54**, **Nagapattinam 49**, Cuddalore 19, Villupuram 12.

### Content volume

| Measure | Value |
|---|---:|
| *Sthala purana* prose — English | 608,482 characters |
| *Sthala purana* prose — Tamil | 483,168 characters |
| **Combined narrative content** | **~1.09 million characters** |
| Nayanmar association records | 368 |
| Cross-tradition entries | 572 |
| Festival entries | 1,388 |
| Coordinates field-verified | 269 / 286 |

### Naalvar attestation

| Saint | *Thirumurai* books | Temples attested |
|---|---|---:|
| Sambandar | 1–3 | 232 |
| Appar (Thirunavukkarasar) | 4–6 | 173 |
| Sundarar | 7 | 106 |
| Manickavasakar | 8 | 11 |

---

## Repository files

```
index.html               (146 KB)  Base app: map, sidebar, base TEMPLES array (276), core render()
pps_v3_patch.js          (4.7 MB)  Main data + content patch. All enrichment, coordinates,
                                   names, tiers, sessions 0N through 2C.4. Load FIRST.
pps_v3_patch_2c1.js       (68 KB)  Category/marker/pill UI layer. CANON set membership,
                                   colours, icons, clustering, click sync. Load SECOND.
pps_feedback.js           (18 KB)  Visitor comment widget (Formspree + mailto fallback).
naalvar_journeys.js       (30 KB)  Saint-journey routing, panel and animation.
README.md                           This file.
```

**Load order matters.** `pps_v3_patch_2c1.js` re-stamps category membership from its own `CANON` table and must run after the main patch. `naalvar_journeys.js` waits for `window.TEMPLES`, `window.L` and `window.leafletMap` before building.

---

## Installation

Static site — no build step, no dependencies beyond Leaflet (loaded by `index.html`).

```html
<!-- inside index.html, after the main <script> block -->
<script src="pps_v3_patch.js"></script>
<script src="pps_v3_patch_2c1.js"></script>
<script src="pps_feedback.js"></script>
<script src="naalvar_journeys.js"></script>
```

Deploy by copying the five files to any static host (GitHub Pages, Netlify, S3).

> **Filename accuracy matters.** A mismatch between the tag and the actual filename fails silently — the journeys panel simply never appears. If a feature does not show, check the Network tab for a 404 first.

### Configuring feedback

In `pps_feedback.js`:

```js
var OWNER_EMAIL       = 'webmasterppsdd@gmail.com';
var FEEDBACK_ENDPOINT = 'https://formspree.io/f/mpqvkwrw';  // blank => mailto fallback
```

With an endpoint set, comments POST silently by AJAX. With it blank, the widget opens the visitor's mail client. Spam protection is a hidden `_gotcha` honeypot plus a minimum-length check.

---

## Data model

Two parallel structures, joined on `sno`:

**`window.TEMPLES`** — array of 286 base records driving the map:

```js
{ sno, name, name_ta, town, town_ta, district, region,
  lat, lng, coords_verified, coords_source,
  saints, categories[], content_tier, tier,
  wiki, wiki_en, wiki_ta, audio }
```

**`window.TEMPLE_ENRICHMENT`** — object keyed by `sno`, holding the deep content. This is the **canonical anchor schema** (established in Session 1C.6 at Thiruvarur):

```js
{
  content_tier, categories[], coords_verified,
  sthala_purana_en, sthala_purana_ta,
  goddess_en, goddess_ta,
  pushkarini_en, pushkarini_ta,
  sthala_vriksha: { common_name_en, common_name_ta, scientific_name,
                    description_en, description_ta,
                    significance_en, significance_ta },
  size_acres,
  festivals_en[], festivals_ta[],
  town_ta,
  naalvar_present[],              // ['sambandar','appar','sundarar','manickavasakar']
  nayanmar_associations[],        // { nayanmar, role, brief_en/ta, story_en/ta }
  cross_tradition_en[], cross_tradition_ta[],   // { tradition, story }
  data_notes[]                   // audit trail: conflicts, rulings, self-corrections
}
```

**Do not introduce non-schema fields.** Earlier drafts experimented with `sthala_vriksham`, `epigraphy_note`, `alternate_names`, `theertham`, `vimana`, `facing` and others; these were folded into `sthala_purana` or `cross_tradition` and must stay there. All 14 core fields are populated for all 276 temples — **zero gaps**.

### `naalvar_present` is the attestation authority

This array is the single source of truth for which saint sang at which temple. The Naalvar Journeys feature validates every route stop against it, and that check has caught real errors (see [Change history](#change-history--phase-1-to-phase-2c)).

---

## Content tiers

| Tier | Count | Treatment |
|---|---:|---|
| **anchor** | 19 | Multi-thousand-character bilingual *purana*, 5 Nayanmar associations, 5 cross-tradition entries, full festival calendar, `size_acres` |
| **T1** | 81 | Substantial bilingual *purana* with pilgrimage significance, associations and cross-tradition links |
| **T2** | 175 | Solid bilingual *purana* with goddess, tank, tree, festivals and attestation |
| **T3** | 1 | Minimal — a site with almost no surviving documentation |

### The 19 anchor temples

| # | Temple | Why anchor |
|---|---|---|
| 3 | Chidambaram Nataraja | Akasha (Pancha Bhoota); Chit Sabhai |
| 27 | Thiruvaiyaru Aiyarappar | Appar's Kailash vision; Saptha Sthana |
| 34 | Thiruvanaikkaval Jambukeswarar | Appu/water (Pancha Bhoota); Shakti Peetam |
| 44 | Thiruvenkadu Swetharanyeswarar | Adi Chidambaram; Budha; Meykandar |
| 47 | Sirkazhi | Sambandar's birthplace |
| 49 | Vaitheeswaran Koil | The divine physician; Naadi Jyotisham |
| 130 | Thiruvarur Thyagarajar | Sapta Vidanga head; Sundarar's Thiruthondar Thogai |
| **163** | **Thirukkadaiyur Amritaghateswarar** | **Kala Samhara; Kala Peedam; longevity rites; Abirami Andhadhi** |
| 168 | Nagapattinam Kayarohanaswamy | Sapta Vidanga; coastal Chola centre |
| 198 | Kutralam | Chitra Sabhai |
| 199 | Tirunelveli | Tamra Sabhai |
| 201 | Madurai Meenakshi | Sambandar's Jain debate; Mantrini Peetam |
| 205 | Rameswaram | Sethu; Jyotirlinga tradition |
| 226 | Thiruvannamalai Arunachaleswarar | Agni (Pancha Bhoota); Arunai Peetam |
| 237 | Kanchipuram Ekambareswarar | Prithvi (Pancha Bhoota); Kamakshi |
| 249 | Sri Kalahasti | Vayu (Pancha Bhoota); Sambandar's northern limit |
| 258 | Thiruvalangadu | Urdhva Tandava; Kali Peedam |
| 275 | Kedarnath | Trans-regional Himalayan shrine |
| 276 | Mount Kailash | The corpus terminus |

---

## Pilgrimage sets and filters

Fifteen categories drive the filter pills. Membership lives in `CANON` inside `pps_v3_patch_2c1.js`.

### Closed sets — all verified complete ✅

| Set | Members | Meaning |
|---|---:|---|
| Pancha Bhoota | 5 / 5 | The five elements |
| Pancha Sabhai | 5 / 5 | The five dance halls |
| Sapta Vidanga | 7 / 7 | The seven Thyagaraja shrines |
| **Atta Veerattanam** | **8 / 8** | The eight acts of valour |
| Saptha Sthana | 7 / 7 | The Thiruvaiyaru seven |
| Navagraha | 9 / 9 | The nine planetary shrines |
| Nava Puliyur | 9 / 9 | The nine tiger-shrines |
| Pancha Ishwaram | 5 / 5 | The five Eezham Ishwarams |
| Pancha Aranya | 5 / 5 | The five forest shrines |

### Open-ended sets

| Set | Current | Note |
|---|---:|---|
| Maada Koil | 34 | Kochengat Chola raised-platform temples; tradition counts 70 (Thirumangai) or 78 (Appar), of which ~31 are PPS. Expected to grow. |
| Divya Desam nearby | 26 | Vaishnava shrines within a PPS complex or immediately adjacent |
| Nayanmar birthplace | 24 | Birthplaces among the 63 |
| Shakti Peetam | 15 | Of the 51; 18 lie in the Tamil country |
| Kaumara / Murugan | 12 | Murugan-significant shrines |
| Kashi-equivalent | 7 | Canonical Kaveri six plus Thiruvanchiyam |

---

## The Naalvar Journeys feature

`naalvar_journeys.js` traces each saint's pilgrimage as an animated route with a narrated popup at every stop.

| Saint | Dates shown | Stops | Route shape |
|---|---|---:|---|
| **Sambandar** | fl. 7th c. CE | 24 | Sirkazhi → Chola belt → Madurai (Jain debate) → deep south → Thondai arc → Kalahasti → Mylapore |
| **Appar** | c. 570–650 CE | 17 | Tiruvamur (birth) → Pataliputra monastery → Thiruvathigai conversion → Chola belt → Srisailam → Thiruvaiyaru vision → Thiruppugalur mukthi |
| **Sundarar** | fl. 8th c. CE | 17 | Thirunavalur (birth) → Thiruvennainallur "Pittha!" → Thiruvarur → blindness arc → Avinashi → Thiruvanchikulam → Kailash |
| **Manickavasakar** | 9th c. CE (disputed) | 14 | Thiruvathavur (birth) → Madurai → Thirupperunturai guru → Madurai → Chola shrines → Chidambaram |

**72 stops total**, every one validated against `naalvar_present`.

### Honesty features built into the panel

- **Confidence is not uniform.** Stop *sets* are well-grounded; the *ordering* between narrative anchors is partly editorial inference. Episodes the *Periya Puranam* narrates in sequence are strongest.
- **Manickavasakar is flagged as reconstructed.** He is not one of the 63 Nayanmars and does not appear in Sekkizhar's *Periya Puranam*; his route is inferred from temples his *Thiruvasakam* names.
- **Thirumurai ordering is explained.** The panel is ordered by *Thirumurai* volume, so centuries read out of sequence — a note states that **Appar was the older contemporary of Sambandar**.
- **Sambandar's moksha is deliberately not plotted.** He merged into the light at **Nallur Perumanam (Achalpuram, Mayiladuthurai)**, which is *not* among the 276. His route ends at #252 Mylapore marked "Last plotted stop," with the moksha place given as text. See the [#91 correction](#the-91-nallur-correction).
- **Non-PPS waypoints are dashed and sourced.** Three off-corpus points are plotted with their published coordinates and a visible source string.

---

## Non-PPS records and disclosure policy

**Policy:** any temple added only to complete a pilgrimage set, or to plot a biographical waypoint, **must be explicitly disclosed as non-PPS in both English and Tamil** on its own record. If it is a *Vaippu Sthalam* (sung in passing in the Thevaram rather than given a dedicated *pathigam*), that status must be stated.

### The 10 set-completing records (#277–#286)

| # | Temple | Added for |
|---|---|---|
| 277 | Suryanar Koil | Navagraha (Sun) |
| 278 | Thingalur | Navagraha (Moon) |
| 279 | Keezhaperumpallam | Navagraha (Ketu) |
| 280 | Vazhuvur | Atta Veerattanam (Gajasamhara) |
| 281 | Sirupuliyur Margabandeesvarar | Nava Puliyur |
| 282 | Atthippuliyur Chidambaresvarar | Nava Puliyur |
| 283 | Thaplampuliyur Vyagrapurisvarar | Nava Puliyur |
| 284 | Naguleswaram, Keerimalai | Pancha Ishwaram |
| 285 | Munneswaram, Chilaw | Pancha Ishwaram |
| 286 | Tondeswaram, Dondra Head | Pancha Ishwaram |

### The 3 journey waypoints (in `naalvar_journeys.js`, not in `TEMPLES`)

| Waypoint | For | Status |
|---|---|---|
| Thirupperunturai (Avudaiyarkoil) | Manickavasakar's guru-meeting | Non-PPS |
| Tiruvamur, Panruti | Appar's birthplace | *Thevara Vaippu Sthalam* |
| Thiruvathavur, Madurai | Manickavasakar's birthplace | *Thevara Vaippu Sthalam* |

---

## Known unknowns and source conflicts

Recorded in `data_notes` on the relevant records rather than silently resolved. **7 notes across 5 temples.**

| # | Issue | Resolution |
|---|---|---|
| **30** | Owner records Thirukkanur as **originally a Maada Koil, rebuilt by Parantaka I without the elevated platform**. Published sources say only "founded by the Pandyas, renovated by the Cholas" and name no ruler. | Tag carried on owner authority; **caveat visible in the temple's own cross-tradition text**, not just internal notes |
| **114** | Wikipedia places Thirukkarayil in **Nagapattinam**; Dinamalar, Bing Places and TN HR&CE (temple code TM014477) place it in **Thiruvarur** | Resolved to **Thiruvarur** by owner ruling |
| **156** | Corpus said Thiruvarur; several Atta-Veerattanam sources say Mayiladuthurai | Resolved to **Thiruvarur** by owner ruling |
| **163** | Four live conflicts: the verse at which Abirami appeared (**79th** in most sources, 72nd in one); Andhadhi length (100 + Kappu + Payan = 102, vs 101); **Serfoji I or Serfoji II**; which gopuram is tallest/principal | All four recorded in the notes; the text follows the majority reading and says so |
| **185** | Thirupariyalur was **missing from `CANON.atta_veerattanam`**, so the set showed 7 of 8 | Fixed; membership and set completeness restored |
| **274** | Indraneela Parvatham — a mountain Sambandar sang facing north but never visited; coordinates uncertain | Deferred as `UNCERTAIN`; excluded from coordinate campaigns |
| — | **#153 / #162** both named "Thiruppugalur," ~20 m apart | Owner ruled **#153 Vardhamaneeswarar is Appar's mukthi site**; #162 carries Sundarar's brick-to-gold miracle. Proximity flagged for a future ground check |

---

## Change history — Phase 1 to Phase 2C

### Phase 1 — the original v3 patch

The starting point was a single ~44 KB script layering these onto the base map:

- ~165 additional Tamil deity names (covering ~275 temples)
- Wikipedia URL overrides — English and 40 Tamil
- 19 cultural notes
- 26 curated Tevaram audio links
- UI translations and a language toggle
- A coordinates panel with Apple / OSM / Google Maps and copy buttons

> **Note on the attached file:** `README (1).md` in this repository is **not documentation** — it is the Phase-1 `pps_v3_patch.js` source saved with a `.md` extension (43,830 bytes, zero markdown). It is preserved here only as a Phase-1 baseline. **This `README.md` supersedes it.** Consider renaming the old file to `pps_v3_patch.phase1.js.bak` or deleting it.

The main patch has since grown from **43,830 bytes to 4,727,333 bytes — roughly 108×**.

### Phase 2 — the enrichment programme

Work ran as ~90 numbered, individually flagged sessions. Every session guards on a `SESSION_*_LOADED` flag so double-loading is harmless.

| Series | Sessions | Delivered |
|---|---|---|
| **0N, 1B.x** | 1B.1–1B.8 | Framework: card sorting, detail-panel delegation, search wiring, console-noise fix |
| **1C.x** | 1C.1–1C.12 | The first 10 anchor temples composed to the canonical schema |
| **1D.x** | 1D.1–1D.8 | Coordinate-refinement campaign — ~51 temples corrected from GPS and cross-checked |
| **2A.x** | 2A.1–2A.11 | Tier/category framework, subcategory design, anchor elevations, name fixes |
| **2B.x** | 2B.1–2B.40 | Region-by-region content enrichment across all 276, plus 4 owner-GPS coordinate passes |
| **2C.x** | 2C.1–2C.4 | Category UI layer, feedback widget, audit remediation, final rulings |
| **2N.1** | — | Naalvar Journeys rebuild |

#### 2B enrichment sweep — regional order

Chola North and South belts (the 191-temple core) → Pandya → Kongu → Nadu Nadu → Thondai Nadu → Kanchipuram cluster → Chennai–Chengalpattu arc → Palar–Cooum–Kosasthalaiyar arc → Pondicherry border → final consolidation.

#### Coordinate accuracy programme

Diagnostics in Session 0P.1 found **106 low-precision coordinates**: 6 whole-degree (Priority 1), ~30 single-decimal (~11 km ambiguity, Priority 2), ~70 two-decimal town-centroids (~1 km, Priority 3). Priorities 1 and 2 are complete. Four subsequent owner-GPS passes (2B.34FIX, 2B.39, 2B.40 and earlier batches) corrected dozens more from on-the-ground readings.

**Coordinates now field-verified: 269 / 286.**

Several owner readings corrected errors of multiple kilometres, independently confirmed against published sources:

| # | Temple | Move | Independent check |
|---|---|---|---|
| 224 | Thirumanikuzhi | 16.5 km | **19 m** from Wikipedia's published coordinate |
| 114 | Thirukkaravasal | 10.3 km | **9 m** from Wikipedia, **4 m** from Bing Places |
| 163 | Thirukkadaiyur | 8.5 km | 1.4 km from Wikipedia — the *old* value was 8.0 km off |
| 91 | Nallur | 19 km | **3 m** from Bing Places |

#### Category and set corrections

- **Atta Veerattanam restored to 8/8** — #185 Keelaparasalur (historically Thirupariyalur), the Daksha-Samhara shrine, was missing from `CANON` despite its own text declaring it one of the eight. It *is* a Paadal Petra Sthalam (Sambandar, 41st south of the Kaveri). This also corrected an earlier project note that had wrongly recorded Thirupariyalur as outside the 276.
- **Maada Koil 33 → 34** — #30 Thirukkanur added by owner ruling, with the non-corroboration caveat published on the record.
- **Navagraha, Nava Puliyur, Pancha Ishwaram completed** by adding disclosed non-PPS set-completers rather than leaving the sets visibly broken.

#### Naalvar Journeys — v1 → v3

The original feature carried three misattributions that the corpus's own `naalvar_present` data contradicted:

| Removed | From | Corpus attests |
|---|---|---|
| #72 Kumbakonam | Sambandar | appar, sundarar |
| #15 Thiruppanandal | Sundarar | sambandar, appar |
| #252 Mylapore | Sundarar | sambandar, appar |

Mylapore is the **Poompavai** miracle — Sambandar's — so #262 → #252 now sits in *his* route where it belongs.

Routes grew from **50 to 72 stops**: Sambandar gained his whole Thondai arc and Kalahasti; Appar gained the Pataliputra monastery and the Srisailam attempt; Sundarar gained the complete blindness arc, Avinashi and Kailash; Manickavasakar went from 2 stops to 14. Every stop now carries the actual episode rather than just a place name.

##### The #91 Nallur correction

Correcting #91's coordinate exposed an error in the journeys data — **mine**. The corrected position confirmed #91 is *Thirunallur* in **Thanjavur** (the five-colour lingam, Agastya's wedding darshan, Amaraneethi Nayanar), **not** *Nallur Perumanam* / Achalpuram in Mayiladuthurai where Sambandar died — **60 km apart**, routinely confused because both are called Thirunallur. The v2 file had used #91 as his moksha pin. Since Nallur Perumanam is not among the 276, his route now ends at #252 with the moksha place stated as text. **A truthful gap beats a false pin.**

#### Self-corrections logged

Beyond the journeys fix, two content errors this project introduced in Session 2B.4 were found and repaired during the final audit, both on **#30 Thirukkanur**:

1. Described as *"near Tiruchirapalli on the northern bank of the Kaveri"* — it is in **Thanjavur district near Thirukattupalli, on the Kollidam**.
2. The name *Karumbeswarar* was **guessed** to come from sugarcane offerings. The attested reason is concrete: the temple lay **buried under sand** (hence the village name **Manalmedu**, "sand mound") and was rediscovered when a lone sugarcane plant was found growing over it.

#### Final session — 2C.4

- **#163 Thirukkadaiyur elevated to anchor** (18 → 19 anchors) with 10,287 EN / 9,469 TA characters, 5 Nayanmar associations, 5 cross-tradition entries — exceeding the reference anchor's depth. District corrected Nagapattinam → Mayiladuthurai.
- **#114 and #156 districts** resolved to Thiruvarur, closing both flagged conflicts.
- **#30 tagged Maada Koil** with published caveat, plus the two self-corrections above.
- **#161** Aktheeswarar → **Agatheeswarar** (the town is *Agasthiyanpalli*; the Agastya root confirms it). **#173** Thanthondeeswarar → **Thanthondreeswarar** (from *thaan thondri*, "self-manifested"). Wikipedia search URLs rebuilt, since they derive from `t.name`.

### UI and UX programme

| Feature | Detail |
|---|---|
| Numbered map markers | With click-feedback animation |
| Clustering | With disambiguation for co-located temples |
| Category colours and icons | 15 sets, each with its own colour and emoji glyph |
| Tier pills | anchor / T1 / T2 / T3 |
| Click synchronisation | Marker ↔ sidebar card ↔ popup ↔ detail panel kept in sync |
| Dual-name display | For temples known by two names (e.g. #91 Panchavarneeswarar / Kalyanasundareswarar) |
| Feedback widget | Bilingual, context-capturing, Formspree + mailto fallback |
| Journeys panel | Minimisable, colour-coded per saint, with per-stop narration |

A Formspree validation bug was fixed in **2C.3b**: the widget had always sent `email: "(not given)"` when a visitor left the field blank, which is not a valid address, so Formspree returned HTTP 400 and **every submission silently failed**. The field is now sent only when it looks like a real address, and failures fall back to a working `mailto:` link rather than dead-ending.

---

## Verification methodology

Every data change in Phase 2 followed the same discipline:

1. **Load the real runtime.** Patches are applied in order against the actual base `TEMPLES` array — never against assumptions about what the data contains.
2. **Validate against the corpus's own attestation.** `naalvar_present` is authoritative; route stops and saint claims are checked against it programmatically.
3. **Cross-check large coordinate moves.** Any move beyond ~3 km is compared against Wikipedia, Bing Places, HR&CE or the temple's own site before acceptance.
4. **Verify set completeness numerically.** Closed sets are asserted against their canonical counts on every load.
5. **Record conflicts rather than resolve them silently.** Where sources genuinely disagree, both readings go into `data_notes` and, where a visitor would care, into the visible text.
6. **Log self-corrections explicitly.** Errors introduced by this project are named as such in the notes, with the session that introduced them.

---

## Editing the corpus

### Adding a coordinate

Coordinate fixes go in a numbered session appended to `pps_v3_patch.js` — they **patch `window.TEMPLES` at runtime** rather than rewriting the base array in `index.html`:

```js
var t = window.TEMPLES.find(function (x) { return x.sno === 163; });
t.lat = 11.074728631244678;
t.lng = 79.80580108932719;
t.coords_verified = true;
t.coords_source = 'Owner GPS, Session 2B.40. Confidence: HIGH.';
```

### Adding a category

Two places, both required:

1. The temple's `categories[]` in `pps_v3_patch.js`
2. **`CANON` in `pps_v3_patch_2c1.js`** — otherwise `reconcileCategories()` strips the slug on load, because it clears all coloured slugs and re-stamps only from `CANON`

### Rules to preserve

- **Never renumber.** `sno` is canonical and referenced everywhere.
- **Additions, not replacements.** New sessions append; they do not rewrite prior ones.
- **Stay in schema.** No new top-level enrichment fields.
- **Disclose non-PPS records** in both languages, every time.
- **Guard every session** with a `SESSION_*_LOADED` flag.

---

## Open items

| Item | Status |
|---|---|
| **#31 Anbil** and **#260 Poondi** | Both claim Maada Koil in their text but are not in `CANON`. Awaiting research and ruling. |
| Priority-3 coordinates | ~56 town-centroid records (~1 km ambiguity) remain unrefined — low impact, non-blocking. |
| #274 Indraneela Parvatham | Coordinates `UNCERTAIN`; a mountain sung from afar, never visited. |
| #153 / #162 separation | ~20 m apart; plausible for one town but worth a ground check. |
| Per-stop journey confidence badges | Proposed: mark which legs are *Periya Puranam*-narrated versus editorially inferred. |
| Maada Koil set growth | 34 of a traditional ~70–78 (≈31 PPS); expected to expand. |
| Sidebar search consolidation | Two search inputs (`#search`, `#search-main`) are mirrored; could be merged into one. |

---

## Sources

Primary textual tradition: the **Thirumurai** — *Thevaram* (Sambandar, Appar, Sundarar), *Thiruvasakam* and *Thirukkovaiyar* (Manickavasakar), and **Sekkizhar's *Periya Puranam*** for the lives of the 63 Nayanmars.

Reference and verification sources consulted throughout:

- Wikipedia (English and Tamil) — temple articles, *Ashta Veeratta Stalam*, saint biographies
- **shivatemples.com** — Paadal Petra Sthalam numbering by Kaveri bank and region
- **TN Temples Project** (tntemplesproject.in) — field documentation and photography
- **lightuptemples.com** and **Dinamalar** temple pages
- **tamilnadutemples.org** — Vaippu Sthalam documentation
- **TN HR&CE** (hrce.tn.gov.in) — administrative district and temple codes
- **aanmeegam.org** — 51 Shakti Peetham lists (English and Tamil)
- Individual temple official sites (e.g. thirucadaiyurtemple.org)
- Bing Places and Google Maps for coordinate cross-checks
- Owner GPS readings taken on site — treated as highest-confidence

Where these disagree, the disagreement is recorded rather than hidden. See [Known unknowns](#known-unknowns-and-source-conflicts).

---

## Credits and licence

Compiled and curated by the project owner, with research, content composition, data verification and engineering assistance from Microsoft Copilot.

Temple content draws on the public devotional and scholarly literature of Tamil Saivism. Sacred texts of the *Thirumurai* are in the public domain. Third-party reference sources are credited above and linked from individual temple records; content composed for this project paraphrases and synthesises rather than reproducing copyrighted text.

**Corrections are genuinely welcome.** Use the 💬 widget on the site — it captures which temple you were viewing and reaches the maintainer directly.

---

<div align="center">

**276 temples · 39 districts · ~1.09 million characters of bilingual content**
**19 anchor temples · 9 completed pilgrimage sets · 4 saint journeys · 72 mapped stops**

*திருச்சிற்றம்பலம்*

</div>
