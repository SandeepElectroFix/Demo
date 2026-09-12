"use strict";

/*
=========================================================
SANDEEP ELECTROFIX
ESTIMATE LIST
MATERIAL MASTER
=========================================================

FLOW:

Material
→ Type
→ Size
→ Quantity
→ Unit
→ Brand

Material-specific options ONLY यहाँ रहेंगे.

पुरानी/duplicate List यहाँ दोबारा add नहीं करनी.
=========================================================
*/


const EN = value => ({
  en: value,
  hi: value
});


const MATERIAL_LIST = [

  /* =====================================================
     STAGE 1
     SLAB CONDUIT INSTALLATION
  ===================================================== */

  {
    id: "stage-1",

    name: {
      en: "Slab Conduit Installation",
      hi: "स्लैब कंड्यूट इंस्टॉलेशन"
    },

    materials: [

      {
        id: "pipe",

        name: {
          en: "Pipe",
          hi: "पाइप"
        },

        image: "assets/materials/pipe.png",

        options: {

          type: [
            {
              en: "Heavy",
              hi: "हेवी"
            },
            {
              en: "Medium",
              hi: "मीडियम"
            },
            {
              en: "Light",
              hi: "लाइट"
            }
          ],

          size: [
            EN("20mm"),
            EN("25mm"),
            EN("32mm"),
            EN("40mm")
          ]

        }

      },

      {
        id: "pipe-accessories",

        name: {
          en: "Pipe Accessories",
          hi: "पाइप एक्सेसरीज"
        },

        image: "assets/materials/pipe-accessories.png",

        options: {

          type: [
            EN("Bend"),
            EN("Junction"),
            EN("Coupler")
          ],

          size: [
            EN("20mm"),
            EN("25mm"),
            EN("32mm"),
            EN("40mm")
          ]

        }

      }

    ]

  },


  /* =====================================================
     STAGE 2
     WALL CONDUIT
  ===================================================== */

  {
    id: "stage-2",

    name: {
      en: "Wall Conduit",
      hi: "वॉल कंड्यूट"
    },

    materials: [

      {
        id: "pvc-board",

        name: {
          en: "PVC Board",
          hi: "पी. वी. सी. बोर्ड"
        },

        image: "assets/materials/pvc-board.png",

        options: {

          size: [
            EN("2M"),
            EN("4M"),
            EN("6M"),
            EN("8M"),
            EN("10M"),
            EN("12M"),
            EN("14M"),
            EN("16M"),
            EN("18M")
          ]

        }

      },

      {
        id: "gi-board",

        name: {
          en: "GI Board",
          hi: "जी. आई. बोर्ड"
        },

        image: "assets/materials/gi-board.png",

        options: {

          size: [
            EN("2M"),
            EN("4M"),
            EN("6M"),
            EN("8M"),
            EN("10M"),
            EN("12M"),
            EN("14M"),
            EN("16M"),
            EN("18M")
          ]

        }

      }

    ]

  },


  /* =====================================================
     STAGE 3
     WIRING
  ===================================================== */

  {
    id: "stage-3",

    name: {
      en: "Wiring",
      hi: "वायरिंग"
    },

    materials: [

      {
        id: "wire",

        name: {
          en: "Wire",
          hi: "वायर"
        },

        image: "assets/materials/wire.png",

        options: {

          type: [
            EN("FR"),
            EN("HRFR"),
            EN("FRLS"),
            EN("XLPE")
          ],

          size: [
            EN("0.75 Sqmm"),
            EN("1 Sqmm"),
            EN("1.5 Sqmm"),
            EN("2.5 Sqmm"),
            EN("4 Sqmm"),
            EN("6 Sqmm"),
            EN("10 Sqmm")
          ],

          colour: [
            EN("Red"),
            EN("Yellow"),
            EN("Blue"),
            EN("Green"),
            EN("Black"),
            EN("White"),
            EN("Grey")
          ]

        }

      },

      {
        id: "steel-wire",

        name: {
          en: "Steel Wire",
          hi: "स्टील वायर"
        },

        image: "assets/materials/steel-wire.png",

        options: {

          size: []

        }

      }

    ]

  },


  /* =====================================================
     STAGE 4
     FINAL ELECTRICAL FITTINGS
  ===================================================== */

  {
    id: "stage-4",

    name: {
      en: "Final Electrical Fittings",
      hi: "फाइनल इलेक्ट्रिकल फिटिंग्स"
    },

    materials: [

      {
        id: "modular-switch",

        name: {
          en: "Modular Switch",
          hi: "मॉड्यूलर स्विच"
        },

        image: "assets/materials/modular-switch.png",

        options: {

          type: [
            EN("1 Way"),
            EN("2 Way"),
            EN("Bell Push"),
            EN("16A")
          ],

          rating: [
            EN("6A"),
            EN("10A"),
            EN("16A")
          ]

        }

      },

      {
        id: "socket",

        name: {
          en: "Socket",
          hi: "सॉकेट"
        },

        image: "assets/materials/socket.png",

        options: {

          rating: [
            EN("6A"),
            EN("16A")
          ]

        }

      },

      {
        id: "mcb",

        name: {
          en: "MCB",
          hi: "एम. सी. बी."
        },

        image: "assets/materials/mcb.png",

        options: {

          type: [
            EN("SP"),
            EN("DP"),
            EN("TP"),
            EN("TPN")
          ],

          rating: [
            EN("6A"),
            EN("10A"),
            EN("16A"),
            EN("20A"),
            EN("25A"),
            EN("32A"),
            EN("40A"),
            EN("63A")
          ],

          curve: [
            EN("B"),
            EN("C"),
            EN("D")
          ]

        }

      },

      {
        id: "rccb",

        name: {
          en: "RCCB",
          hi: "आर. सी. सी. बी."
        },

        image: "assets/materials/rccb.png",

        options: {

          type: [
            EN("DP"),
            EN("4P")
          ],

          rating: [
            EN("25A"),
            EN("40A"),
            EN("63A")
          ],

          sensitivity: [
            EN("30mA"),
            EN("100mA"),
            EN("300mA")
          ]

        }

      },

      {
        id: "rcbo",

        name: {
          en: "RCBO",
          hi: "आर. सी. बी. ओ."
        },

        image: "assets/materials/rcbo.png",

        options: {

          rating: [
            EN("6A"),
            EN("10A"),
            EN("16A"),
            EN("20A"),
            EN("25A"),
            EN("32A")
          ]

        }

      },

      {
        id: "led",

        name: {
          en: "LED Light",
          hi: "एल. ई. डी. लाइट"
        },

        image: "assets/materials/led.png",

        options: {

          wattage: [
            EN("5W"),
            EN("7W"),
            EN("9W"),
            EN("12W"),
            EN("15W"),
            EN("18W"),
            EN("20W"),
            EN("24W")
          ]

        }

      }

    ]

  },


  /* =====================================================
     STAGE 5
     FALSE CEILING WIRING MATERIAL
  ===================================================== */

  {
    id: "stage-5",

    name: {
      en: "False Ceiling Wiring Material",
      hi: "फॉल्स सीलिंग वायरिंग मटेरियल"
    },

    materials: [

      {
        id: "ceiling-wire",

        name: {
          en: "Ceiling Wire",
          hi: "सीलिंग वायर"
        },

        image: "assets/materials/ceiling-wire.png",

        options: {

          size: [
            EN("0.75 Sqmm"),
            EN("1 Sqmm"),
            EN("1.5 Sqmm"),
            EN("2.5 Sqmm")
          ],

          colour: [
            EN("Red"),
            EN("Yellow"),
            EN("Blue"),
            EN("Green"),
            EN("Black"),
            EN("White"),
            EN("Grey")
          ]

        }

      },

      {
        id: "ceiling-junction-box",

        name: {
          en: "Junction Box",
          hi: "जंक्शन बॉक्स"
        },

        image: "assets/materials/junction-box.png",

        options: {

          size: [
            EN("2 Way"),
            EN("3 Way"),
            EN("4 Way"),
            EN("6 Way")
          ]

        }

      }

    ]

  }

];


/*
=========================================================
GLOBAL ACCESS
=========================================================
*/

window.MATERIAL_LIST = MATERIAL_LIST;
