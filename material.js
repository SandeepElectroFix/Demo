"use strict";

/*
============================================================
MATERIAL MASTER
STAGE 1
============================================================
*/


const MATERIAL_CONFIG = {

  stage1: {

    id: 1,

    no: "STAGE 01",

    name: {

      en: "Slab Conduit Installation",

      hi: "स्लैब कन्ड्यूट इंस्टॉलेशन"

    },


    materials: [


      /*
      ======================================================
      PIPE
      ======================================================
      */

      {

        id: "pipe",

        name: {

          en: "Pipe",

          hi: "पाइप"

        },


        /*
        Put image path here later.
        Example:
        image: "assets/materials/pipe.png"
        */

        image: "",


        flow: [

          "size",

          "type",

          "quantity",

          "unit",

          "brand"

        ],


        options: {

          size: [

            {
              value: "20mm",

              label: {
                en: "20mm",
                hi: "20mm"
              }
            },

            {
              value: "25mm",

              label: {
                en: "25mm",
                hi: "25mm"
              }
            },

            {
              value: "32mm",

              label: {
                en: "32mm",
                hi: "32mm"
              }
            },

            {
              value: "40mm",

              label: {
                en: "40mm",
                hi: "40mm"
              }
            }

          ],


          type: [

            {
              value: "Heavy",

              label: {
                en: "Heavy",
                hi: "हेवी"
              }
            },

            {
              value: "Medium",

              label: {
                en: "Medium",
                hi: "मीडियम"
              }
            },

            {
              value: "Light",

              label: {
                en: "Light",
                hi: "लाइट"
              }
            }

          ],


          unit: [

            {
              value: "pcs",

              label: {
                en: "pcs",
                hi: "पीस"
              }
            },

            {
              value: "bndl",

              label: {
                en: "bndl",
                hi: "बंडल"
              }
            },

            {
              value: "doz",

              label: {
                en: "doz",
                hi: "दर्जन"
              }
            }

          ],


          brand: [

            {
              value: "Polycab",

              label: {
                en: "Polycab",
                hi: "Polycab"
              }
            },

            {
              value: "Finolex",

              label: {
                en: "Finolex",
                hi: "Finolex"
              }
            },

            {
              value: "Havells",

              label: {
                en: "Havells",
                hi: "Havells"
              }
            },

            {
              value: "AKG",

              label: {
                en: "AKG",
                hi: "AKG"
              }
            },

            {
              value: "Precision",

              label: {
                en: "Precision",
                hi: "Precision"
              }
            },

            {
              value: "Other Brand",

              label: {
                en: "Other Brand",
                hi: "अन्य ब्रांड"
              }
            },

            {
              value: "Non Brand",

              label: {
                en: "Non Brand",
                hi: "बिना ब्रांड"
              }
            }

          ]

        }

      },


      /*
      ======================================================
      BEND
      ======================================================
      */

      {

        id: "bend",

        name: {

          en: "Bend",

          hi: "बेंड"

        },


        image: "",


        flow: [

          "size",

          "type",

          "subType",

          "quantity",

          "unit",

          "brand"

        ],


        options: {

          size: [

            {
              value: "20mm",
              label: {
                en: "20mm",
                hi: "20mm"
              }
            },

            {
              value: "25mm",
              label: {
                en: "25mm",
                hi: "25mm"
              }
            },

            {
              value: "32mm",
              label: {
                en: "32mm",
                hi: "32mm"
              }
            },

            {
              value: "40mm",
              label: {
                en: "40mm",
                hi: "40mm"
              }
            }

          ],


          type: [

            {
              value: "Heavy",
              label: {
                en: "Heavy",
                hi: "हेवी"
              }
            },

            {
              value: "Medium",
              label: {
                en: "Medium",
                hi: "मीडियम"
              }
            },

            {
              value: "Light",
              label: {
                en: "Light",
                hi: "लाइट"
              }
            }

          ],


          subType: [

            {
              value: "Short Bend",
              label: {
                en: "Short Bend",
                hi: "शॉर्ट बेंड"
              }
            },

            {
              value: "Long Bend",
              label: {
                en: "Long Bend",
                hi: "लॉन्ग बेंड"
              }
            }

          ],


          unit: [

            {
              value: "pcs",
              label: {
                en: "pcs",
                hi: "पीस"
              }
            },

            {
              value: "pkt",
              label: {
                en: "pkt",
                hi: "पैकेट"
              }
            },

            {
              value: "doz",
              label: {
                en: "doz",
                hi: "दर्जन"
              }
            }

          ],


          brand: [

            {
              value: "Polycab",
              label: {
                en: "Polycab",
                hi: "Polycab"
              }
            },

            {
              value: "Finolex",
              label: {
                en: "Finolex",
                hi: "Finolex"
              }
            },

            {
              value: "Havells",
              label: {
                en: "Havells",
                hi: "Havells"
              }
            },

            {
              value: "AKG",
              label: {
                en: "AKG",
                hi: "AKG"
              }
            },

            {
              value: "Precision",
              label: {
                en: "Precision",
                hi: "Precision"
              }
            },

            {
              value: "Other Brand",
              label: {
                en: "Other Brand",
                hi: "अन्य ब्रांड"
              }
            },

            {
              value: "Non Brand",
              label: {
                en: "Non Brand",
                hi: "बिना ब्रांड"
              }
            }

          ]

        }

      },


      /*
      ======================================================
      JUNCTION BOX
      ======================================================
      */

      {

        id: "junctionBox",

        name: {

          en: "Junction Box",

          hi: "जंक्शन बॉक्स"

        },


        image: "",


        flow: [

          "conduitSize",

          "type",

          "shape",

          "material",

          "quantity",

          "unit",

          "brand"

        ],


        options: {

          conduitSize: [

            {
              value: "20mm",
              label: {
                en: "20mm",
                hi: "20mm"
              }
            },

            {
              value: "25mm",
              label: {
                en: "25mm",
                hi: "25mm"
              }
            },

            {
              value: "32mm",
              label: {
                en: "32mm",
                hi: "32mm"
              }
            },

            {
              value: "40mm",
              label: {
                en: "40mm",
                hi: "40mm"
              }
            }

          ],


          type: [

            {
              value: "Normal",
              label: {
                en: "Normal",
                hi: "नॉर्मल"
              }
            },

            {
              value: "Deep",
              label: {
                en: "Deep",
                hi: "डीप"
              }
            }

          ],


          shape: [

            {
              value: "1 Way",
              label: {
                en: "1 Way",
                hi: "1 वे"
              }
            },

            {
              value: "2 Way Straight",
              label: {
                en: "2 Way Straight",
                hi: "2 वे स्ट्रेट"
              }
            },

            {
              value: "2 Way Angle",
              label: {
                en: "2 Way Angle",
                hi: "2 वे एंगल"
              }
            },

            {
              value: "3 Way T-Type",
              label: {
                en: "3 Way T-Type",
                hi: "3 वे T-टाइप"
              }
            },

            {
              value: "4 Way Cross Type",
              label: {
                en: "4 Way Cross Type",
                hi: "4 वे क्रॉस टाइप"
              }
            },

            {
              value: "Y/H/U/V",
              label: {
                en: "Y / H / U / V",
                hi: "Y / H / U / V"
              }
            }

          ],


          material: [

            {
              value: "PVC",
              label: {
                en: "PVC",
                hi: "PVC"
              }
            },

            {
              value: "GI Metal",
              label: {
                en: "GI Metal",
                hi: "GI मेटल"
              }
            }

          ],


          unit: [

            {
              value: "pcs",
              label: {
                en: "pcs",
                hi: "पीस"
              }
            },

            {
              value: "pkt",
              label: {
                en: "pkt",
                hi: "पैकेट"
              }
            },

            {
              value: "doz",
              label: {
                en: "doz",
                hi: "दर्जन"
              }
            }

          ],


          brand: [

            {
              value: "Polycab",
              label: {
                en: "Polycab",
                hi: "Polycab"
              }
            },

            {
              value: "Finolex",
              label: {
                en: "Finolex",
                hi: "Finolex"
              }
            },

            {
              value: "Havells",
              label: {
                en: "Havells",
                hi: "Havells"
              }
            },

            {
              value: "AKG",
              label: {
                en: "AKG",
                hi: "AKG"
              }
            },

            {
              value: "Precision",
              label: {
                en: "Precision",
                hi: "Precision"
              }
            },

            {
              value: "Other Brand",
              label: {
                en: "Other Brand",
                hi: "अन्य ब्रांड"
              }
            },

            {
              value: "Non Brand",
              label: {
                en: "Non Brand",
                hi: "बिना ब्रांड"
              }
            }

          ]

        }

      }

    ]

  }

};


/*
============================================================
FIELD LABELS
============================================================
*/

const MATERIAL_FIELD_LABELS = {

  size: {

    en: "Size",

    hi: "आकार"

  },


  conduitSize: {

    en: "Conduit Size",

    hi: "कन्ड्यूट आकार"

  },


  type: {

    en: "Type",

    hi: "प्रकार"

  },


  subType: {

    en: "Sub Type",

    hi: "उप प्रकार"

  },


  shape: {

    en: "Shape / Ways",

    hi: "शेप / वे"

  },


  material: {

    en: "Material",

    hi: "मटेरियल"

  },


  quantity: {

    en: "Quantity",

    hi: "मात्रा"

  },


  unit: {

    en: "Unit",

    hi: "इकाई"

  },


  brand: {

    en: "Brand",

    hi: "ब्रांड"

  }

};
