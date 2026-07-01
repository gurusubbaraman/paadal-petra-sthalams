/**
 * NAALVAR_JOURNEYS
 * ================================================================
 * Traditional pilgrimage sequences of the four Saiva Kuravars,
 * reconstructed from:
 *   • Periya Puranam (Sekkizhar, 12th c. CE) — the canonical biographies
 *   • Thiruvatavurar Puranam (for Manickavasakar)
 *   • Sundarar's own Tiruttondar Thogai (10-verse list of devotees)
 * 
 * IMPORTANT NOTE ON HISTORICITY
 * The exact chronological order of temple visits is debated among 
 * scholars. Sekkizhar wrote 300+ years after Sambandar and Appar, 
 * and 400+ years after Sundarar. What we present here is the 
 * *traditional narrative sequence* as attested by Periya Puranam 
 * and consensus interpretation — not a verified historical route.
 * 
 * S.No values verified against the 276-temple PPS dataset.
 * ================================================================
 */

const NAALVAR_JOURNEYS = {
  
  // ============================================================
  // 1. THIRUGNANASAMBANDAR
  // ============================================================
  sambandar: {
    name: "Thirugnanasambandar",
    name_ta: "திருஞானசம்பந்தர்",
    century: "7th c. CE",
    color: "#D2691E",  // Saffron
    icon: "🪔",
    born_place: "Sirkazhi",
    born_place_ta: "சீர்காழி",
    moksha_place: "Nallur Perumanam (at his wedding, age 16)",
    moksha_place_ta: "நல்லூர் பெருமணம் (திருமண நாள், 16 வயது)",
    total_pathigams: "384 (of ~10,000 composed)",
    summary: "Born to Sivapada Hrudiyar in Sirkazhi. At age 3, drank divine milk from Uma and sang his first pathigam 'Todudaya Seviyan.' Journeyed the Chola-Pandya country, defeated the Jain scholars at Madurai (the famous 'Aalavai' episode with the Pandya queen Mangayarkarasi), and merged with divine effulgence at 16.",
    sequence: [
      47,   // Sirkazhi Sattainathar/Brahmapureeswarar (birthplace)
      3,    // Chidambaram Tillai Nataraja
      44,   // Thiruvenkadu Swetharanyeswarar
      49,   // Vaitheeswaran Koil
      15,   // Thiruppanandal Arunajadeswarar
      72,   // Kumbakonam Adi Kumbeswarar
      87,   // Thirunageswaram (Rahu Sthalam)
      34,   // Thiruvanaikkaval Jambukeswarar (Pancha Bhoota Water)
      27,   // Thiruvaiyaru Aiyarappar (met Appar here)
      130,  // Thiruvarur Thyagaraja
      168,  // Nagapattinam Kayarohaneswarar
      201,  // Madurai Meenakshi (the great Aalavai episode)
      203,  // Thiruparankundram Sathyakireeswarar
      205,  // Rameswaram Ramanathaswamy (Jyotirlinga)
      199,  // Tirunelveli Nellaiappar
      198,  // Kutralam (Courtallam) Kutralanathar
      226,  // Thiruvannamalai Arunachaleswarar (Pancha Bhoota Fire)
      237,  // Kanchipuram Ekambareswarar (Pancha Bhoota Earth)
      47,   // Return to Sirkazhi
      // Moksha at Nallur Perumanam (not in PPS 276)
    ]
  },
  
  // ============================================================
  // 2. TIRUNAVUKKARASAR (APPAR)
  // ============================================================
  appar: {
    name: "Tirunavukkarasar (Appar)",
    name_ta: "திருநாவுக்கரசர் (அப்பர்)",
    century: "6th-7th c. CE (~570-650 CE)",
    color: "#8B4513",  // Deep brown — the color of his weeding-hoe
    icon: "🪔",
    born_place: "Tiruvamur, Panruti (Cuddalore)",
    born_place_ta: "திருவாமூர், பண்ருட்டி",
    moksha_place: "Thiruppugalur (age 81)",
    moksha_place_ta: "திருப்புகலூர் (81 வயது)",
    total_pathigams: "313 (of 4,900 composed)",
    summary: "Born Marulneekiyar in a Vellalar family. Converted to Jainism as Dharmasenar and became head of a Jain monastery. Struck by severe colic, returned to Saivism via his sister Tilakavathiyar's prayers at Thiruvathigai — his first pathigam was 'Kurrayinavaru Vilakku.' Converted King Mahendravarman I. Traveled to ~125 temples. Symbolized in temple iconography carrying a farmer's hoe (uzhavaram) — he cleaned temple pathways.",
    sequence: [
      221,  // Thiruvathigai Veerattaneswarar (site of conversion from Jainism)
      3,    // Chidambaram Tillai Nataraja
      27,   // Thiruvaiyaru Aiyarappar
      130,  // Thiruvarur Thyagaraja
      47,   // Sirkazhi Sattainathar (met young Sambandar; named "Appar" here)
      44,   // Thiruvenkadu (traveled with Sambandar)
      72,   // Kumbakonam Adi Kumbeswarar
      34,   // Thiruvanaikkaval Jambukeswarar
      168,  // Nagapattinam
      181,  // Mayiladuthurai Mayuranathar
      163,  // Thirukadaiyur Amirthakadeswarar (Ashta Veeratta - Markandeya legend)
      226,  // Thiruvannamalai Arunachaleswarar
      237,  // Kanchipuram Ekambareswarar
      153,  // Thiruppugalur Vardhamaneeswarar (site of moksha at age 81)
    ]
  },
  
  // ============================================================
  // 3. SUNDARAR (SUNDARAMURTHY NAYANAR)
  // ============================================================
  sundarar: {
    name: "Sundaramurthi (Sundarar)",
    name_ta: "சுந்தரமூர்த்தி நாயனார்",
    century: "8th c. CE",
    color: "#B8860B",  // Dark gold
    icon: "🪔",
    born_place: "Thirunavalur (Villupuram)",
    born_place_ta: "திருநாவலூர்",
    moksha_place: "Thiruvanchikulam, Kerala (borne to Kailasa on white elephant)",
    moksha_place_ta: "திருவஞ்சிக்களம், கேரளா",
    total_pathigams: "100 (of 38,000 composed)",
    summary: "Born Nambiyarurar in Thirunavalur to Sadaya Nayanar and Isaijnaniyar. At his wedding at Puttur, an old Brahmin (Shiva in disguise) claimed him as a hereditary servant with a palm-leaf deed — the famous 'Taduttatkonda' episode. His first pathigam at Thiruvennainallur begins 'Pittha Pirai Sudi.' Married Paravaiyar at Thiruvarur and Sangiliyar at Thiruvottiyur. Attained moksha at Thiruvanchikulam — the ONLY Nayanmar with Kerala moksha.",
    sequence: [
      228,  // Thirunavalur Bhakthajaneswarar (birthplace)
      233,  // Thiruvennainallur Kripapureeswarar (first pathigam: "Pittha Pirai Sudi")
      221,  // Thiruvathigai Veerattaneswarar
      3,    // Chidambaram Tillai Nataraja
      130,  // Thiruvarur Thyagaraja (married Paravaiyar here)
      153,  // Thiruppugalur Vardhamaneeswarar (gold-in-bricks miracle)
      222,  // Vriddhachalam Viruthagireeswarar (Pazhamalainathar)
      27,   // Thiruvaiyaru Aiyarappar
      72,   // Kumbakonam Adi Kumbeswarar
      15,   // Thiruppanandal
      181,  // Mayiladuthurai Mayuranathar
      262,  // Thiruvottiyur Adhipureeswarar (second marriage; broke oath → blindness)
      252,  // Mylapore Kapaleeswarar
      201,  // Madurai Meenakshi
      271,  // Thiruvanchikulam Mahadeva (KERALA — moksha; ascended on white elephant)
    ]
  },
  
  // ============================================================
  // 4. MANICKAVASAKAR
  // ============================================================
  manickavasakar: {
    name: "Manickavasakar",
    name_ta: "மாணிக்கவாசகர்",
    century: "9th c. CE (~c. 862-885 CE)",
    color: "#4A0E4E",  // Deep purple — the color of his renunciation
    icon: "🪔",
    born_place: "Thiruvadhavur (near Madurai)",
    born_place_ta: "திருவாதவூர்",
    moksha_place: "Chidambaram (merged into the Nataraja)",
    moksha_place_ta: "சிதம்பரம் (நடராஜரில் ஐக்கியம்)",
    total_pathigams: "Thiruvasagam (51 hymns) + Thirukkovaiyar (400 verses)",
    summary: "Born Vadavooran in Thiruvadhavur near Madurai. Became prime minister to Pandya king Arimarthana as 'Thennavan Brahmarayan.' Sent to buy horses for the king's cavalry, but at Perundurai (Avudayar Koil) met Shiva as a guru under a Kurundai tree — spent the entire treasury building a temple there. The king imprisoned him, but Shiva turned foxes into horses and back. Composed Thiruvasagam mostly at Chidambaram, where he eventually merged into the deity.",
    // NOTE: Perundurai (Avudayar Koil), Uttarakosamangai, and Thiruvadhavur
    // are NOT in the 276 PPS list. His journey shown here uses only PPS temples.
    sequence: [
      201,  // Madurai Meenakshi (imprisoned here; horse-fox miracle at Vaigai)
      3,    // Chidambaram Tillai Nataraja (composed Thiruvasagam here; moksha)
    ]
  }
};

// Make it globally accessible
if (typeof window !== 'undefined') {
  window.NAALVAR_JOURNEYS = NAALVAR_JOURNEYS;
}
