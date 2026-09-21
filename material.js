/* ========================================================= Sandeep ElectroFix - Estimate List material.js MASTER LIST = 89 ITEMS Hindi / English Quantity = Required Other fields = Optional Brand = Optional Price = Hidden + Blank ========================================================= */

"use strict";

/* ========================================================= LANGUAGE ========================================================= */

const MATERIAL_LANG_KEY = "sandeepMaterialLang"; const DEFAULT_MATERIAL_LANG = "hi";

let MATERIAL_LANG = localStorage.getItem(MATERIAL_LANG_KEY) || DEFAULT_MATERIAL_LANG;

if (!["hi", "en"].includes(MATERIAL_LANG)) { MATERIAL_LANG = DEFAULT_MATERIAL_LANG; }

/* ========================================================= COMMON TEXT ========================================================= */

const UI_TEXT = { en: { estimate: "Estimate", addToEstimate: "Add to Estimate", quantity: "Quantity", unit: "Unit", brand: "Brand", price: "Price", optional: "Optional", required: "Required", select: "Select", back: "Back", next: "Next" },

hi: { estimate: "एस्टिमेट", addToEstimate: "एस्टिमेट में जोड़ें", quantity: "मात्रा", unit: "यूनिट", brand: "ब्रांड", price: "कीमत", optional: "वैकल्पिक", required: "जरूरी", select: "चुनें", back: "वापस", next: "अगला" } };

/* ========================================================= STAGES ========================================================= */

const MATERIAL_STAGES = [ { id: 1, no: "STAGE 01", en: "Slab Conduit Installation", hi: "स्लैब कन्ड्यूट इंस्टॉलेशन" }, { id: 2, no: "STAGE 02", en: "Wall Conduit Installation", hi: "वॉल कन्ड्यूट इंस्टॉलेशन" }, { id: 3, no: "STAGE 03", en: "Wiring Installation", hi: "वायरिंग इंस्टॉलेशन" }, { id: 4, no: "STAGE 04", en: "Final Electrical Fittings", hi: "फाइनल इलेक्ट्रिकल फिटिंग्स" }, { id: 5, no: "STAGE 05", en: "False Ceiling Wiring Material", hi: "फॉल्स सीलिंग वायरिंग मटेरियल" } ];

/* ========================================================= HELPERS ========================================================= */

function TXT(en, hi = en) { return { en, hi }; }

function OPTION(en, hi = en) { return { en, hi }; }

function OPTIONS(values) { return values.map(v => { if (Array.isArray(v)) { return OPTION(v[0], v[1]); } return OPTION(v, v); }); }

function FIELD( key, en, hi, options = [], type = "select", required = false ) { return { key, label: TXT(en, hi), type, required, options: OPTIONS(options) }; }

function NUMBER_FIELD(key, en, hi, required = false) { return FIELD(key, en, hi, [], "number", required); }

function TEXT_FIELD(key, en, hi, required = false) { return FIELD(key, en, hi, [], "text", required); }

const COMMON_PIPE_BRANDS = [ "Polycab", "Finolex", "Havells", "AKG", "Precision", "Other Brand", "Non Brand / Local" ];

const STAGE4_SWITCH_BRANDS = [ "Legrand", "Schneider", "Anchor (Roma)", "GM", "Havells", "Crabtree" ];

/* Creates a material.

Quantity is ALWAYS added as required. Unit and Brand are always added after Quantity. Price exists but remains hidden and blank. */

function MATERIAL( stage, no, en, hi, fields = [], units = ["pcs"], brands = [] ) { return { id: S${stage}-${String(no).padStart(2, "0")}, stage, no,
name: TXT(en, hi),      fields: [       ...fields,        NUMBER_FIELD(         "quantity",         "Quantity",         "मात्रा",         true       ),        FIELD(         "unit",         "Unit",         "यूनिट",         units       ),        FIELD(         "brand",         "Brand",         "ब्रांड",         brands       )     ],      /*       Price is available in data but hidden until       config/app enables it.     */     price: "",     priceVisible: false     
}; }

/* ========================================================= STAGE 1 SLAB CONDUIT INSTALLATION 10 ITEMS ========================================================= */

const STAGE_1 = [

MATERIAL( 1, 1, "Pipe", "पाइप", [ FIELD( "size", "Size", "साइज", ["20mm", "25mm", "32mm", "40mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Heavy (HMS)", "हेवी (HMS)"],           ["Medium (MMS)", "मीडियम (MMS)"],           ["Light (LMS)", "लाइट (LMS)"]         ]       )     ],     ["pcs", "bndl", "doz"],     COMMON_PIPE_BRANDS    
),

MATERIAL( 1, 2, "Bend", "बेंड", [ FIELD( "size", "Size", "साइज", ["20mm", "25mm", "32mm", "40mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Heavy", "हेवी"],           ["Medium", "मीडियम"],           ["Light", "लाइट"]         ]       ),        FIELD(         "subType",         "Sub Type",         "उप-प्रकार",         [           ["Short Bend", "शॉर्ट बेंड"],           ["Long Bend", "लॉन्ग बेंड"]         ]       )     ],     ["pcs", "pkt", "doz"],     COMMON_PIPE_BRANDS    
),

MATERIAL( 1, 3, "Junction Box", "जंक्शन बॉक्स", [ FIELD( "conduitSize", "Conduit Size", "कन्ड्यूट साइज", ["20mm", "25mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Normal", "नॉर्मल"],           ["Deep", "डीप"]         ]       ),        FIELD(         "shapeWays",         "Shape / Ways",         "शेप / वेज़",         [           ["1 Way", "1 वे"],           ["2 Way Straight", "2 वे स्ट्रेट"],           ["2 Way Angle", "2 वे एंगल"],           ["3 Way T-Type", "3 वे T-टाइप"],           ["4 Way Cross Type", "4 वे क्रॉस टाइप"],           ["Y/H/U/V-Type", "Y/H/U/V-टाइप"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["PVC", "PVC"],           ["GI Metal", "GI मेटल"]         ]       )     ],     ["pcs", "pkt", "doz"],     [       "Polycab",       "Finolex",       "AKG",       "Precision",       "Local",       "Brand Master"     ]    
),

MATERIAL( 1, 4, "Fan Box", "फैन बॉक्स", [ FIELD( "conduitSize", "Conduit Size", "कन्ड्यूट साइज", ["20mm", "25mm"] ),
 FIELD(         "depth",         "Depth",         "गहराई",         ["2.5\"", "3\""]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["MS Metal", "MS मेटल"],           ["PVC", "PVC"]         ]       ),        FIELD(         "ways",         "Ways",         "वेज़",         ["4 Way", "6 Way", "8 Way"]       ),        FIELD(         "hookRod",         "Hook Rod",         "हुक रॉड",         ["8mm", "10mm"]       )     ],     ["pcs", "pkt", "doz"],     ["Brand Master", "Local"]    
),

MATERIAL( 1, 5, "Concealed Light Box", "कन्सील्ड लाइट बॉक्स", [ FIELD( "diameter", "Diameter", "व्यास", ["3"", "4""] ),
 FIELD(         "depth",         "Depth",         "गहराई",         ["3\"", "3.5\""]       ),        FIELD(         "materialType",         "Material Type",         "मटेरियल टाइप",         [           ["Heavy GI Metal Box", "हेवी GI मेटल बॉक्स"],           ["Heavy PVC Box", "हेवी PVC बॉक्स"]         ]       )     ],     ["pcs", "pkt", "doz"],     ["Brand Master", "Local"]    
),

