window.MATERIAL_CONFIG = {

  brands:[
    "Polycab",
    "Finolex",
    "Havells",
    "AKG",
    "Precision",
    "Other Brand",
    "Non Brand"
  ],

  stage1:[

    {
      id:"pipe",

      name:"Pipe",

      image:"",

      flow:[
        "size",
        "type",
        "qty",
        "unit",
        "brand"
      ],

      sizes:[
        "20mm",
        "25mm",
        "32mm",
        "40mm"
      ],

      types:[
        "Heavy",
        "Medium",
        "Light"
      ],

      units:[
        "pcs",
        "bndl",
        "doz"
      ]
    },


    {
      id:"bend",

      name:"Bend",

      image:"",

      flow:[
        "size",
        "type",
        "subtype",
        "qty",
        "unit",
        "brand"
      ],

      sizes:[
        "20mm",
        "25mm",
        "32mm",
        "40mm"
      ],

      types:[
        "Heavy",
        "Medium",
        "Light"
      ],

      subtypes:[
        "Short Bend",
        "Long Bend"
      ],

      units:[
        "pcs",
        "pkt",
        "doz"
      ]
    },


    {
      id:"junction-box",

      name:"Junction Box",

      image:"",

      flow:[
        "size",
        "type",
        "shape",
        "material",
        "qty",
        "unit",
        "brand"
      ],

      sizes:[
        "20mm",
        "25mm",
        "32mm",
        "40mm"
      ],

      types:[
        "Normal",
        "Deep"
      ],

      shapes:[
        "1 Way",
        "2 Way Straight",
        "2 Way Angle",
        "3 Way T-Type",
        "4 Way Cross Type",
        "Y/H/U/V"
      ],

      materials:[
        "PVC",
        "GI Metal"
      ],

      units:[
        "pcs",
        "pkt",
        "doz"
      ]
    }

  ]

};
