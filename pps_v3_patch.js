/**
 * Paadal Petra Sthalams — v3 Patch (Complete Recovery Build)
 * Tamil names + Wiki URL fixes + language toggle + coords panel
 * + Apple/OSM/Google Maps + Copy + Tevaram audio + Naalvar hero
 */
(function() {
  'use strict';

  // ============================================================
  // A. TAMIL DEITY NAME ADDITIONS
  // ============================================================
  const NAME_TA_MORE = {
    "Vaithiyanathaswamy":"வைத்தியநாதஸ்வாமி","Alanduraiyar":"ஆலந்துறையார்",
    "Balavannanathar":"பாலவண்ணநாதர்","Pranava Vyagrapuriswarar":"பிரணவ வியாக்ரபுரீஸ்வரர்",
    "Padanjaliswarar":"படஞ்சலீஸ்வரர்","Soundaryeswarar":"சௌந்தர்யேஸ்வரர்",
    "Amirthakatheeswarar":"அமிர்தகதீஸ்வரர்","Paasupatheeswarar":"பாசுபதீஸ்வரர்",
    "Pasupatheeswarar":"பசுபதீஸ்வரர்","Pasupatheeswarar (Alanthurai Nathar)":"பசுபதீஸ்வரர்",
    "Agneeswarar":"அக்னீஸ்வரர்","Prananatheswarar":"பிராணநாதேஸ்வரர்",
    "Arunajadeswarar":"அருணஜடேஸ்வரர்","Baluganathar":"பாலகநாதர்",
    "Sathiyagireeswarar":"சத்யகிரீஸ்வரர்","Karkadeswarar":"கர்கடேஸ்வரர்",
    "Yoganandeeswarar":"யோகநந்தீஸ்வரர்","Koteeswarar":"கோடீஸ்வரர்",
    "Koteeswarar / Kailasanathar":"கோடீஸ்வரர் / கைலாசநாதர்",
    "Ezhutharinathar":"எழுத்தறிநாதர்","Satchinatheswarar":"சாட்சிநாதேஸ்வரர்",
    "Vijayanatheswarar":"விஜயநாதேஸ்வரர்","Vilvavaneshwarar":"வில்வவனேஸ்வரர்",
    "Dayanidheeswarar":"தயாநிதீஸ்வரர்","Abathsagayeswarar":"ஆபத்சகாயேஸ்வரர்",
    "Aiyarappar":"ஐயாறப்பர்","Neyyadiyappar":"நெய்யாடியப்பர்",
    "Vyagrapureeswarar":"வியாக்ரபுரீஸ்வரர்","Semmeninathar":"செம்மேனிநாதர்",
    "Sathiyavakeeswarar":"சத்யவாக்கீஸ்வரர்","Amravaneswarar":"ஆம்ரவனேஸ்வரர்",
    "Adhimouleeswarar":"ஆதிமௌலீஸ்வரர்","Jambukeswarar":"ஜம்புகேஸ்வரர்",
    "Gneelivaneswarar":"நீலிவனேஸ்வரர்","Matruravaradeeswarar":"மாற்றுராவராதீஸ்வரர்",
    "Maragathaleswarar":"மரகதலீஸ்வரர்","Shivalokathyagar":"சிவலோகத்யாகர்",
    "Thirumeniyazhagar":"திருமேனியழகர்","Mullai Vananathar":"முல்லைவனநாதர்",
    "Sundareswarar":"சுந்தரேஸ்வரர்","Saiyaveswarar":"சாயவனேஸ்வரர்",
    "Pallavaneswarar":"பல்லவனேஸ்வரர்","Swetharanyeswarar":"சுவேதாரண்யேஸ்வரர்",
    "Aranyeswarar":"ஆரண்யேஸ்வரர்","Velladainathar":"வெள்ளடைநாதர்",
    "Sattainathar / Brahmapureeswarar":"சட்டைநாதர் / பிரம்மபுரீஸ்வரர்",
    "Sapthapureeswarar":"சப்தபுரீஸ்வரர்","Vaitheeswaran (Vaidyanathaswamy)":"வைத்தீஸ்வரன்",
    "Kannayiramudaiyar":"கண்ணாயிரமுடையார்","Kadaimudinathar":"கடைமுடிநாதர்",
    "Mahalatchumeeswarar":"மகாலட்சுமீஸ்வரர்","Shivalokanathar":"சிவலோகநாதர்",
    "Somanathar":"சோமநாதர்","Apatsakayeswarar":"ஆபத்சகாயேஸ்வரர்",
    "Kalyana Sundareswarar":"கல்யாண சுந்தரேஸ்வரர்","Airavatheswarar":"ஐராவதேஸ்வரர்",
    "Uthvaganathar Swami":"உத்வாகநாதர்","Veerateswarar":"வீரட்டேஸ்வரர்",
    "Kutram Poruthanathar":"குற்றம் பொறுத்தநாதர்","Kunthaleeswarar":"குந்தலீஸ்வரர்",
    "Manikkavannar":"மாணிக்கவண்ணர்","Neelakandeswarar":"நீலகண்டேஸ்வரர்",
    "Kadambavaaneswarar":"கடம்பவனேஸ்வரர்","Rathinagireeswarar":"ரத்னகிரீஸ்வரர்",
    "Tharparanyeswarar":"தர்ப்பாரண்யேஸ்வரர்","Amirdhakalasamudayar":"அமிர்தகலசமுடையார்",
    "Atmanatheswarar":"ஆத்மநாதேஸ்வரர்","Adi Kumbeswarar":"ஆதி கும்பேஸ்வரர்",
    "Gokileswarar":"கோகிலேஸ்வரர்","Sakkaravaageswarar":"சக்கரவாகேஸ்வரர்",
    "Sarkunalingeswarar":"சர்குணலிங்கேஸ்வரர்","Saraparameswarar":"சாரபரமேஸ்வரர்",
    "Sitthanatheswarar":"சித்தநாதேஸ்வரர்","Sivagurunathar":"சிவகுருநாதர்",
    "Sivakozhuntheeswarar":"சிவகொழுந்தீஸ்வரர்","Sivanandheswarar":"சிவநந்தேஸ்வரர்",
    "Someeswarar":"சோமேஸ்வரர்","Sottuthurai Nathar":"சோற்றுத்துறை நாதர்",
    "Jnanaparameswarar":"ஞானபரமேஸ்வரர்","Thiruvalanjuzhinathar":"திருவலஞ்சுழிநாதர்",
    "Thenupeeswarar":"தேனுபீஸ்வரர்","Nageswarar":"நாகேஸ்வரர்",
    "Nageswaran":"நாகேஸ்வரன்","Panchavarneeswarar":"பஞ்சவர்ணீஸ்வரர்",
    "Padikasunathar":"படிகாசுநாதர்","Palaiyavaneswarar":"பழையவனேஸ்வரர்",
    "Paschakareeswarar":"பாஷாகரீஸ்வரர்","Brammasiragandeeswarar":"பிரம்மசிரகண்டீஸ்வரர்",
    "Pushpavaneswarar":"புஷ்பவனேஸ்வரர்","Mahalingeswarar":"மகாலிங்கேஸ்வரர்",
    "Vasishteeswarar":"வசிஷ்டேஸ்வரர்","Vedhapureeswarar":"வேதபுரீஸ்வரர்",
    "Erumbiswarar":"எறும்பீஸ்வரர்","Thayumanavar":"தாயுமானவர்",
    "Netungalanathar":"நெடுங்கலநாதர்","Panchavarneswarar":"பஞ்சவர்ணேஸ்வரர்",
    "Paraythurainathar":"பறைதுறைநாதர்","Ujjeevanathar":"உஜ்ஜீவநாதர்",
    "Agileswarar":"அகிலீஸ்வரர்","Abimuktheeswarar":"அபிமுக்தீஸ்வரர்",
    "Uthirapachupatheeswarar":"உத்தரபசுபதீஸ்வரர்","Airavateeswarar":"ஐராவதீஸ்வரர்",
    "Kannayiranathar":"கண்ணாயிரநாதர்","Karaveeranathar (Brammapureeswarar)":"கரவீரநாதர்",
    "Karpaganathar":"கற்பகநாதர்","Kediliyappar":"கேடிலியப்பர்",
    "Kaichinneswarar":"கைச்சினேஸ்வரர்","Koluntheeswarar":"கொழுந்தீஸ்வரர்",
    "Koneswarar":"கோனேஸ்வரர்","Sakalabhuvaneswarar":"சகலபுவனேஸ்வரர்",
    "Sathurangavallabhanathar":"சதுரங்கவல்லபநாதர்","Sargunanathar":"சர்குணநாதர்",
    "Sarguneswarar":"சர்குணேஸ்வரர்","Satchinathar":"சாட்சிநாதர்",
    "Sushmapureeswarar":"சுஷ்மபுரீஸ்வரர்","Seshapureeswarar":"சேஷபுரீஸ்வரர்",
    "Sornapureeswarar":"சொர்ணபுரீஸ்வரர்","Thyagarajar":"த்யாகராஜர்",
    "Dhoovay Nathar":"தூவாய் நாதர்","Devapureeswarar":"தேவபுரீஸ்வரர்",
    "Naduthariyappar":"நடுத்தறியப்பர்","Narthanapureeswarar":"நர்த்தனபுரீஸ்வரர்",
    "Naganathar":"நாகநாதர்","Neelnethinathar":"நீல்நெத்திநாதர்",
    "Nellivananathar":"நெல்லிவனநாதர்","Padanjali Manogarar":"படஞ்சலி மனோகரர்",
    "Padaleeswarar":"பாதாலீஸ்வரர்","Parijathavaneswarar":"பாரிஜாதவனேஸ்வரர்",
    "Brammapureeswarar":"பிரம்மபுரீஸ்வரர்","Ponvaithanathar":"பொன்வைத்தநாதர்",
    "Mahakalanathar":"மகாகாலநாதர்","Madhuvaneswarar":"மதுவனேஸ்வரர்",
    "Manthirapureeswarar":"மந்திரபுரீஸ்வரர்","Mugkoodal Thirunethranathar":"முக்கூடல் திருநேத்திரநாதர்",
    "Muktheeswarar":"முக்தீஸ்வரர்","Meghanathar":"மேகநாதர்",
    "Rathinapureeswarar":"ரத்னபுரீஸ்வரர்","Ramanathar":"ராமநாதர்",
    "Vandurai Nathar":"வண்டுறை நாதர்","Vardhamaneeswarar":"வர்த்தமானீஸ்வரர்",
    "Vanjinathar":"வஞ்சிநாதர்","Vilvaranyeswarar":"வில்வாரண்யேஸ்வரர்",
    "Veerattaneswarar":"வீரட்டானேஸ்வரர்","Velinatheswarar":"வேலிநாதேஸ்வரர்",
    "Vennikarumbeswarar":"வெண்ணிக்கரும்பீஸ்வரர்","Vellimalainathar":"வெள்ளிமலைநாதர்",
    "Jagatheeswarar":"ஜகதீஸ்வரர்","Aktheeswarar":"அகதீஸ்வரர்",
    "Ayavantheeswarar":"ஆயவந்தீஸ்வரர்","Ucchiravaneswarar":"உச்சிராவனேஸ்வரர்",
    "Uththavadeeswarar":"உத்தவாதீஸ்வரர்","Uma Maheswara Swamy":"உமா மஹேஸ்வரர்",
    "Gayaroganeshwarar (Kayarohaneswarar)":"காயரோகணேஸ்வரர்","Kodikkuzhagar":"கொடிக்குழகர்",
    "Komuktheeswarar":"கோமுக்தீஸ்வரர்","Sankaranyeswarar":"சங்கரண்யேஸ்வரர்",
    "Swarnapureeswarar":"சுவர்ணபுரீஸ்வரர்","Thanthondeeswarar":"தந்தோண்டீஸ்வரர்",
    "Thiruppayathu Nathar":"திருப்பயத்து நாதர்","Thirumarai Kadar (Vedaranyeswarar)":"திருமறைக்காடர்",
    "Navaneetheswarar":"நவநீதேஸ்வரர்","Nattrunaiyappar":"நற்றுணையப்பர்",
    "Brahmapureeswarar":"பிரம்மபுரீஸ்வரர்","Manaththunai Nathar":"மனத்துணை நாதர்",
    "Mayuranathar":"மயூரநாதர்","Valampurinathar":"வளம்புரிநாதர்",
    "Vaimoornathar":"வைமூர்நாதர்","Veeraateswarar":"வீராடேஸ்வரர்",
    "Vedapureeswarar":"வேதபுரீஸ்வரர்","Vaigalnathar":"வைகல்நாதர்",
    "Parvathiswarar":"பார்வதீஸ்வரர்","Yazhmoorinathar":"யாழ்மூரிநாதர்",
    "Punniyakodiyappar":"புண்ணியகோடியப்பர்","Kodunkundranathar":"கொடுங்குன்றநாதர்",
    "Thiruthalinathar":"திருத்தளிநாதர்","Kalayarkoil Someswarar":"கழையார்கோயில் சோமேஸ்வரர்",
    "Thiruvappudaiyar":"திருவாப்புடையார்","Kutralanathar":"குற்றாலநாதர்",
    "Nellaiappar":"நெல்லையப்பர்","Sathyakireeswarar":"சத்யகிரீஸ்வரர்",
    "Edaganathar":"இடகநாதர்","Ramanathaswamy":"ராமநாதசுவாமி",
    "Thiruvadanai":"திருவாடானை","Bhuminathar":"பூமிநாதர்",
    "Meenakshi Sundareswarar":"மீனாட்சி சுந்தரேஸ்வரர்","Thiruppunavasal":"திருப்புனவாயில்",
    "Avinasilingeshwarar":"அவினாசிலிங்கேஸ்வரர்","Thirumuruganathar":"திருமுருகநாதர்",
    "Sangameswarar (Kooduthurai)":"சங்கமேஸ்வரர்","Arthanareeswarar":"அர்த்தநாரீஸ்வரர்",
    "Kalyana Vikirtheeswarar":"கல்யாண விகர்த்தீஸ்வரர்","Kodumudinathar":"கொடுமுடிநாதர்",
    "Kalyana Pasupatheeswarar":"கல்யாண பசுபதீஸ்வரர்","Theerthapureeswarar":"தீர்த்தபுரீஸ்வரர்",
    "Pirilayakaleswarar":"பிரளயகாலேஸ்வரர்","Vallabheswarar":"வல்லபேஸ்வரர்",
    "Mangalapureeswarar":"மங்களபுரீஸ்வரர்","Sishtakurunatheswarar":"சிஷ்டகுருநாதேஸ்வரர்",
    "Vamanapureeswarar":"வாமனபுரீஸ்வரர்","Arunachaleswarar":"அருணாசலேஸ்வரர்",
    "Panchanatheeswarar":"பஞ்சநாதீஸ்வரர்","Bhakthajaneswarar":"பக்தஜனேஸ்வரர்",
    "Sornakatheeswarar":"சொர்ணகதீஸ்வரர்","Adhulyanatheswarar":"அதுல்யநாதேஸ்வரர்",
    "Marundeeswarar":"மருந்தீஸ்வரர்","Kripapureeswarar":"கிருபாபுரீஸ்வரர்",
    "Sivalokanathar":"சிவலோகநாதர்","Panangattiswarar":"பனங்காட்டீஸ்வரர்",
    "Abirameswarar":"அபிராமேஸ்வரர்","Ekambareswarar":"ஏகாம்பரேஸ்வரர்",
    "Thirumetraliswarar":"திருமேற்றளீஸ்வரர்","Onakantheswarar":"ஓணகாந்தேஸ்வரர்",
    "Kachi Anekadhangavadeswarar":"கச்சி அநேகதங்காவதேஸ்வரர்",
    "Sathyanatheswarar":"சத்யநாதேஸ்வரர்","Thirumakaraliswarar":"திருமாகறலீஸ்வரர்",
    "Deivanayakeswarar":"தெய்வநாயகேஸ்வரர்","Vedapureeswarar":"வேதபுரீஸ்வரர்",
    "Kachabeswarar / Marundeeswarar":"கச்சபேஸ்வரர் / மருந்தீஸ்வரர்",
    "Jnanapureeswarar":"ஞானபுரீஸ்வரர்","Vedakireeswarar":"வேதகிரீஸ்வரர்",
    "Aatcheeswarar":"ஆட்சீஸ்வரர்","Sri Kalahasteeswarar":"ஸ்ரீ காளஹஸ்தீஸ்வரர்",
    "Tiruvalleeswarar":"திருவல்லீஸ்வரர்","Masilamaneeswarar":"மசிலாமணீஸ்வரர்",
    "Kapaleeswarar":"கபாலீஸ்வரர்","Valeeswarar":"வாலீஸ்வரர்",
    "Thalapureeswarar":"தலபுரீஸ்வரர்","Thiripuranthagar":"திரிபுராந்தகர்",
    "Vadaranyeswarar":"வடாரண்யேஸ்வரர்","Vaseeswarar":"வாசீஸ்வரர்",
    "Oontheeswarar":"ஊந்தீஸ்வரர்","Sivanandeswarar":"சிவநந்தேஸ்வரர்",
    "Adhipureeswarar (Padampakkanathar)":"ஆதிபுரீஸ்வரர்","Chandramavulieswarar":"சந்திரமௌலீஸ்வரர்",
    "Aralieswarar":"அரளீஸ்வரர்","Mahaakaaleeswarar":"மகாகாளீஸ்வரர்",
    "Agastheeswarar":"அகஸ்தீஸ்வரர்","Vilvanatheswarar":"வில்வநாதேஸ்வரர்",
    "Manikandeswarar":"மணிகண்டேஸ்வரர்","Jalanatheeswarar":"ஜலநாதீஸ்வரர்",
    "Mahabaleshwar":"மகாபலேஸ்வரர்","Thiruvanchikulam Mahadeva":"திருவஞ்சிக்களம் மஹாதேவர்",
    "Mallikarjuna":"மல்லிகார்ஜுனர்","Pashupatinath":"பசுபதிநாதர்",
    "Kailasanathar (Indraneela Parvatham)":"கைலாசநாதர்","Kedareshwarar":"கேதாரேஸ்வரர்",
    "Kailayanathar":"கைலாயநாதர்","Koneswaram":"கோனேஸ்வரம்",
    "Thiruketheeswaram":"திருக்கேதீஸ்வரம்","Viruthagireeswarar (Pazhamalainathar)":"விருத்தகிரீஸ்வரர்",
    "Thirumarai Kadar (Vedaranyeswarar)":"திருமறைக்காடர்","Amirthakadeswarar":"அமிர்தகடேஸ்வரர்"
  };

  // ============================================================
  // B. WIKIPEDIA URL OVERRIDES (verified Jun 2026)
  // ============================================================
  const WIKI_OVERRIDES = {
    "Chidambaram Tillai Nataraja":"https://en.wikipedia.org/wiki/Nataraja_Temple,_Chidambaram",
    "Aiyarappar":"https://en.wikipedia.org/wiki/Aiyarappar_temple",
    "Sattainathar / Brahmapureeswarar":"https://en.wikipedia.org/wiki/Sattainathar_Temple,_Sirkazhi",
    "Jambukeswarar":"https://en.wikipedia.org/wiki/Jambukeswarar_Temple,_Thiruvanaikaval",
    "Swetharanyeswarar":"https://en.wikipedia.org/wiki/Swetharanyeswarar_Temple",
    "Vaitheeswaran (Vaidyanathaswamy)":"https://en.wikipedia.org/wiki/Vaitheeswaran_Koil_temple",
    "Mayuranathar":"https://en.wikipedia.org/wiki/Mayuranathaswami_Temple,_Mayiladuthurai",
    "Amirthakadeswarar":"https://en.wikipedia.org/wiki/Amritaghateswarar-Abirami_Temple",
    "Thirumarai Kadar (Vedaranyeswarar)":"https://en.wikipedia.org/wiki/Vedaranyeswarar_Temple,_Vedaranyam",
    "Nageswarar":"https://en.wikipedia.org/wiki/Naganathar_Temple,_Thirunageswaram",
    "Komuktheeswarar":"https://en.wikipedia.org/wiki/Gomatheeswarar_Temple,_Thiruvavaduthurai",
    "Uma Maheswara Swamy":"https://en.wikipedia.org/wiki/Uma_Maheswarar_Temple,_Konerirajapuram",
    "Vardhamaneeswarar":"https://en.wikipedia.org/wiki/Vardamaneeswarar_temple",
    "Arunachaleswarar":"https://en.wikipedia.org/wiki/Arunachalesvara_Temple",
    "Veerateswarar":"https://en.wikipedia.org/wiki/Veerateeswarar_temple,_Thirukovilur",
    "Bhakthajaneswarar":"https://en.wikipedia.org/wiki/Bhakthajaneswarar_Temple",
    "Kripapureeswarar":"https://en.wikipedia.org/wiki/Kripapureeswarar_Temple,_Thiruvennainallur",
    "Ekambareswarar":"https://en.wikipedia.org/wiki/Ekambareswarar_Temple_%28Kanchipuram%29",
    "Kapaleeswarar":"https://en.wikipedia.org/wiki/Kapaleeshwarar_Temple",
    "Marundeeswarar":"https://en.wikipedia.org/wiki/Marundeeswarar_Temple",
    "Vadaranyeswarar":"https://en.wikipedia.org/wiki/Sri_Vadaranyeswarar_Temple",
    "Jalanatheeswarar":"https://en.wikipedia.org/wiki/Jalanatheeswarar_Temple,_Thakkolam",
    "Sri Kalahasteeswarar":"https://en.wikipedia.org/wiki/Srikalahasteeswara_temple",
    "Adhipureeswarar (Padampakkanathar)":"https://en.wikipedia.org/wiki/Adhipureeswarar_Temple,_Thiruvottiyur",
    "Meenakshi Sundareswarar":"https://en.wikipedia.org/wiki/Meenakshi_Temple",
    "Ramanathaswamy":"https://en.wikipedia.org/wiki/Ramanathaswamy_Temple",
    "Nellaiappar":"https://en.wikipedia.org/wiki/Nellaiappar_Temple",
    "Kutralanathar":"https://en.wikipedia.org/wiki/Kutralanathar_Temple",
    "Sathyakireeswarar":"https://en.wikipedia.org/wiki/Thiruparankunram_Murugan_Temple",
    "Arthanareeswarar":"https://en.wikipedia.org/wiki/Arthanareeswarar_Temple,_Tiruchengode",
    "Avinasilingeshwarar":"https://en.wikipedia.org/wiki/Avinasilingeshwarar_Temple_%28Tiruppukkozhiyur%29",
    "Mahabaleshwar":"https://en.wikipedia.org/wiki/Mahabaleshwar_Temple,_Gokarna",
    "Mallikarjuna":"https://en.wikipedia.org/wiki/Mallikarjuna_Temple,_Srisailam",
    "Pashupatinath":"https://en.wikipedia.org/wiki/Pashupatinath_Temple",
    "Kedareshwarar":"https://en.wikipedia.org/wiki/Kedarnath_Temple",
    "Kailayanathar":"https://en.wikipedia.org/wiki/Mount_Kailash",
    "Koneswaram":"https://en.wikipedia.org/wiki/Koneswaram_Temple",
    "Thiruketheeswaram":"https://en.wikipedia.org/wiki/Ketheeswaram_temple",
    "Adi Kumbeswarar":"https://en.wikipedia.org/wiki/Adi_Kumbeswarar_Temple,_Kumbakonam",
    "Mahalingeswarar":"https://en.wikipedia.org/wiki/Mahalingeswarar_Temple,_Thiruvidaimarudur",
    "Brammasiragandeeswarar":"https://en.wikipedia.org/wiki/Brahma_Sirakandeeswarar_Temple,_Kandiyur",
    "Thyagarajar":"https://en.wikipedia.org/wiki/Thyagaraja_Temple,_Tiruvarur",
    "Vedakireeswarar":"https://en.wikipedia.org/wiki/Vedagiriswarar_Temple",
    "Veerattaneswarar":"https://en.wikipedia.org/wiki/Veerateeswarar_Temple,_Thiruvathigai",
    "Viruthagireeswarar (Pazhamalainathar)":"https://en.wikipedia.org/wiki/Virudhagiriswarar_temple",
    "Sangameswarar (Kooduthurai)":"https://en.wikipedia.org/wiki/Bhavani_Sangameswarar_Temple",
    "Kodumudinathar":"https://en.wikipedia.org/wiki/Kodumudi_Magudeswarar_temple",
    "Erumbiswarar":"https://en.wikipedia.org/wiki/Erumbeeswarar_Temple",
    "Thiruvanchikulam Mahadeva":"https://en.wikipedia.org/wiki/Thiruvanchikulam_Mahadeva_Temple",
    "Tiruvalleeswarar":"https://en.wikipedia.org/wiki/Tiruvallesvarar_Temple",
    "Vilvanatheswarar":"https://en.wikipedia.org/wiki/Vilvanatheswarar_Temple_(Tiruvalam)",
    "Thiruppunavasal":"https://en.wikipedia.org/wiki/Tiruppunavayil",
    "Edaganathar":"https://en.wikipedia.org/wiki/Edaganathar_temple",
    "Bhuminathar":"https://en.wikipedia.org/wiki/Bhuminatha_Swamy_Temple,_Tiruchuli",
    "Thirumetraliswarar":"https://en.wikipedia.org/wiki/Thirumetrali_Temple",
    "Kachi Anekadhangavadeswarar":"https://en.wikipedia.org/wiki/Kachi_Anekatangapadam_Temple",
    "Vedapureeswarar":"https://en.wikipedia.org/wiki/Vedapureeswarar_temple,_Thiruverkadu",
    "Kachabeswarar / Marundeeswarar":"https://en.wikipedia.org/wiki/Kachabeswarar_Temple,_Thirukachur",
    "Koneswarar":"https://en.wikipedia.org/wiki/Koneswarar_Temple,_Kudavasal",
    "Brahmapureeswarar":"https://en.wikipedia.org/wiki/Brahmapureeswarar_Temple,_Thirukkuvalai",
    "Thayumanavar":"https://en.wikipedia.org/wiki/Rockfort_Ucchi_Pillayar_Temple",
    "Yazhmoorinathar":"https://en.wikipedia.org/wiki/Yazhmurinathar_Temple"
  };

  // ============================================================
  // C. TAMIL WIKIPEDIA URL OVERRIDES
  // ============================================================
  const TAMIL_WIKI_OVERRIDES = {
    "Chidambaram Tillai Nataraja":"https://ta.wikipedia.org/wiki/சிதம்பரம்_நடராசர்_கோயில்",
    "Adi Kumbeswarar":"https://ta.wikipedia.org/wiki/கும்பேசுவரர்_கோயில்,_கும்பகோணம்",
    "Jambukeswarar":"https://ta.wikipedia.org/wiki/திருவானைக்காவல்_சம்புகேசுவரர்_கோயில்",
    "Aiyarappar":"https://ta.wikipedia.org/wiki/திருவையாறு_ஐயாறப்பர்_கோயில்",
    "Thyagarajar":"https://ta.wikipedia.org/wiki/திருவாரூர்_தியாகராஜர்_கோயில்",
    "Mayuranathar":"https://ta.wikipedia.org/wiki/மயூரநாதர்_கோயில்,_மயிலாடுதுறை",
    "Arunachaleswarar":"https://ta.wikipedia.org/wiki/திருவண்ணாமலை_அண்ணாமலையார்_கோயில்",
    "Ekambareswarar":"https://ta.wikipedia.org/wiki/காஞ்சி_ஏகாம்பரநாதர்_கோயில்",
    "Kapaleeswarar":"https://ta.wikipedia.org/wiki/கபாலீசுவரர்_கோவில்",
    "Meenakshi Sundareswarar":"https://ta.wikipedia.org/wiki/மீனாட்சி_அம்மன்_கோயில்",
    "Ramanathaswamy":"https://ta.wikipedia.org/wiki/இராமநாதசுவாமி_கோயில்",
    "Nellaiappar":"https://ta.wikipedia.org/wiki/நெல்லையப்பர்_கோயில்",
    "Pashupatinath":"https://ta.wikipedia.org/wiki/பசுபதிநாதர்_கோயில்",
    "Kedareshwarar":"https://ta.wikipedia.org/wiki/கேதார்நாத்_கோயில்",
    "Koneswaram":"https://ta.wikipedia.org/wiki/திருக்கோணேஸ்வரம்_கோயில்"
  };

  // ============================================================
  // D. CULTURAL NOTES
  // ============================================================
  const CULTURAL_NOTES = {
    "Vadaranyeswarar":"Pancha Sabha (Ratna Sabha) — site of Shiva's Urdhva Tandava; home of the legendary Tiruvalangadu Copper Plates of Rajendra Chola I (1018 CE)",
    "Aiyarappar":"Dakshina Kailasam — birthplace of Nandi; one of 7 Saptha Stana temples",
    "Pashupatinath":"UNESCO World Heritage Site (1979); 246 hectares with 518 mini-temples",
    "Swetharanyeswarar":"Called 'Adi Chidambaram' — Nataraja's cosmic dance performed HERE before Chidambaram",
    "Kedareshwarar":"Largely destroyed in 2013 floods; main shrine survived protected by 'Bhim Shila'; one of 12 Jyotirlingas",
    "Mallikarjuna":"Rare dual sacred site — both Jyotirlinga AND Shakti Peetha (Bhramaramba)",
    "Arunachaleswarar":"Pancha Bhoota (Fire/Agni); Karthigai Deepam lights a giant beacon atop the 2,668 ft Arunachala Hill",
    "Ekambareswarar":"Pancha Bhoota (Earth); houses the 3,500-year-old sacred mango tree with 4 branches for the 4 Vedas",
    "Amirthakadeswarar":"Ashta Veeratta site — where Shiva slew Yama as Kalasamharamurthy to save Markandeya",
    "Veerattaneswarar":"Ashta Veeratta (Tripura Samhara); where Appar converted from Jainism back to Saivism",
    "Veerateswarar":"Ashta Veeratta (Andhakasura Samhara); 64 Bhairavas manifested here; relieves Shukra's curse",
    "Avinasilingeshwarar":"'Dakshina Kashi'; site of Sundarar's miracle reviving a boy swallowed by a crocodile",
    "Sangameswarar (Kooduthurai)":"Triveni Sangamam of the South — confluence of Kaveri, Bhavani, and underground Amutha rivers",
    "Mahabaleshwar":"Houses the Atmalinga that Ganesha tricked Ravana into setting at Gokarna",
    "Kodumudinathar":"Mummoorthigal Sthalam (abode of all three of the Trimurti)",
    "Erumbiswarar":"Devas became ants (erumbu) to worship in secret from demon Tharukasura; Shiva became an ant-hill",
    "Mayuranathar":"Parvati cursed to be born as peahen worshipped here to lift the curse",
    "Thiruketheeswaram":"One of 5 ancient Ishwarams of Sri Lanka; razed by Portuguese 1575, rebuilt 1903"
  };

  // ============================================================
  // E. CURATED AUDIO
  // ============================================================
  const CURATED_AUDIO = {
    "Sattainathar / Brahmapureeswarar":"https://www.youtube.com/results?search_query=Sirkazhi+Brahmapureeswarar+Thevaram+Sambandar",
    "Chidambaram Tillai Nataraja":"https://www.youtube.com/results?search_query=Chidambaram+Thevaram+Thillai+Pathigam",
    "Jambukeswarar":"https://www.youtube.com/results?search_query=Thiruvanaikaval+Jambukeswarar+Thevaram",
    "Arunachaleswarar":"https://www.youtube.com/results?search_query=Thiruvannamalai+Thevaram+Annamalai",
    "Ekambareswarar":"https://www.youtube.com/results?search_query=Kanchipuram+Ekambareswarar+Thevaram",
    "Sri Kalahasteeswarar":"https://www.youtube.com/results?search_query=Kalahasti+Thevaram+Sambandar",
    "Thyagarajar":"https://www.youtube.com/results?search_query=Thiruvarur+Thyagaraja+Thevaram",
    "Aiyarappar":"https://www.youtube.com/results?search_query=Thiruvaiyaru+Aiyarappar+Thevaram",
    "Bhakthajaneswarar":"https://www.youtube.com/results?search_query=Thirunavalur+Sundarar+Thevaram",
    "Kripapureeswarar":"https://www.youtube.com/results?search_query=Pitha+Pirai+Sudi+Sundarar+Thevaram",
    "Ramanathaswamy":"https://www.youtube.com/results?search_query=Rameswaram+Thevaram+Sambandar",
    "Adi Kumbeswarar":"https://www.youtube.com/results?search_query=Kumbakonam+Adi+Kumbeswarar+Thevaram",
    "Meenakshi Sundareswarar":"https://www.youtube.com/results?search_query=Madurai+Aalavay+Thevaram+Sambandar",
    "Nellaiappar":"https://www.youtube.com/results?search_query=Tirunelveli+Nellaiappar+Thevaram",
    "Kapaleeswarar":"https://www.youtube.com/results?search_query=Mylapore+Kapaleeswarar+Thevaram",
    "Swetharanyeswarar":"https://www.youtube.com/results?search_query=Thiruvenkadu+Swetharanyeswarar+Thevaram",
    "Vaitheeswaran (Vaidyanathaswamy)":"https://www.youtube.com/results?search_query=Vaitheeswaran+Koil+Thevaram",
    "Mayuranathar":"https://www.youtube.com/results?search_query=Mayiladuthurai+Mayuranathar+Thevaram",
    "Mahalingeswarar":"https://www.youtube.com/results?search_query=Thiruvidaimarudur+Mahalingeswarar+Thevaram",
    "Veerattaneswarar":"https://www.youtube.com/results?search_query=Thiruvathigai+Veerattanam+Appar+Thevaram",
    "Veerateswarar":"https://www.youtube.com/results?search_query=Thirukovilur+Veerateeswarar+Thevaram",
    "Vadaranyeswarar":"https://www.youtube.com/results?search_query=Thiruvalangadu+Urdhva+Tandava+Thevaram",
    "Pashupatinath":"https://www.youtube.com/results?search_query=Pashupatinath+Thevaram+Sambandar",
    "Kedareshwarar":"https://www.youtube.com/results?search_query=Kedarnath+Thevaram",
    "Mallikarjuna":"https://www.youtube.com/results?search_query=Srisailam+Thevaram",
    "Thirumarai Kadar (Vedaranyeswarar)":"https://www.youtube.com/results?search_query=Vedaranyam+Thevaram"
  };

  // ============================================================
  // F. CSS INJECTION
  // ============================================================
  const styleEl = document.createElement("style");
  styleEl.textContent =
    ".lang-toggle{position:fixed;top:8px;right:8px;z-index:1100;padding:6px 12px;background:#FFF8E7;color:#A0522D;border:1.5px solid #D4AF37;border-radius:18px;font-weight:700;cursor:pointer;font-size:.85rem;box-shadow:0 2px 6px rgba(0,0,0,.2)}" +
    ".lang-toggle:hover{background:#D4AF37;color:#fff}" +
    ".coord-panel{margin-top:8px;padding:7px 9px;background:#FFF8E7;border:1px solid #e8dcc0;border-radius:5px}" +
    ".coord-row{display:flex;align-items:center;gap:6px;font-size:.74rem;margin-bottom:5px}" +
    ".coord-label{color:#7a6b5a;font-weight:600;text-transform:uppercase;font-size:.6rem;letter-spacing:.5px}" +
    ".coord-value{font-family:'SF Mono',Consolas,monospace;color:#2A1810;font-size:.78rem;font-weight:600;user-select:all}" +
    ".coord-actions{display:flex;gap:5px;flex-wrap:wrap}" +
    ".coord-btn,.audio-btn{display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border:1.5px solid #D2691E;border-radius:4px;background:#fff;color:#A0522D;font-size:.68rem;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap;transition:all .15s}" +
    ".coord-btn:hover{background:#D2691E;color:#fff}" +
    ".coord-btn-gmap{border-color:#4285F4;color:#4285F4}" +
    ".coord-btn-gmap:hover{background:#4285F4;color:#fff}" +
    ".coord-btn-apple{border-color:#000;color:#000}" +
    ".coord-btn-apple:hover{background:#000;color:#fff}" +
    ".coord-btn-osm{border-color:#7EBC6F;color:#4F7D3E}" +
    ".coord-btn-osm:hover{background:#7EBC6F;color:#fff}" +
    ".coord-btn.copied{background:#4CAF50;color:#fff;border-color:#4CAF50}" +
    ".audio-btn{border-color:#8B5A2B;color:#8B5A2B;background:linear-gradient(135deg,#fff8e7 0%,#fef0c7 100%)}" +
    ".audio-btn:hover{background:linear-gradient(135deg,#D2691E 0%,#A0522D 100%);color:#fff}";
  document.head.appendChild(styleEl);

  // ============================================================
  // G. APPLY DATA PATCHES
  // ============================================================
  function applyDataPatches() {
    if (typeof TEMPLES === "undefined") { setTimeout(applyDataPatches, 100); return; }
    let taApplied = 0, wikiFixed = 0;
    TEMPLES.forEach(function(t) {
      if (!t.name_ta && NAME_TA_MORE[t.name]) { t.name_ta = NAME_TA_MORE[t.name]; taApplied++; }
      const newWiki = WIKI_OVERRIDES[t.name] || (t.wiki && t.wiki.indexOf("?search=") !== -1
        ? "https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(t.name + " Temple " + t.town) + "&go=Go"
        : t.wiki);
      t.wiki_en = newWiki;
      t.wiki_ta = TAMIL_WIKI_OVERRIDES[t.name] || newWiki;
      t.wiki = newWiki;
      if (newWiki !== t.wiki) wikiFixed++;
      if (CULTURAL_NOTES[t.name]) {
        t.notes = t.notes && t.notes.trim()
          ? "★ " + CULTURAL_NOTES[t.name] + " · " + t.notes
          : "★ " + CULTURAL_NOTES[t.name];
      }
    });
    console.log("[pps_v3_patch] Applied Tamil names to", taApplied, "temples; fixed", wikiFixed, "Wiki URLs");
    if (typeof window.render === "function") window.render();
  }

  // ============================================================
  // H. LANGUAGE TOGGLE
  // ============================================================
  function setupLangToggle() {
    const savedLang = localStorage.getItem("pps-lang") || "en";
    const btn = document.createElement("button");
    btn.className = "lang-toggle";
    btn.textContent = savedLang === "en" ? "தமிழ்" : "EN";
    btn.onclick = function() {
      const newLang = btn.textContent === "தமிழ்" ? "ta" : "en";
      localStorage.setItem("pps-lang", newLang);
      btn.textContent = newLang === "en" ? "தமிழ்" : "EN";
      TEMPLES.forEach(function(t) { t.wiki = newLang === "ta" ? (t.wiki_ta || t.wiki_en) : t.wiki_en; });
      const searchEl = document.getElementById("search");
      if (searchEl) searchEl.placeholder = newLang === "ta" ? "கோயில், ஊர், மாவட்டம் தேடுக..." : "Search temple, town, district...";
      const resetEl = document.getElementById("reset");
      if (resetEl) resetEl.textContent = newLang === "ta" ? "மீட்டமை" : "Reset";
      if (typeof window.render === "function") window.render();
    };
    document.body.appendChild(btn);
  }

  // ============================================================
  // I. COORDS + AUDIO PANEL (cards only)
  // ============================================================
  function buildCoordPanel(t) {
    if (t.lat == null || t.lng == null) return "";
    const lat = parseFloat(t.lat).toFixed(4);
    const lng = parseFloat(t.lng).toFixed(4);
    const coords = lat + ", " + lng;
    const gmap = "https://www.google.com/maps?q=" + lat + "," + lng + "&z=17";
    const apple = "https://maps.apple.com/?ll=" + lat + "," + lng + "&z=17&q=" + encodeURIComponent(t.name);
    const osm = "https://www.openstreetmap.org/?mlat=" + lat + "&mlon=" + lng + "&zoom=17";
    const audioUrl = CURATED_AUDIO[t.name] || "https://www.youtube.com/results?search_query=" + encodeURIComponent(t.town + " " + t.name + " Thevaram pathigam");
    const audioLabel = CURATED_AUDIO[t.name] ? "🎵 Listen ★" : "🎵 Listen";

    return '<div class="coord-panel">' +
      '<div class="coord-row"><span class="coord-label">📍</span><span class="coord-value">' + coords + '</span></div>' +
      '<div class="coord-actions">' +
        '<a data-action="open" data-url="' + gmap + '" class="coord-btn coord-btn-gmap">🗺️ Google</a>' +
        '<a data-action="open" data-url="' + apple + '" class="coord-btn coord-btn-apple">🍎 Apple</a>' +
        '<a data-action="open" data-url="' + osm + '" class="coord-btn coord-btn-osm">🌍 OSM</a>' +
        '<button data-action="copy" data-coords="' + coords + '" class="coord-btn">📋 Copy</button>' +
        '<button data-action="open" data-url="' + audioUrl + '" class="audio-btn">' + audioLabel + '</button>' +
      '</div>' +
    '</div>';
  }

  function injectCardPanels() {
    document.querySelectorAll('.card[data-sno]').forEach(function(card) {
      if (card.querySelector('.coord-panel')) return;
      const sno = parseInt(card.dataset.sno);
      const temple = TEMPLES.find(function(x) { return x.sno === sno; });
      if (temple) card.insertAdjacentHTML('beforeend', buildCoordPanel(temple));
    });
  }

  function injectTamilNames() {
    document.querySelectorAll('.card[data-sno]').forEach(function(card) {
      if (card.querySelector('.card-name-ta')) return;
      if (card.querySelector('.card-name-ta-injected')) return;
      const sno = parseInt(card.dataset.sno);
      const t = TEMPLES.find(function(x) { return x.sno === sno; });
      if (!t) return;
      const ta = t.name_ta || NAME_TA_MORE[t.name];
      if (!ta) return;
      const nameEl = card.querySelector('.card-name');
      if (!nameEl) return;
      const div = document.createElement('div');
      div.className = 'card-name-ta-injected';
      div.textContent = ta;
      div.style.cssText = 'font-family:"Noto Serif Tamil",serif;font-size:0.9rem;color:#A0522D;font-weight:600;margin-top:3px;display:block;width:100%;';
      const head = card.querySelector('.card-head');
      if (head) head.insertAdjacentElement('afterend', div);
    });
  }

  function watchCards() {
    const cardsContainer = document.getElementById('cards');
    if (!cardsContainer) { setTimeout(watchCards, 200); return; }
    injectTamilNames();
    injectCardPanels();
    const observer = new MutationObserver(function() {
      setTimeout(function() { injectTamilNames(); injectCardPanels(); }, 10);
    });
    observer.observe(cardsContainer, { childList: true, subtree: false });
  }

  // ============================================================
  // J. GLOBAL CLICK DELEGATE for coord/audio buttons
  // ============================================================
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    const action = btn.dataset.action;
    if (action === 'open') {
      const url = btn.dataset.url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } else if (action === 'copy') {
      const coords = btn.dataset.coords;
      const success = function() {
        const o = btn.innerHTML;
        btn.innerHTML = "✓ Copied!";
        btn.classList.add("copied");
        setTimeout(function() { btn.innerHTML = o; btn.classList.remove("copied"); }, 1500);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(coords).then(success).catch(function() { fallback(coords) && success(); });
      } else {
        fallback(coords) && success();
      }
    }
  }, true);

  function fallback(t) {
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const s = document.execCommand("copy");
      document.body.removeChild(ta);
      return s;
    } catch(e) { return false; }
  }

  // ============================================================
  // K. BUILD HERO IMAGE (Naalvar painting)
  // ============================================================
  function buildHero() {
    const placeholder = document.getElementById('hero-placeholder');
    if (placeholder) placeholder.remove();
    if (document.querySelector('.hero-image')) return;

    const hero = document.createElement('div');
    hero.className = 'hero-image';
    hero.setAttribute('style', 'position:relative;width:100%;height:auto;max-height:360px;overflow:hidden;background:#2A1810;border-bottom:3px solid #D4AF37;display:block;');

    const img = document.createElement('img');
    img.src = 'naalvar-cover.jpeg';
    img.alt = 'The Naalvar — Sambandar, Appar, Sundarar, Manikkavasakar';
    img.setAttribute('style', 'width:100%;height:auto;max-height:360px;object-fit:cover;object-position:center 35%;display:block;');
    img.onerror = function() {
      hero.style.background = 'linear-gradient(135deg,#D2691E,#A0522D)';
      hero.style.height = '200px';
      img.style.display = 'none';
    };

    const overlay = document.createElement('div');
    overlay.setAttribute('style', 'position:absolute;bottom:0;left:0;right:0;background:linear-gradient(180deg,transparent 0%,rgba(42,24,16,0.9) 100%);padding:40px 24px 16px;color:#fff;');

    const captionEn = document.createElement('div');
    captionEn.textContent = 'The Naalvar — the four Saiva poet-saints whose hymns define these 276 sthalas';
    captionEn.setAttribute('style', 'font-size:0.95rem;font-weight:500;margin-bottom:4px;');

    const captionTa = document.createElement('div');
    captionTa.textContent = 'நால்வர் — இந்த 276 தலங்களை இசை பாடிய சைவ நாயன்மார்கள்';
    captionTa.setAttribute('style', 'font-family:"Noto Serif Tamil",serif;font-size:0.9rem;color:#D4AF37;font-weight:500;');

    overlay.appendChild(captionEn);
    overlay.appendChild(captionTa);
    hero.appendChild(img);
    hero.appendChild(overlay);

    document.body.insertBefore(hero, document.body.firstChild);
  }

  // ============================================================
  // BOOT
  // ============================================================
  function boot() {
    applyDataPatches();
    setupLangToggle();
    watchCards();
    buildHero();
    if (typeof gtag === "function") {
      gtag('event', 'patch_loaded', { event_category: 'v3', event_label: 'pps_v3_patch' });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