MATERIAL( 1, 6, "Tape (Shuttering & Joint Sealing)", "टेप (शटरिंग और जॉइंट सीलिंग)", [ FIELD( "width", "Width", "चौड़ाई", [ ["1" (24mm)", "1" (24mm)"], ["1.5" (36mm)", "1.5" (36mm)"], ["2" (48mm)", "2" (48mm)"], ["3" (72mm)", "3" (72mm)"] ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["PVC Joint Tape", "PVC जॉइंट टेप"],           ["BOPP / Shuttering Tape (Brown/Clear)", "BOPP / शटरिंग टेप (ब्राउन/क्लियर)"],           ["Duct Tape", "डक्ट टेप"]         ]       )     ],     ["pcs", "roll", "pkt"],     ["Steelgrip", "Wonder", "Anchor", "Local / Non-Brand"]    
),

MATERIAL( 1, 7, "Solvent Cement", "सॉल्वेंट सीमेंट", [ FIELD( "pack", "Pack", "पैक", ["50ml", "100ml", "250ml", "500ml", "1L"] ) ], ["pcs", "tin", "can"], ["Polycab", "Finolex", "AKG", "Astral", "Local"] ),

MATERIAL( 1, 8, "Neel Powder (Marking Powder)", "नील पाउडर (मार्किंग पाउडर)", [ FIELD( "size", "Size", "साइज", ["100g", "250g", "500g", "1kg"] ) ], ["gm", "kg", "bag", "pkt"], ["Standard", "Local"] ),

MATERIAL( 1, 9, "Binding Wire", "बाइंडिंग वायर", [ FIELD( "gauge", "Gauge", "गेज", ["18 SWG", "20 SWG", "22 SWG"] ) ], ["kg", "mtr", "roll"], ["Tata", "Commercial", "Local"] ),

MATERIAL( 1, 10, "Cable Tie / Zip Tie", "केबल टाई / ज़िप टाई", [ FIELD( "length", "Length", "लंबाई", ["100mm", "150mm", "200mm", "250mm", "300mm", "400mm"] ),
 FIELD(         "colour",         "Colour",         "रंग",         [           ["White", "सफेद"],           ["Black", "काला"]         ]       )     ],     ["pcs", "pkt"],     ["Wonder", "3M", "Local / Non-Brand"]    
) ];

/* ========================================================= STAGE 2 WALL CONDUIT INSTALLATION 7 ITEMS ========================================================= */

const STAGE_2 = [

MATERIAL( 2, 1, "Modular Board", "मॉड्यूलर बोर्ड", [ FIELD( "module", "Module", "मॉड्यूल", [ "2M", "3M", "4M", "6M", "8M Square", "8M Rectangular", "12M", "16M", "18M" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["GI Metal (18/20 Gauge)", "GI मेटल (18/20 गेज)"],           ["PVC", "PVC"]         ]       )     ],     ["Nos", "pcs"],     ["Goldmedal", "Anchor", "Brand Master", "Local"]    
),

MATERIAL( 2, 2, "Pipe", "पाइप", [ FIELD( "size", "Size", "साइज", ["20mm", "25mm", "32mm", "40mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Heavy (HMS)", "हेवी (HMS)"],           ["Medium (MMS)", "मीडियम (MMS)"],           ["Light (LMS)", "लाइट (LMS)"]         ]       )     ],     ["pcs", "bndl", "doz"],     COMMON_PIPE_BRANDS    
),

MATERIAL( 2, 3, "Bend", "बेंड", [ FIELD( "size", "Size", "साइज", ["20mm", "25mm", "32mm", "40mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Heavy", "हेवी"],           ["Medium", "मीडियम"],           ["Light", "लाइट"]         ]       ),        FIELD(         "subType",         "Sub Type",         "उप-प्रकार",         [           ["Short Bend", "शॉर्ट बेंड"],           ["Long Bend", "लॉन्ग बेंड"]         ]       )     ],     ["pcs", "pkt", "doz"],     COMMON_PIPE_BRANDS    
),

MATERIAL( 2, 4, "Junction Box", "जंक्शन बॉक्स", [ FIELD( "conduitSize", "Conduit Size", "कन्ड्यूट साइज", ["20mm", "25mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Normal", "नॉर्मल"],           ["Deep", "डीप"]         ]       ),        FIELD(         "shapeWays",         "Shape / Ways",         "शेप / वेज़",         [           ["1 Way", "1 वे"],           ["2 Way Straight", "2 वे स्ट्रेट"],           ["2 Way Angle", "2 वे एंगल"],           ["3 Way T-Type", "3 वे T-टाइप"],           ["4 Way Cross Type", "4 वे क्रॉस टाइप"],           ["Y/H/U/V-Type", "Y/H/U/V-टाइप"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["PVC", "PVC"],           ["GI Metal", "GI मेटल"]         ]       )     ],     ["pcs", "pkt", "doz"],     [       "Polycab",       "Finolex",       "AKG",       "Precision",       "Local",       "Brand Master"     ]    
),

MATERIAL( 2, 5, "MCB Box (Distribution Board)", "MCB बॉक्स (डिस्ट्रिब्यूशन बोर्ड)", [ FIELD( "size", "Size", "साइज", [ "2 Way", "4 Way", "6 Way", "8 Way", "10 Way", "12 Way", "16 Way", "18 Way", "24 Way" ] ),
 FIELD(         "phase",         "Phase",         "फेज़",         [           ["Single Phase (SPN)", "सिंगल फेज़ (SPN)"],           ["Three Phase (TPN)", "थ्री फेज़ (TPN)"]         ]       ),        FIELD(         "door",         "Door",         "डोर",         [           ["Single", "सिंगल"],           ["Double", "डबल"],           ["Transparent Acrylic", "ट्रांसपेरेंट एक्रेलिक"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["Metal / Sheet Steel (CRCA Powder Coated)", "मेटल / शीट स्टील (CRCA पाउडर कोटेड)"],           ["PVC", "PVC"]         ]       )     ],     ["pcs"],     ["Havells", "Legrand", "Schneider", "L&T", "Anchor", "Local"]    
),

MATERIAL( 2, 6, "Tape (Masking & Plaster Protection)", "टेप (मास्किंग और प्लास्टर प्रोटेक्शन)", [ FIELD( "width", "Width", "चौड़ाई", [ ["1/2" (12mm)", "1/2" (12mm)"], ["1" (24mm)", "1" (24mm)"], ["2" (48mm)", "2" (48mm)"] ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Masking / Paper Tape", "मास्किंग / पेपर टेप"],           ["PVC Insulation Tape", "PVC इंसुलेशन टेप"]         ]       )     ],     ["pcs", "roll", "pkt"],     ["Wonder", "Steelgrip", "Anchor", "Local / Non-Brand"]    
),

MATERIAL( 2, 7, "Cable Clip", "केबल क्लिप", [ FIELD( "size", "Size", "साइज", [ "4mm", "6mm", "8mm", "10mm", "12mm", "14mm", "16mm", "20mm", "25mm", "32mm" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Round Clip (Steel Nail)", "राउंड क्लिप (स्टील नेल)"],           ["Flat Clip (Steel Nail)", "फ्लैट क्लिप (स्टील नेल)"]         ]       )     ],     ["pcs", "pkt"],     ["Standard", "Local"]    
) ];

/* ========================================================= STAGE 3 WIRING INSTALLATION 5 ITEMS ========================================================= */

const STAGE_3 = [

MATERIAL( 3, 1, "Wire", "वायर", [ FIELD( "size", "Size", "साइज", [ "0.75 Sqmm", "1 Sqmm", "1.5 Sqmm", "2.5 Sqmm", "4 Sqmm", "6 Sqmm", "10 Sqmm" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         ["FR", "HRFR", "FRLS", "XLPE"]       ),        FIELD(         "colour",         "Colour",         "रंग",         [           ["Red", "लाल"],           ["Black", "काला"],           ["Yellow", "पीला"],           ["Blue", "नीला"],           ["Green", "हरा"],           ["White", "सफेद"],           ["Grey", "ग्रे"]         ]       )     ],     ["mtr", "bndl"],     [       "Polycab",       "Finolex",       "Havells",       "RR Kabel",       "KEI",       "Anchor",       "Local"     ]    
),

MATERIAL( 3, 2, "Flexible Pipe", "फ्लेक्सिबल पाइप", [ FIELD( "size", "Size", "साइज", ["16mm", "20mm", "25mm", "32mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["PVC Flexible", "PVC फ्लेक्सिबल"],           ["FMC (GI / Steel Metallic)", "FMC (GI / स्टील मेटैलिक)"],           ["LFMC (PVC Coated Liquid-tight)", "LFMC (PVC कोटेड लिक्विड-टाइट)"]         ]       )     ],     ["mtr", "bndl"],     ["AKG", "Precision", "National", "Local"]    
),

MATERIAL( 3, 3, "Electrical Tape", "इलेक्ट्रिकल टेप", [ FIELD( "size", "Size", "साइज", [ "18mm × 7m", "18mm × 8m", "18mm × 10m" ] ),
 FIELD(         "colour",         "Colour",         "रंग",         [           ["Red", "लाल"],           ["Black", "काला"],           ["Yellow", "पीला"],           ["Blue", "नीला"],           ["Green", "हरा"],           ["White", "सफेद"],           ["Grey", "ग्रे"]         ]       )     ],     ["pcs", "bx", "doz"],     ["Steelgrip", "3M", "Wonder", "Anchor", "Local"]    
),

MATERIAL( 3, 4, "Fastener", "फास्टनर", [ FIELD( "size", "Size", "साइज", [ "M4", "M5", "M6", "M8", "M10", "M12", "M16", "M20" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Wedge Anchor Fastener", "वेज एंकर फास्टनर"],           ["Pin Type Anchor", "पिन टाइप एंकर"],           ["Rawl Anchor Bolt", "रॉल एंकर बोल्ट"],           ["Drop In Anchor", "ड्रॉप-इन एंकर"],           ["J Hook Anchor", "J हुक एंकर"],           ["Round Anchor Bolt", "राउंड एंकर बोल्ट"]         ]       )     ],     ["pcs", "bx", "doz"],     ["Hilti", "Fischer", "Standard / Local"]    
),

MATERIAL( 3, 5, "Steel Wire / Spring Wire (Fish Tape)", "स्टील वायर / स्प्रिंग वायर (फिश टेप)", [ FIELD( "diameter", "Diameter", "व्यास", [ "16 SWG (1.6mm)", "18 SWG (1.2mm)", "20 SWG (0.9mm)", "3mm", "4mm", "6mm" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["GI Steel Pulling Wire", "GI स्टील पुलिंग वायर"],           ["Flat Spring Steel Tape", "फ्लैट स्प्रिंग स्टील टेप"],           ["Nylon / Fiberglass Puller", "नायलॉन / फाइबरग्लास पुलर"]         ]       ),        FIELD(         "length",         "Length",         "लंबाई",         ["10m", "15m", "20m", "30m", "50m"]       )     ],     ["kg", "mtr", "pcs", "roll"],     ["Tata (GI)", "Commercial", "Local"]    
) ];

/* ========================================================= STAGE 4 FINAL ELECTRICAL FITTINGS 51 ITEMS ========================================================= */

const STAGE_4 = [

MATERIAL( 4, 1, "Switch Plate", "स्विच प्लेट", [ FIELD( "module", "Module", "मॉड्यूल", [ "1M","2M","3M","4M","6M", "8M Horizontal", "8M Square / Vertical", "12M","16M","18M" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["PVC Modular Plate", "PVC मॉड्यूलर प्लेट"],           ["Acrylic / Mica Plate", "एक्रेलिक / माइका प्लेट"],           ["Glass Plate", "ग्लास प्लेट"],           ["Metal Finish Plate", "मेटल फिनिश प्लेट"]         ]       )     ],     ["pcs"],     STAGE4_SWITCH_BRANDS    
),

MATERIAL( 4, 2, "Switch Board (Surface Gang Box)", "स्विच बोर्ड (सरफेस गैंग बॉक्स)", [ FIELD( "module", "Module", "मॉड्यूल", [ "1M","2M","3M","4M","6M", "8M","12M","16M","18M" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["PVC Surface Gang Box", "PVC सरफेस गैंग बॉक्स"],           ["Wooden Board", "वुडन बोर्ड"]         ]       )     ],     ["pcs"],     ["Anchor","GM","Cona","Local"]    
),

MATERIAL( 4, 3, "Switch", "स्विच", [ FIELD( "amp", "Amp", "एम्प", ["6A","10A","16A","20A","25A"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["1 Way Switch", "1 वे स्विच"],           ["Intermediate Switch", "इंटरमीडिएट स्विच"]         ]       )     ],     ["pcs","bx","doz"],     STAGE4_SWITCH_BRANDS    
),

MATERIAL( 4, 4, "Socket", "सॉकेट", [ FIELD( "amp", "Amp", "एम्प", ["5A","6A","10A","16A","20A","25A"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["2 Pin Socket", "2 पिन सॉकेट"],           ["3 Pin Multi Socket", "3 पिन मल्टी सॉकेट"],           ["6/16A Combined Heavy Socket", "6/16A कंबाइंड हेवी सॉकेट"],           ["10/25A Heavy Socket", "10/25A हेवी सॉकेट"]         ]       )     ],     ["pcs","bx","doz"],     STAGE4_SWITCH_BRANDS    
),

MATERIAL( 4, 5, "Fan Regulator", "फैन रेगुलेटर", [ FIELD( "module", "Module", "मॉड्यूल", ["1M","2M"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Step Regulator (4/5 Steps)", "स्टेप रेगुलेटर (4/5 स्टेप्स)"],           ["Electronic / Stepless", "इलेक्ट्रॉनिक / स्टेपलेस"]         ]       )     ],     ["pcs","bx","doz"],     STAGE4_SWITCH_BRANDS    
),

MATERIAL( 4, 6, "2 Way Switch", "2 वे स्विच", [ FIELD( "amp", "Amp", "एम्प", ["6A","10A","16A","20A"] ) ], ["pcs","bx","doz"], STAGE4_SWITCH_BRANDS ),

MATERIAL( 4, 7, "Bell Push", "बेल पुश", [ FIELD( "amp", "Amp", "एम्प", ["6A","10A"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Standard Bell Push", "स्टैंडर्ड बेल पुश"],           ["Bell Push with Indicator / Nameplate", "इंडिकेटर / नेमप्लेट वाला बेल पुश"]         ]       )     ],     ["pcs","bx","doz"],     ["Legrand","Schneider","Anchor","GM","Havells"]    
),

MATERIAL( 4, 8, "Neon Indicator", "नियॉन इंडिकेटर", [ FIELD( "colour", "Colour", "रंग", [ ["Red","लाल"], ["Green","हरा"], ["Yellow","पीला"], ["Blue","नीला"], ["White","सफेद"] ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["LED Type","LED टाइप"],           ["Neon Tube Type (1M Modular)","नियॉन ट्यूब टाइप (1M मॉड्यूलर)"]         ]       )     ],     ["pcs","bx","doz"],     ["Legrand","Schneider","Anchor","GM","Havells"]    
),

MATERIAL( 4, 9, "Blank Plate / Dummy Switch", "ब्लैंक प्लेट / डमी स्विच", [ FIELD( "type", "Type", "प्रकार", [ ["Modular Blank Insert","मॉड्यूलर ब्लैंक इंसर्ट"], ["Dummy Plate","डमी प्लेट"] ] ),
 FIELD(         "module",         "Module",         "मॉड्यूल",         ["1M","2M"]       )     ],     ["pcs","bx","doz"],     STAGE4_SWITCH_BRANDS    
),

MATERIAL( 4, 10, "DP Switch", "DP स्विच", [ FIELD( "amp", "Amp", "एम्प", ["16A","20A","25A","32A","40A","63A"] ) ], ["pcs","bx","doz"], STAGE4_SWITCH_BRANDS ),

MATERIAL( 4, 11, "Mini MCB", "मिनी MCB", [ FIELD( "amp", "Amp", "एम्प", ["6A","10A","16A","20A","25A","32A"] ),
 FIELD(         "curve",         "Curve",         "कर्व",         ["C Curve"]       ),        FIELD(         "module",         "Module",         "मॉड्यूल",         ["1M","2M"]       )     ],     ["pcs","bx"],     ["Legrand","Schneider","Havells","GM","Anchor"]    
),

MATERIAL( 4, 12, "SP MCB", "SP MCB", [ FIELD( "amp", "Amp", "एम्प", [ "0.5A","1A","1.6A","2A","3A","4A", "6A","8A","10A","13A","16A","20A", "25A","32A","40A","50A","63A" ] ),
 FIELD(         "curve",         "Curve",         "कर्व",         ["B","C","D"]       )     ],     ["pcs","bx"],     ["Legrand","Schneider","Havells","L&T","Siemens","ABB"]    
),

MATERIAL( 4, 13, "DP MCB", "DP MCB", [ FIELD( "amp", "Amp", "एम्प", ["6A","10A","16A","20A","25A","32A","40A","50A","63A"] ),
 FIELD(         "curve",         "Curve",         "कर्व",         ["B","C","D"]       )     ],     ["pcs","bx"],     ["Legrand","Schneider","Havells","L&T","Siemens","ABB"]    
),

MATERIAL( 4, 14, "TPN MCB", "TPN MCB", [ FIELD( "amp", "Amp", "एम्प", ["16A","20A","25A","32A","40A","50A","63A"] ),
 FIELD(         "curve",         "Curve",         "कर्व",         ["B","C","D"]       )     ],     ["pcs","bx"],     ["Legrand","Schneider","Havells","L&T","Siemens","ABB"]    
),

MATERIAL( 4, 15, "MCB Changeover", "MCB चेंजओवर", [ FIELD( "amp", "Amp", "एम्प", ["16A","25A","32A","40A","63A","80A","100A","125A"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Manual (DP/4P MCB Type)","मैनुअल (DP/4P MCB टाइप)"],           ["Automatic (ATS)","ऑटोमैटिक (ATS)"]         ]       )     ],     ["pcs","bx"],     ["Havells","Legrand","L&T","Schneider","HPL"]    
),

MATERIAL( 4, 16, "DP Isolator", "DP आइसोलेटर", [ FIELD( "amp", "Amp", "एम्प", ["16A","20A","25A","32A","40A","63A","80A","100A","125A"] ) ], ["pcs","bx"], ["Legrand","Schneider","Havells","L&T","ABB"] ),

MATERIAL( 4, 17, "TPN Isolator (3P/4P)", "TPN आइसोलेटर (3P/4P)", [ FIELD( "amp", "Amp", "एम्प", ["16A","20A","25A","32A","40A","63A","80A","100A","125A"] ) ], ["pcs","bx"], ["Legrand","Schneider","Havells","L&T","ABB"] ),

MATERIAL( 4, 18, "RCCB / RCD", "RCCB / RCD", [ FIELD( "amp", "Amp", "एम्प", ["25A","40A","63A","80A","100A"] ),
 FIELD(         "sensitivity",         "Sensitivity",         "सेंसिटिविटी",         ["30mA","100mA","300mA"]       ),        FIELD(         "type",         "Type",         "प्रकार",         ["AC","A"]       )     ],     ["pcs","bx"],     ["Legrand","Schneider","Havells","L&T","Siemens"]    
),

MATERIAL( 4, 19, "MCB Box", "MCB बॉक्स", [ FIELD( "size", "Size", "साइज", [ "2 Way","4 Way","6 Way","8 Way","10 Way", "12 Way","16 Way","18 Way","24 Way" ] ),
 FIELD(         "door",         "Door",         "डोर",         [           ["Single","सिंगल"],           ["Double","डबल"],           ["Transparent Acrylic","ट्रांसपेरेंट एक्रेलिक"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["Sheet Steel (CRCA)","शीट स्टील (CRCA)"],           ["PVC","PVC"]         ]       )     ],     ["pcs"],     ["Havells","Legrand","Schneider","L&T","Standard / Local"]    
),

MATERIAL( 4, 20, "Kit Kat Fuse", "किट कैट फ्यूज", [ FIELD( "amp", "Amp", "एम्प", ["5A","10A","15A","20A","25A","30A","40A","50A","60A","80A","100A"] ),
 FIELD(         "voltage",         "Voltage",         "वोल्टेज",         [           ["250V Single Phase","250V सिंगल फेज़"],           ["415V Three Phase","415V थ्री फेज़"]         ]       )     ],     ["pcs"],     ["Anchor","Havells","Commercial / Local"]    
),

MATERIAL( 4, 21, "Fan Sheet", "फैन शीट", [ FIELD( "type", "Type", "प्रकार", [ ["PVC Round Plate","PVC राउंड प्लेट"], ["Acrylic / Mica Plate","एक्रेलिक / माइका प्लेट"] ] ) ], ["pcs","pkt","doz"], ["Standard / Local"] ),

MATERIAL( 4, 22, "Round Sheet", "राउंड शीट", [ FIELD( "type", "Type", "प्रकार", [ ["PVC Junction Cover Sheet","PVC जंक्शन कवर शीट"], ["Mica Sheet","माइका शीट"] ] ) ], ["pcs","pkt","doz"], ["Standard / Local"] ),

MATERIAL( 4, 23, "Fan Rod", "फैन रॉड", [ FIELD( "length", "Length", "लंबाई", [ "9"","12"","15"","18"","24"", "30"","36"","42"","48"" ] ) ], ["pcs"], ["Orient","Crompton","Havells","Heavy GI Local"] ),

MATERIAL( 4, 24, "Fan Clamp", "फैन क्लैंप", [ FIELD( "type", "Type", "प्रकार", [ ["Heavy MS Clamp","हेवी MS क्लैंप"], ["Normal Z-Clamp / U-Clamp","नॉर्मल Z-क्लैंप / U-क्लैंप"] ] ) ], ["pcs"], ["Standard / Local"] ),

MATERIAL( 4, 25, "Holder", "होल्डर", [ FIELD( "type", "Type", "प्रकार", [ ["Batten Holder (Straight)","बैटन होल्डर (स्ट्रेट)"], ["Angle Holder","एंगल होल्डर"] ] ),
 FIELD(         "material",         "Material",         "मटेरियल",         [           ["Polycarbonate with Brass / Ceramic Thread","पॉलीकार्बोनेट विद ब्रास / सिरेमिक थ्रेड"]         ]       )     ],     ["pcs","bx","doz"],     ["Anchor","GM","Cona","Havells","Local"]    
),

MATERIAL( 4, 26, "Ceiling Rose", "सीलिंग रोज़", [ FIELD( "type", "Type", "प्रकार", ["2 Plate","3 Plate"] ) ], ["pcs","bx","doz"], ["Anchor","GM","Cona","Havells","Local"] ),

MATERIAL( 4, 27, "Chain", "चेन", [ TEXT_FIELD( "length", "Length", "लंबाई" ),
 FIELD(         "material",         "Material",         "मटेरियल",         [           ["GI Steel Link","GI स्टील लिंक"],           ["Decorative Brass / Antique Finish","डेकोरेटिव ब्रास / एंटीक फिनिश"]         ]       )     ],     ["inch","ft"],     ["Standard Metal / Local"]    
),

MATERIAL( 4, 28, "LED Bulb", "LED बल्ब", [ FIELD( "wattage", "Wattage", "वॉटेज", ["3W","5W","7W","9W","12W","15W","20W"] ),
 FIELD(         "base",         "Base",         "बेस",         ["B22","E27"]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         [           ["Warm 3000K","वार्म 3000K"],           ["Neutral 4000K","न्यूट्रल 4000K"],           ["Cool 6500K","कूल 6500K"]         ]       )     ],     ["pcs"],     ["Philips","Havells","Syska","Wipro","Crompton","Halonix"]    
),

MATERIAL( 4, 29, "LED Tube Light", "LED ट्यूब लाइट", [ FIELD( "length", "Length", "लंबाई", ["2ft","4ft"] ),
 FIELD(         "wattage",         "Wattage",         "वॉटेज",         ["10W","20W","40W","50W"]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs","bx"],     ["Philips","Havells","Syska","Wipro","Crompton"]    
),

MATERIAL( 4, 30, "Foot Light", "फुट लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["3W","6W","12W"] ),
 FIELD(         "mounting",         "Mounting",         "माउंटिंग",         [           ["Recessed / Concealed","रीसेस्ड / कन्सील्ड"],           ["Surface","सरफेस"]         ]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs"],     ["GM","Legrand","Philips","Havells","Local"]    
),

MATERIAL( 4, 31, "Up Down Light", "अप डाउन लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["3W × 2 (6W)","5W × 2 (10W)","10W","12W"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Indoor Wall Light","इंडोर वॉल लाइट"],           ["Outdoor Waterproof IP65","आउटडोर वॉटरप्रूफ IP65"]         ]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs"],     ["Philips","Havells","Jaquar","Local Architectural"]    
),

MATERIAL( 4, 32, "Panel Light", "पैनल लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["6W","8W","12W","15W","18W","22W","24W","36W"] ),
 FIELD(         "mounting",         "Mounting",         "माउंटिंग",         [           ["Recessed / Concealed","रीसेस्ड / कन्सील्ड"],           ["Surface","सरफेस"]         ]       ),        FIELD(         "shape",         "Shape",         "शेप",         ["Round","Square"]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs"],     ["Philips","Havells","Wipro","Syska","Crompton"]    
),

MATERIAL( 4, 33, "Surface Light", "सरफेस लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["6W","12W","15W","18W","22W","24W"] ),
 FIELD(         "shape",         "Shape",         "शेप",         ["Round","Square"]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs"],     ["Philips","Havells","Wipro","Syska","Crompton"]    
),

MATERIAL( 4, 34, "COB Light", "COB लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["3W","5W","7W","10W","12W","15W","18W","20W","30W"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Recessed / Concealed","रीसेस्ड / कन्सील्ड"],           ["Surface","सरफेस"],           ["Anti-Glare","एंटी-ग्लेयर"]         ]       ),        FIELD(         "shape",         "Shape",         "शेप",         ["Round","Square"]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs"],     ["Philips","Havells","Jaquar","Luker","Local"]    
),

MATERIAL( 4, 35, "COB Spot Light", "COB स्पॉट लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["2W","3W","5W","7W","10W","12W","15W"] ),
 FIELD(         "mounting",         "Mounting",         "माउंटिंग",         [           ["Deep Recessed / Anti-Glare","डीप रीसेस्ड / एंटी-ग्लेयर"],           ["Surface Mount","सरफेस माउंट"]         ]       ),        FIELD(         "movement",         "Movement",         "मूवमेंट",         [           ["Fixed","फिक्स्ड"],           ["Swivel / Gimbal","स्विवेल / गिम्बल"]         ]       ),        FIELD(         "beam",         "Beam",         "बीम",         [           ["Narrow 15–24°","नैरो 15–24°"],           ["Wide 36–60°","वाइड 36–60°"]         ]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       ),        FIELD(         "body",         "Body",         "बॉडी",         [           ["Full White","फुल व्हाइट"],           ["White + Black Ring","व्हाइट + ब्लैक रिंग"],           ["Full Black","फुल ब्लैक"],           ["Rose Gold","रोज़ गोल्ड"],           ["Chrome","क्रोम"]         ]       )     ],     ["pcs","bx"],     ["Philips","Havells","Jaquar","Local Architectural"]    
),

MATERIAL( 4, 36, "Down Light", "डाउन लाइट", [ FIELD( "wattage", "Wattage", "वॉटेज", ["3W","5W","7W","10W","12W","15W","18W","22W","24W"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Recessed / Concealed","रीसेस्ड / कन्सील्ड"],           ["Surface","सरफेस"]         ]       ),        FIELD(         "shape",         "Shape",         "शेप",         ["Round","Square"]       ),        FIELD(         "colourTemp",         "Colour Temp",         "कलर टेम्परेचर",         ["3000K","4000K","6500K"]       )     ],     ["pcs"],     ["Philips","Havells","Jaquar","Local"]    
),

MATERIAL( 4, 37, "Strip Light", "स्ट्रिप लाइट", [ FIELD( "density", "Density", "डेंसिटी", ["60 LED/m","120 LED/m","240 LED/m"] ),
 FIELD(         "voltage",         "Voltage",         "वोल्टेज",         ["12V DC","24V DC"]       ),        FIELD(         "length",         "Length",         "लंबाई",         ["5m Roll","10m Roll"]       ),        FIELD(         "colour",         "Colour",         "रंग",         [           ["Warm White","वार्म व्हाइट"],           ["Cool White","कूल व्हाइट"],           ["Natural White","नेचुरल व्हाइट"],           ["Red","लाल"],           ["Blue","नीला"],           ["Green","हरा"],           ["Pink","पिंक"],           ["RGB","RGB"]         ]       )     ],     ["roll"],     ["Philips","Havells","GM","Wipro","Commercial"]    
),

MATERIAL( 4, 38, "Rope Light", "रोप लाइट", [ FIELD( "supply", "Supply", "सप्लाई", ["AC220V","DC12V","DC24V"] ),
 FIELD(         "colour",         "Colour",         "रंग",         [           ["Warm White","वार्म व्हाइट"],           ["Cool White","कूल व्हाइट"],           ["Red","लाल"],           ["Green","हरा"],           ["Blue","नीला"],           ["Yellow / Amber","पीला / एम्बर"],           ["Pink","पिंक"],           ["Purple","पर्पल"],           ["Ice Blue","आइस ब्लू"],           ["Orange","ऑरेंज"],           ["RGB","RGB"]         ]       ),        TEXT_FIELD(         "length",         "Length",         "लंबाई"       )     ],     ["mtr","roll"],     ["Philips","Havells","Syska","Commercial / Local"]    
),

MATERIAL( 4, 39, "LED Profile Channel", "LED प्रोफाइल चैनल", [ FIELD( "dimensions", "Dimensions", "डायमेंशन", [ "17×8mm", "17×14mm", "24×10mm", "35×20mm", "16×16mm" ] ),
 FIELD(         "mounting",         "Mounting",         "माउंटिंग",         [           ["Concealed (Flanged / Winged)","कन्सील्ड (फ्लैन्ज्ड / विंग्ड)"],           ["Surface","सरफेस"],           ["Corner V","कॉर्नर V"],           ["Hanging","हैंगिंग"]         ]       ),        FIELD(         "length",         "Length",         "लंबाई",         ["1m","2m","3m"]       ),        FIELD(         "diffuser",         "Diffuser",         "डिफ्यूज़र",         [           ["Milky White","मिल्की व्हाइट"],           ["Smoked Black","स्मोक्ड ब्लैक"]         ]       )     ],     ["pcs","mtr"],     ["Stanjo","Philips","Architectural Aluminum","Local"]    
),

MATERIAL( 4, 40, "LED Strip Driver (SMPS)", "LED स्ट्रिप ड्राइवर (SMPS)", [ FIELD( "wattage", "Wattage", "वॉटेज", [ "36W (3A)", "60W (5A)", "120W (10A)", "150W (12.5A)", "200W (16.6A)", "250W (20A)", "300W (25A)", "400W (33A)" ] ),
 FIELD(         "output",         "Output",         "आउटपुट",         ["12V DC","24V DC"]       ),        FIELD(         "type",         "Type",         "प्रकार",         [           ["Ultra-Slim Profile Driver","अल्ट्रा-स्लिम प्रोफाइल ड्राइवर"],           ["Metal Mesh SMPS","मेटल मेश SMPS"],           ["Rainproof Outdoor IP67","रेनप्रूफ आउटडोर IP67"],           ["Plastic Adapter","प्लास्टिक एडाप्टर"]         ]       )     ],     ["pcs"],     ["Mean Well","Philips","GM","Havells","Standard Electronic"]    
),

MATERIAL( 4, 41, "Door Bell", "डोर बेल", [ FIELD( "type", "Type", "प्रकार", [ ["Ding Dong Mechanical","डिंग डॉन्ग मैकेनिकल"], ["Polyphonic / Multi-Tune Musical","पॉलीफोनिक / मल्टी-ट्यून म्यूजिकल"], ["Wireless Remote","वायरलेस रिमोट"] ] ),
 FIELD(         "voltage",         "Voltage",         "वोल्टेज",         [           ["220V AC","220V AC"],           ["Battery Operated DC","बैटरी ऑपरेटेड DC"]         ]       )     ],     ["pcs"],     ["Anchor","GM","Cona","Havells","Goldmedal"]    
),

MATERIAL( 4, 42, "Electrical Tape", "इलेक्ट्रिकल टेप", [ FIELD( "size", "Size", "साइज", [ "18mm × 7m", "18mm × 8m", "18mm × 10m" ] ),
 FIELD(         "colour",         "Colour",         "रंग",         [           ["Red","लाल"],           ["Black","काला"],           ["Yellow","पीला"],           ["Blue","नीला"],           ["Green","हरा"],           ["White","सफेद"],           ["Grey","ग्रे"]         ]       )     ],     ["pcs","bx","doz"],     ["Steelgrip","3M","Wonder","Anchor","Local"]    
),

MATERIAL( 4, 43, "Tape (Mounting / Double Sided)", "टेप (माउंटिंग / डबल साइडेड)", [ FIELD( "width", "Width", "चौड़ाई", ["1/2"","1"","2""] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Double Sided Acrylic Foam Tape","डबल साइडेड एक्रेलिक फोम टेप"],           ["Paper Masking Tape","पेपर मास्किंग टेप"]         ]       )     ],     ["pcs","roll"],     ["3M","Wonder","Local"]    
),

MATERIAL( 4, 44, "Instant Glue", "इंस्टेंट ग्लू", [ FIELD( "weight", "Weight", "वजन", ["0.5g","1g","2g","3g","20g"] ) ], ["pcs"], ["Fevikwik","Quick Fix","Local"] ),

MATERIAL( 4, 45, "Araldite Glue (Epoxy)", "अरालडाइट ग्लू (एपॉक्सी)", [ FIELD( "pack", "Pack", "पैक", ["10g","36g","90g","180g"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Standard Slow Setting","स्टैंडर्ड स्लो सेटिंग"],           ["Fast & Clear Quick Setting","फास्ट एंड क्लियर क्विक सेटिंग"]         ]       )     ],     ["pcs","pkt"],     ["Araldite (Huntsman)"]    
),

MATERIAL( 4, 46, "POP", "POP", [ FIELD( "weight", "Weight", "वजन", ["1kg","2kg","5kg","20kg","40kg"] ) ], ["kg","bag","pkt"], ["Sakarni","JK Lakshmi","Birla White","Local"] ),

MATERIAL( 4, 47, "Putty Blade / Patta", "पुट्टी ब्लेड / पट्टा", [ FIELD( "size", "Size", "साइज", ["2"","3"","4"","5"","6""] ) ], ["pcs"], ["Standard Steel","Local"] ),

MATERIAL( 4, 48, "Fastener", "फास्टनर", [ FIELD( "size", "Size", "साइज", ["M4","M5","M6","M8","M10","M12","M16","M20"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Wedge Anchor","वेज एंकर"],           ["Pin Type","पिन टाइप"],           ["Rawl Anchor Bolt","रॉल एंकर बोल्ट"],           ["Drop In Anchor","ड्रॉप-इन एंकर"],           ["J Hook Anchor","J हुक एंकर"]         ]       )     ],     ["pcs","bx","doz"],     ["Hilti","Fischer","Local MS/GI"]    
),

MATERIAL( 4, 49, "Screw", "स्क्रू", [ FIELD( "diameter", "Diameter", "व्यास", [ "2.2mm","2.9mm","3.5mm","3.9mm", "4.2mm","4.8mm","5.5mm","6.3mm" ] ),
 FIELD(         "length",         "Length",         "लंबाई",         [           "6.5mm","8mm","9.5mm","13mm",           "16mm","19mm","22mm","25mm",           "32mm","38mm","45mm","50mm",           "63mm","75mm"         ]       ),        FIELD(         "type",         "Type",         "प्रकार",         [           ["Self Tapping","सेल्फ टैपिंग"],           ["Self Drilling Pan / CSK","सेल्फ ड्रिलिंग पैन / CSK"]         ]       )     ],     ["pkt (100 pcs/pkt)","box"],     ["Standard GI / Hardened Steel"]    
),

MATERIAL( 4, 50, "Lug", "लग", [ FIELD( "size", "Size", "साइज", [ "1.5×M4", "1.5×M5", "2.5×M4", "2.5×M5", "4×M6", "6×M6", "10×M6", "10×M8", "16×M8", "25×M10", "35×M10", "50×M12", "70×M12", "95×M12", "120×M12", "150×M12", "185×M12", "240×M12" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Ring","रिंग"],           ["Pin","पिन"],           ["Fork / Spade","फोर्क / स्पेड"],           ["Butt Connector","बट कनेक्टर"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["Copper","कॉपर"],           ["Aluminium","एल्युमिनियम"],           ["Bimetallic AL-CU","बाइमेटैलिक AL-CU"]         ]       )     ],     ["pcs","pkt","box"],     ["Dowells","Comet","Brand Master","Local"]    
),

MATERIAL( 4, 51, "Washer", "वॉशर", [ FIELD( "size", "Size", "साइज", ["M4","M5","M6","M8","M10","M12","M16","M20"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Plain Flat","प्लेन फ्लैट"],           ["Spring","स्प्रिंग"],           ["Star / Internal Tooth","स्टार / इंटरनल टूथ"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         ["MS","GI","SS304","Brass"]       )     ],     ["pcs","pkt","gm","kg"],     ["Standard","Local"]    
) ];

/* ========================================================= STAGE 5 FALSE CEILING WIRING MATERIAL 16 ITEMS ========================================================= */

const STAGE_5 = [

MATERIAL( 5, 1, "Wire", "वायर", [ FIELD( "size", "Size", "साइज", ["0.75 Sqmm","1 Sqmm","1.5 Sqmm","2.5 Sqmm","4 Sqmm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         ["FR","FRLS"]       ),        FIELD(         "colour",         "Colour",         "रंग",         [           ["Red","लाल"],           ["Black","काला"],           ["Yellow","पीला"],           ["Blue","नीला"],           ["Green","हरा"],           ["White","सफेद"]         ]       )     ],     ["mtr","bndl"],     ["Polycab","Finolex","Havells","RR Kabel","KEI","Local"]    
),

MATERIAL( 5, 2, "Electrical Tape", "इलेक्ट्रिकल टेप", [ FIELD( "size", "Size", "साइज", ["18mm × 7m","18mm × 8m","18mm × 10m"] ),
 FIELD(         "colour",         "Colour",         "रंग",         [           ["Red","लाल"],           ["Black","काला"],           ["Yellow","पीला"],           ["Blue","नीला"],           ["Green","हरा"],           ["White","सफेद"],           ["Grey","ग्रे"]         ]       )     ],     ["pcs","bx"],     ["Steelgrip","3M","Wonder","Local"]    
),

MATERIAL( 5, 3, "Flexible Pipe", "फ्लेक्सिबल पाइप", [ FIELD( "size", "Size", "साइज", ["16mm","20mm","25mm","32mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["PVC Flexible","PVC फ्लेक्सिबल"],           ["FMC GI Steel Metallic","FMC GI स्टील मेटैलिक"]         ]       )     ],     ["mtr","bndl"],     ["AKG","Precision","National","Local"]    
),

MATERIAL( 5, 4, "Pipe", "पाइप", [ FIELD( "size", "Size", "साइज", ["20mm","25mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Medium (MMS)","मीडियम (MMS)"],           ["Light (LMS)","लाइट (LMS)"],           ["Heavy (HMS)","हेवी (HMS)"]         ]       )     ],     ["pcs","bndl"],     ["Polycab","Finolex","AKG","Precision","Local"]    
),

MATERIAL( 5, 5, "Bend", "बेंड", [ FIELD( "size", "Size", "साइज", ["20mm","25mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Medium","मीडियम"],           ["Light","लाइट"]         ]       ),        FIELD(         "subType",         "Sub Type",         "उप-प्रकार",         [           ["Short Bend","शॉर्ट बेंड"],           ["Long Bend","लॉन्ग बेंड"]         ]       )     ],     ["pcs","pkt"],     ["Polycab","Finolex","AKG","Precision","Local"]    
),

MATERIAL( 5, 6, "Junction Box", "जंक्शन बॉक्स", [ FIELD( "conduitSize", "Conduit Size", "कन्ड्यूट साइज", ["20mm","25mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Normal","नॉर्मल"],           ["Deep","डीप"]         ]       ),        FIELD(         "shapeWays",         "Shape / Ways",         "शेप / वेज़",         [           ["1 Way","1 वे"],           ["2 Way Straight","2 वे स्ट्रेट"],           ["2 Way Angle","2 वे एंगल"],           ["3 Way T","3 वे T"],           ["4 Way Cross","4 वे क्रॉस"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["PVC","PVC"],           ["GI Metal","GI मेटल"]         ]       )     ],     ["pcs","pkt"],     ["Polycab","Finolex","AKG","Precision","Local"]    
),

MATERIAL( 5, 7, "Cable Tie", "केबल टाई", [ FIELD( "length", "Length", "लंबाई", ["100mm","150mm","200mm","250mm","300mm"] ),
 FIELD(         "colour",         "Colour",         "रंग",         [           ["White","सफेद"],           ["Black","काला"]         ]       )     ],     ["pcs","pkt"],     ["Wonder","3M","Local"]    
),

MATERIAL( 5, 8, "Cable Clip", "केबल क्लिप", [ FIELD( "size", "Size", "साइज", [ "4mm","6mm","8mm","10mm", "12mm","14mm","16mm","20mm" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Round Clip with Nail","राउंड क्लिप विद नेल"],           ["Flat Clip with Nail","फ्लैट क्लिप विद नेल"]         ]       )     ],     ["pcs","pkt"],     ["Standard","Local"]    
),

MATERIAL( 5, 9, "Saddle", "सैडल", [ FIELD( "size", "Size", "साइज", ["20mm","25mm","32mm"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Half Saddle / Open","हाफ सैडल / ओपन"],           ["Full Saddle with Base","फुल सैडल विद बेस"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         [           ["GI Steel","GI स्टील"],           ["PVC","PVC"]         ]       )     ],     ["pcs","pkt"],     ["Standard","Local"]    
),

MATERIAL( 5, 10, "Fastener", "फास्टनर", [ FIELD( "size", "Size", "साइज", ["M6","M8","M10"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Drop In Anchor","ड्रॉप-इन एंकर"],           ["Pin Type Anchor","पिन टाइप एंकर"],           ["Wedge Anchor","वेज एंकर"]         ]       )     ],     ["pcs","bx"],     ["Hilti","Fischer","Local"]    
),

MATERIAL( 5, 11, "PVC Wall Plug / Gulli / Gitti", "PVC वॉल प्लग / गुल्ली / गिट्टी", [ FIELD( "size", "Size", "साइज", [ "No.4 (30mm)", "No.5 (35mm)", "No.6 (40mm)", "No.8 (40mm)", "No.10 (40mm)" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         ["Standard Ribbed PVC Plug"]       )     ],     ["pkt","bx"],     ["Standard","Local"]    
),

MATERIAL( 5, 12, "Screw", "स्क्रू", [ FIELD( "size", "Size", "साइज", [ "3.5×19mm", "3.5×25mm", "3.5×32mm", "3.5×38mm", "4.2×25mm", "4.2×38mm", "4.2×50mm" ] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Drywall / Gypsum Black","ड्रायवॉल / जिप्सम ब्लैक"],           ["Self Drilling Pan / Star","सेल्फ ड्रिलिंग पैन / स्टार"]         ]       )     ],     ["pkt (100 pcs/pkt)","box"],     ["Standard","Local"]    
),

MATERIAL( 5, 13, "Washer", "वॉशर", [ FIELD( "size", "Size", "साइज", ["M6","M8","M10"] ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Plain Flat","प्लेन फ्लैट"],           ["Spring","स्प्रिंग"]         ]       ),        FIELD(         "material",         "Material",         "मटेरियल",         ["MS","GI","SS"]       )     ],     ["pcs","pkt","gm","kg"],     ["Standard","Local"]    
),

MATERIAL( 5, 14, "Fan Rod", "फैन रॉड", [ FIELD( "length", "Length", "लंबाई", [ "9"","12"","15"","18"","24"", "30"","36"","42"","48"" ] ) ], ["pcs"], ["Orient","Crompton","Havells","Heavy GI Local"] ),

MATERIAL( 5, 15, "Fan Clamp", "फैन क्लैंप", [ FIELD( "type", "Type", "प्रकार", [ ["Heavy Duty Z-Clamp","हेवी ड्यूटी Z-क्लैंप"], ["U-Clamp","U-क्लैंप"], ["Threaded Rod Anchor Clamp","थ्रेडेड रॉड एंकर क्लैंप"] ] ) ], ["pcs"], ["Standard","Local"] ),

MATERIAL( 5, 16, "Chain", "चेन", [ TEXT_FIELD( "length", "Length", "लंबाई" ),
 FIELD(         "type",         "Type",         "प्रकार",         [           ["Heavy GI Welded Link","हेवी GI वेल्डेड लिंक"],           ["Decorative Link Chain","डेकोरेटिव लिंक चेन"]         ]       )     ],     ["ft","inch"],     ["Standard","Local"]    
) ];

/* ========================================================= FINAL MASTER LIST ========================================================= */

const MATERIALS = [ ...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4, ...STAGE_5 ];

/* ========================================================= LANGUAGE FUNCTIONS ========================================================= */

function materialText(value, lang = MATERIAL_LANG) {

if (value === null || value === undefined) { return ""; }

if (typeof value === "string") { return value; }

return ( value[lang] ?? value.en ?? value.hi ?? "" ); }

function getMaterialLanguage() { return MATERIAL_LANG; }

function setMaterialLanguage(lang) {

if (!["hi", "en"].includes(lang)) { return MATERIAL_LANG; }

MATERIAL_LANG = lang;

localStorage.setItem( MATERIAL_LANG_KEY, MATERIAL_LANG );

document.documentElement.lang = MATERIAL_LANG === "hi" ? "hi" : "en";

document.dispatchEvent( new CustomEvent( "material-language-change", { detail: { lang: MATERIAL_LANG } } ) );

return MATERIAL_LANG; }

function toggleMaterialLanguage() {

return setMaterialLanguage( MATERIAL_LANG === "hi" ? "en" : "hi" ); }

function getUIText(key) {

return UI_TEXT[MATERIAL_LANG]?.[key] ?? UI_TEXT.en[key] ?? key; }

/* ========================================================= MATERIAL ACCESS FUNCTIONS ========================================================= */

function getMaterial(id) {

return MATERIALS.find( material => material.id === id ) || null; }

function getMaterialByStageAndNo(stage, no) {

return MATERIALS.find( material => material.stage === Number(stage) && material.no === Number(no) ) || null; }

function getMaterialsByStage(stage) {

return MATERIALS.filter( material => material.stage === Number(stage) ); }

function getStage(stage) {

return MATERIAL_STAGES.find( item => item.id === Number(stage) ) || null; }

function getMaterialField(materialId, fieldKey) {

const material = getMaterial(materialId);

if (!material) { return null; }

return material.fields.find( field => field.key === fieldKey ) || null; }

/* ========================================================= FIELD HELPERS ========================================================= */

function getFieldLabel(field) {

return materialText( field?.label ); }

function getOptionLabel(option) {

return materialText( option ); }

function isQuantityRequired(materialId) {

const field = getMaterialField( materialId, "quantity" );

return field?.required === true; }

function getSelectableFields(materialId) {

const material = getMaterial(materialId);

if (!material) { return []; }

return material.fields; }

/* ========================================================= PRICE ========================================================= */

/* Price intentionally remains: price: "" priceVisible: false

Later config.js can enable it.

This function makes sure blank price never appears accidentally. */

function isPriceVisible(materialId) {

const material = getMaterial(materialId);

if (!material) { return false; }

return ( material.priceVisible === true && String(material.price || "").trim() !== "" ); }

/* ========================================================= VALIDATION ========================================================= */

function validateMaterialData(materialId, values = {}) {

const material = getMaterial(materialId);

if (!material) { return { valid: false, missing: ["material"] }; }

const missing = [];

const quantity = values.quantity;

if ( quantity === undefined || quantity === null || String(quantity).trim() === "" || Number(quantity) <= 0 ) { missing.push("quantity"); }

return { valid: missing.length === 0, missing }; }

/* ========================================================= ESTIMATE DATA CLEANING ========================================================= */

/* Empty optional fields are allowed.

Quantity must remain filled.

This function removes undefined values but DOES NOT reject blank optional fields. */

function cleanMaterialValues(values = {}) {

const cleaned = {};

Object.keys(values).forEach(key => {
const value = values[key];      if (       value !== undefined &&       value !== null     ) {       cleaned[key] = value;     }     
});

return cleaned; }

/* ========================================================= EXPORT ========================================================= */

window.MaterialData = {

stages: MATERIAL_STAGES,

materials: MATERIALS,

uiText: UI_TEXT,

get language() { return MATERIAL_LANG; },

getLanguage: getMaterialLanguage,

setLanguage: setMaterialLanguage,

toggleLanguage: toggleMaterialLanguage,

text: materialText,

ui: getUIText,

getMaterial,

getMaterialByStageAndNo,

getMaterialsByStage,

getStage,

getMaterialField,

getFieldLabel,

getOptionLabel,

getSelectableFields,

isQuantityRequired,

isPriceVisible,

validate: validateMaterialData,

cleanValues: cleanMaterialValues

};

/* ========================================================= GLOBAL SHORTCUTS ========================================================= */

window.setMaterialLanguage = setMaterialLanguage;

window.getMaterialLanguage = getMaterialLanguage;

window.toggleMaterialLanguage = toggleMaterialLanguage;

/* ========================================================= INITIAL HTML LANGUAGE ========================================================= */

document.documentElement.lang = MATERIAL_LANG === "hi" ? "hi" : "en";

/* ========================================================= MASTER LIST CHECK ========================================================= */

const EXPECTED_MATERIAL_COUNT = 89;

if (MATERIALS.length !== EXPECTED_MATERIAL_COUNT) {

console.error( Material Master List Error: Expected ${EXPECTED_MATERIAL_COUNT}, found ${MATERIALS.length} );

} else {

console.info( "Sandeep ElectroFix Material Master loaded successfully:", ${MATERIALS.length}/89 items );

}

/* ========================================================= STAGE COUNT CHECK ========================================================= */

const EXPECTED_STAGE_COUNTS = { 1: 10, 2: 7, 3: 5, 4: 51, 5: 16 };

Object.keys(EXPECTED_STAGE_COUNTS).forEach(stageId => {

const actual = getMaterialsByStage(stageId).length;

const expected = EXPECTED_STAGE_COUNTS[stageId];

if (actual !== expected) {
console.error(       Stage ${stageId} Error: Expected ${expected}, found ${actual}    );    
}

});
