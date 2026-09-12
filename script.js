(()=>{
'use strict';

/* =========================================================
   Sandeep ElectroFix — Estimate List
   CORRECTED APP CONTROLLER
   ========================================================= */

const STORE='sandeepEstimateItems';
const LANG='sandeepMaterialLang';
const VIEW='sandeepMaterialView';
const THEME='sandeepTheme';


/* =========================================================
   STAGES
   ========================================================= */

const STAGES=[
    {
        id:1,
        no:'STAGE 01',
        en:'Slab Conduit Installation',
        hi:'स्लैब कन्ड्यूट इंस्टॉलेशन'
    },
    {
        id:2,
        no:'STAGE 02',
        en:'Wall Conduit Installation',
        hi:'वॉल कन्ड्यूट इंस्टॉलेशन'
    },
    {
        id:3,
        no:'STAGE 03',
        en:'Wiring Installation',
        hi:'वायरिंग इंस्टॉलेशन'
    },
    {
        id:4,
        no:'STAGE 04',
        en:'Final Electrical Fittings',
        hi:'फाइनल इलेक्ट्रिकल फिटिंग्स'
    },
    {
        id:5,
        no:'STAGE 05',
        en:'False Ceiling Wiring',
        hi:'फॉल्स सीलिंग वायरिंग'
    }
];


/* =========================================================
   LABELS
   ========================================================= */

const LABELS={
    type:['Type','प्रकार'],
    subType:['Sub Type','उप प्रकार'],
    size:['Size','साइज'],
    shape:['Shape','आकार'],
    material:['Material','मटेरियल'],
    conduitSize:['Conduit Size','कन्ड्यूट साइज'],
    ways:['Ways','वे'],
    depth:['Depth','गहराई'],
    hookRod:['Hook Rod','हुक रॉड'],
    module:['Module','मॉड्यूल'],
    door:['Door','डोर'],
    phase:['Phase','फेज'],
    amp:['Amp','एम्पियर'],
    colour:['Colour','कलर'],
    voltage:['Voltage','वोल्टेज'],
    sensitivity:['Sensitivity','सेंसिटिविटी'],
    base:['Base','बेस'],
    wattage:['Wattage','वाटेज'],
    length:['Length','लंबाई'],
    mounting:['Mounting','माउंटिंग'],
    ledDensity:['LED Density','एलईडी डेंसिटी'],
    supply:['Supply','सप्लाई'],
    ipRating:['IP Rating','आईपी रेटिंग'],
    structure:['Structure','स्ट्रक्चर'],
    diameter:['Diameter','डायमीटर'],
    cableSize:['Cable Size','केबल साइज'],
    studSize:['Stud Size','स्टड साइज'],
    quantity:['Quantity','मात्रा'],
    unit:['Unit','यूनिट'],
    brand:['Brand','ब्रांड'],
    rate:['Rate','रेट']
};


/* =========================================================
   SAFE STORAGE
   ========================================================= */

function safeGet(key, fallback=''){

    try{

        const value=localStorage.getItem(key);

        return value===null ? fallback : value;

    }catch(error){

        console.warn('localStorage read error:',key,error);

        return fallback;

    }

}


function safeSet(key,value){

    try{

        localStorage.setItem(key,value);

        return true;

    }catch(error){

        console.error('localStorage write error:',key,error);

        return false;

    }

}


function loadEstimate(){

    try{

        const raw=localStorage.getItem(STORE);

        if(!raw) return [];

        const parsed=JSON.parse(raw);

        return Array.isArray(parsed) ? parsed : [];

    }catch(error){

        console.warn(
            'Invalid saved estimate. Starting empty.',
            error
        );

        return [];

    }

}


/* =========================================================
   APP STATE
   ========================================================= */

let lang=safeGet(LANG,'en');
let view=safeGet(VIEW,'grid');

let estimate=loadEstimate();

let stage=1;
let current=null;
let currentIndex=-1;

let state={};
let carry={};


/* =========================================================
   HELPERS
   ========================================================= */

const $=selector=>document.querySelector(selector);

const $$=selector=>[
    ...document.querySelectorAll(selector)
];


function save(){

    safeSet(
        STORE,
        JSON.stringify(estimate)
    );

}


function txt(value){

    if(
        value &&
        typeof value==='object'
    ){

        return (
            value[lang] ??
            value.en ??
            value.hi ??
            ''
        );

    }

    return String(value ?? '');

}


function money(value){

    return '₹'+Number(value||0).toFixed(2);

}


function esc(value){

    return String(value??'').replace(
        /[&<>"']/g,
        character=>({

            '&':'&amp;',
            '<':'&lt;',
            '>':'&gt;',
            '"':'&quot;',
            "'":'&#39;'

        }[character])
    );

}


function activate(element){

    if(!element) return;

    $$('.neon-active').forEach(item=>{
        item.classList.remove('neon-active');
    });

    element.classList.add('neon-active');

}


function label(key){

    return (
        LABELS[key] ||
        [key,key]
    )[lang==='hi' ? 1 : 0];

}


function stageObj(){

    return (
        STAGES.find(item=>item.id===stage) ||
        STAGES[0]
    );

}


function fallback(name){

    return 'data:image/svg+xml;charset=UTF-8,'+
        encodeURIComponent(`

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 330"
            >

                <rect
                    width="500"
                    height="330"
                    fill="#07111b"
                />

                <circle
                    cx="250"
                    cy="135"
                    r="62"
                    fill="none"
                    stroke="#0ea5e9"
                    stroke-width="7"
                />

                <path
                    d="M250 73l-25 70h34l-22 73 61-94h-37z"
                    fill="#facc15"
                />

                <text
                    x="250"
                    y="290"
                    text-anchor="middle"
                    fill="#7ea8bb"
                    font-family="Arial"
                    font-size="20"
                >
                    ${esc(name)}
                </text>

            </svg>

        `);

}


/* =========================================================
   CONFIG HELPERS
   ========================================================= */

function visible(key){

    return (
        typeof APP_CONFIG!=='undefined' &&
        APP_CONFIG.selection &&
        APP_CONFIG.selection[key]!==false
    );

}


function show(element,on){

    if(!element) return;

    element.style.display=
        on ? '' : 'none';

}


/* =========================================================
   CONFIG
   ========================================================= */

function applyConfig(){

    if(typeof APP_CONFIG==='undefined'){

        throw new Error(
            'APP_CONFIG is not loaded. Check config.js.'
        );

    }


    show(
        $('.topbar'),
        APP_CONFIG.home?.header!==false
    );


    show(
        $('#menuBtn'),
        APP_CONFIG.home?.menu!==false
    );


    show(
        $('#langBtn'),
        APP_CONFIG.home?.language!==false
    );


    show(
        $('#globalSearchBox'),
        APP_CONFIG.home?.search!==false
    );


    show(
        $('[data-ui="homeStages"]'),
        APP_CONFIG.home?.stages!==false
    );


    show(
        $('#materialSearchBox'),
        APP_CONFIG.materials?.search!==false
    );


    show(
        $('#viewSwitcher'),
        APP_CONFIG.materials?.materialView!==false
    );


    [
        ['navHome','home'],
        ['navEstimate','estimate'],
        ['navCalculator','calculator'],
        ['navSettings','settings']
    ].forEach(([ui,key])=>{

        show(
            $(`[data-ui="${ui}"]`),
            APP_CONFIG.navigation?.[key]!==false
        );

    });


    show(
        $('#nextMaterial'),
        APP_CONFIG.selection?.nextMaterial!==false
    );


    show(
        $('#addEstimate'),
        APP_CONFIG.selection?.addEstimate!==false
    );


    show(
        $('#copyEstimate'),
        APP_CONFIG.estimate?.copyEstimate!==false
    );


    show(
        $('#printEstimate'),
        APP_CONFIG.estimate?.printEstimate!==false
    );


    show(
        $('#shareEstimate'),
        APP_CONFIG.estimate?.shareEstimate!==false
    );

}


/* =========================================================
   STAGES
   ========================================================= */

function renderStages(){

    const grid=$('#stageGrid');

    if(!grid) return;


    grid.innerHTML='';


    if(typeof MATERIALS==='undefined'){

        throw new Error(
            'MATERIALS is not loaded. Check material.js.'
        );

    }


    const count=MATERIALS.filter(
        item=>item.enabled
    ).length;


    const counter=$('#materialCount');

    if(counter){

        counter.textContent=
            count+
            ' '+
            (
                lang==='hi'
                ? 'मटेरियल'
                : 'materials'
            );

    }


    STAGES.forEach(s=>{

        const materials=MATERIALS.filter(
            item=>
                item.enabled &&
                item.stage===s.id
        );


        if(!materials.length) return;


        const button=document.createElement('button');

        button.type='button';

        button.className='stage-card';


        button.innerHTML=`

            <span class="stage-no">
                ${s.no}
            </span>

            <h3>
                ${txt(s)}
            </h3>

            <p>
                ${materials.length}
                ${lang==='hi'?'मटेरियल':'materials'}
                • Select to open
            </p>

        `;


        button.addEventListener('click',()=>{

            activate(button);

            openStage(s.id);

        });


        grid.appendChild(button);

    });

}


/* =========================================================
   PAGE
   ========================================================= */

function page(id){

    $$('.page').forEach(p=>{

        p.classList.toggle(
            'active',
            p.id===id
        );

    });


    $$('#bottomNav button').forEach(button=>{

        button.classList.toggle(
            'active',
            button.dataset.page===id
        );

    });


    if(id==='estimatePage'){

        renderEstimate();

    }


    if(id==='settingsPage'){

        renderSettings();

    }


    if(id==='calculatorPage'){

        renderCalc('power');

    }

}


/* =========================================================
   OPEN STAGE
   ========================================================= */

function openStage(id){

    stage=id;


    const obj=stageObj();


    const stageLabel=$('#stageLabel');

    const stageTitle=$('#stageTitle');


    if(stageLabel){

        stageLabel.textContent=obj.no;

    }


    if(stageTitle){

        stageTitle.textContent=txt(obj);

    }


    const search=$('#materialSearch');

    if(search){

        search.value='';

    }


    renderMaterials();

    page('materialsPage');

}


/* =========================================================
   MATERIALS
   ========================================================= */

function renderMaterials(){

    const grid=$('#materialGrid');

    if(!grid) return;


    const search=$('#materialSearch');

    const query=(
        search?.value ||
        ''
    ).trim().toLowerCase();


    grid.className=
        'material-grid '+
        view;


    grid.innerHTML='';


    MATERIALS
        .filter(item=>{

            if(!item.enabled) return false;

            if(item.stage!==stage) return false;

            if(!query) return true;

            return txt(item.name)
                .toLowerCase()
                .includes(query);

        })
        .forEach(material=>{

            const button=
                document.createElement('button');

            button.type='button';

            button.className='material-card';


            let html='';


            if(
                APP_CONFIG.materials?.materialImage!==false
            ){

                html+=`

                    <div class="material-image">

                        <img
                            src="${fallback(
                                txt(material.name)
                            )}"
                            alt=""
                        >

                    </div>

                `;

            }


            if(
                APP_CONFIG.materials?.materialName!==false
            ){

                html+=`

                    <div class="material-name">

                        ${esc(
                            txt(material.name)
                        )}

                    </div>

                `;

            }


            button.innerHTML=html;


            button.addEventListener('click',()=>{

                activate(button);

                openMaterial(material);

            });


            grid.appendChild(button);

        });

}


/* =========================================================
   OPTION COMPATIBILITY
   ========================================================= */

function compatible(material,key,value){

    if(
        value===undefined ||
        value===null ||
        value===''
    ){

        return false;

    }


    const options=
        material.options?.[key];


    if(!Array.isArray(options)){

        return false;

    }


    return options.some(option=>

        String(txt(option))===
        String(txt(value))

    );

}


/* =========================================================
   CARRY
   ========================================================= */

function carryInto(material){

    const result={};


    Object.entries(carry).forEach(
        ([key,value])=>{

            if(key==='quantity') return;

            if(
                compatible(
                    material,
                    key,
                    value
                )
            ){

                result[key]=value;

            }

        }
    );


    return result;

}


/* =========================================================
   OPEN MATERIAL
   ========================================================= */

function openMaterial(material){

    current=material;


    const list=MATERIALS.filter(
        item=>
            item.enabled &&
            item.stage===material.stage
    );


    currentIndex=list.findIndex(
        item=>item.id===material.id
    );


    state=carryInto(material);


    const stageText=$('#sheetStage');
    const title=$('#sheetTitle');
    const sub=$('#sheetSub');


    if(stageText){

        stageText.textContent=
            stageObj().no;

    }


    if(title){

        title.textContent=
            txt(material.name);

    }


    if(sub){

        sub.textContent=
            lang==='hi'
            ? 'सभी विकल्प एक ही जगह चुनें'
            : 'Select all options in one place';

    }


    const sheet=$('#sheetBackdrop');

    if(sheet){

        sheet.classList.add('open');

    }


    renderOptions();

}


/* =========================================================
   RENDER OPTIONS
   ========================================================= */

function renderOptions(){

    const area=$('#optionArea');

    if(!area || !current) return;


    area.innerHTML='';


    (current.flow||[]).forEach(key=>{

        if(
            current.flowConfig?.[key]?.show===false
        ){

            return;

        }


        if(!visible(key)){

            return;

        }


        /* -----------------------------------------
           QUANTITY / RATE
           ----------------------------------------- */

        if(
            key==='quantity' ||
            key==='rate'
        ){

            const field=
                document.createElement('div');

            field.className='field';


            field.innerHTML=`

                <div class="field-label">
                    ${label(key)}
                </div>

                <input
                    id="field-${key}"
                    class="input-field"
                    type="number"
                    min="0"
                    step="any"
                    inputmode="decimal"
                    placeholder="${
                        key==='rate'
                        ? 'Optional — leave blank for ₹0'
                        : 'Enter quantity'
                    }"
                    value="${esc(
                        state[key] ?? ''
                    )}"
                >

            `;


            area.appendChild(field);


            const input=
                field.querySelector('input');


            if(input){

                input.addEventListener(
                    'input',
                    event=>{

                        state[key]=
                            event.target.value;

                    }
                );


                input.addEventListener(
                    'change',
                    event=>{

                        state[key]=
                            event.target.value;

                    }
                );

            }


            return;

        }


        /* -----------------------------------------
           NORMAL OPTIONS
           ----------------------------------------- */

        const values=
            (current.options?.[key]||[])
            .filter(value=>
                current.optionConfig?.[key]?.[value]
                    ?.show!==false
            );


        if(!values.length) return;


        const field=
            document.createElement('div');

        field.className='field';


        field.innerHTML=`

            <div class="field-label">
                ${label(key)}
            </div>

        `;


        const row=
            document.createElement('div');

        row.className='option-row';


        values.forEach(value=>{

            const button=
                document.createElement('button');

            button.type='button';


            button.className=
                'option-btn'+
                (
                    String(state[key])===
                    String(value)
                    ? ' selected'
                    : ''
                );


            button.textContent=
                txt(value);


            button.addEventListener(
                'click',
                event=>{

                    event.preventDefault();

                    activate(button);

                    state[key]=value;

                    renderOptions();

                }
            );


            row.appendChild(button);

        });


        field.appendChild(row);

        area.appendChild(field);

    });


    /* -----------------------------------------
       Keep quantity focused if needed
       ----------------------------------------- */

}


/* =========================================================
   READ CURRENT INPUTS
   ========================================================= */

function syncInputs(){

    const quantity=
        $('#field-quantity');

    const rate=
        $('#field-rate');


    if(quantity){

        state.quantity=
            quantity.value;

    }


    if(rate){

        state.rate=
            rate.value;

    }

}


/* =========================================================
   ADD TO ESTIMATE
   ========================================================= */

function add(){

    /* -----------------------------------------
       Material check
       ----------------------------------------- */

    if(!current){

        alert(
            lang==='hi'
            ? 'पहले Material चुनें।'
            : 'Please select a material.'
        );

        return;

    }


    /* -----------------------------------------
       IMPORTANT:
       Read inputs directly before adding
       ----------------------------------------- */

    syncInputs();


    /* -----------------------------------------
       Quantity
       ----------------------------------------- */

    const quantityValue=
        state.quantity;


    const qty=
        Number(quantityValue);


    if(
        quantityValue===undefined ||
        quantityValue===null ||
        String(quantityValue).trim()==='' ||
        !Number.isFinite(qty) ||
        qty<=0
    ){

        alert(
            lang==='hi'
            ? 'कृपया Quantity भरें।'
            : 'Please enter Quantity.'
        );


        const quantityInput=
            $('#field-quantity');


        if(quantityInput){

            quantityInput.focus();

        }


        return;

    }


    /* -----------------------------------------
       Rate
       ----------------------------------------- */

    let rate=0;


    if(
        state.rate!==undefined &&
        state.rate!==null &&
        String(state.rate).trim()!==''
    ){

        rate=Number(state.rate);


        if(!Number.isFinite(rate)){

            rate=0;

        }

    }


    /* -----------------------------------------
       Clean selections
       ----------------------------------------- */

    const selections={};


    Object.entries(state).forEach(
        ([key,value])=>{

            if(
                value!==undefined &&
                value!==null &&
                String(value)!==''
            ){

                selections[key]=value;

            }

        }
    );


    selections.quantity=qty;
    selections.rate=rate;


    /* -----------------------------------------
       CREATE ESTIMATE ITEM
       ----------------------------------------- */

    const item={

        id:
            Date.now()+
            '-' +
            Math.random()
                .toString(36)
                .slice(2),

        materialId:
            current.id,

        name:
            current.name,

        selections:
            selections,

        qty:
            qty,

        unit:
            state.unit || '',

        rate:
            rate,

        amount:
            qty*rate

    };


    /* -----------------------------------------
       PUSH
       ----------------------------------------- */

    estimate.push(item);


    /* -----------------------------------------
       SAVE
       ----------------------------------------- */

    save();


    /* -----------------------------------------
       CARRY SELECTIONS
       ----------------------------------------- */

    carry={
        ...state
    };


    carry.quantity='';
    carry.rate='';


    /* -----------------------------------------
       CLOSE
       ----------------------------------------- */

    closeSheet();


    /* -----------------------------------------
       REFRESH ESTIMATE
       ----------------------------------------- */

    renderEstimate();


    /* -----------------------------------------
       SUCCESS
       ----------------------------------------- */

    alert(
        lang==='hi'
        ? '✓ Material Estimate में add हो गया।'
        : '✓ Material added to Estimate.'
    );

}


/* =========================================================
   NEXT MATERIAL
   IMPORTANT: DOES NOT ADD TO ESTIMATE
   ========================================================= */

function next(){

    if(!current) return;


    syncInputs();


    const list=MATERIALS.filter(
        item=>
            item.enabled &&
            item.stage===current.stage
    );


    carry={
        ...state
    };


    carry.quantity='';
    carry.rate='';


    if(
        currentIndex+1<
        list.length
    ){

        openMaterial(
            list[currentIndex+1]
        );

    }else{

        closeSheet();

    }

}


/* =========================================================
   CLOSE SHEET
   ========================================================= */

function closeSheet(){

    const sheet=$('#sheetBackdrop');

    if(sheet){

        sheet.classList.remove('open');

    }

}


/* =========================================================
   ESTIMATE
   ========================================================= */

function renderEstimate(){

    const box=$('#estimateList');

    if(!box) return;


    box.innerHTML='';


    const empty=$('#emptyEstimate');


    if(empty){

        empty.style.display=
            estimate.length
            ? 'none'
            : 'block';

    }


    estimate.forEach(item=>{

        const selections=
            item.selections || {};


        const tags=
            Object.entries(selections)
                .filter(([key,value])=>

                    key!=='quantity' &&
                    key!=='rate' &&
                    value!==''
                )
                .map(
                    ([key,value])=>`

                        <span class="tag">

                            ${esc(label(key))}:
                            ${esc(txt(value))}

                        </span>

                    `
                )
                .join('');


        const card=
            document.createElement('div');


        card.className=
            'estimate-card';


        const deleteButton=
            APP_CONFIG.estimate?.delete!==false
            ? `
                <button
                    type="button"
                    class="delete-btn"
                >
                    Delete
                </button>
              `
            : '';


        const quantityTag=
            APP_CONFIG.estimate?.quantity!==false
            ? `
                <span class="tag">
                    ${lang==='hi'?'मात्रा':'Qty'}:
                    ${esc(item.qty)}
                </span>
              `
            : '';


        const unitTag=
            APP_CONFIG.estimate?.unit!==false &&
            item.unit
            ? `
                <span class="tag">
                    ${esc(txt(item.unit))}
                </span>
              `
            : '';


        const rateText=
            APP_CONFIG.estimate?.rate!==false
            ? `
                <span>
                    Rate: ${money(item.rate)}
                </span>
              `
            : '';


        const amountText=
            APP_CONFIG.estimate?.amount!==false
            ? `
                <b class="amount">
                    ${money(item.amount)}
                </b>
              `
            : '';


        card.innerHTML=`

            <div class="estimate-top">

                <b>
                    ${esc(txt(item.name))}
                </b>

                ${deleteButton}

            </div>


            <div class="estimate-meta">

                ${tags}

                ${quantityTag}

                ${unitTag}

            </div>


            <div class="estimate-bottom">

                ${rateText}

                ${amountText}

            </div>

        `;


        const deleteBtn=
            card.querySelector(
                '.delete-btn'
            );


        if(deleteBtn){

            deleteBtn.addEventListener(
                'click',
                ()=>{

                    estimate=
                        estimate.filter(
                            savedItem=>
                                savedItem.id!==item.id
                        );


                    save();

                    renderEstimate();

                }
            );

        }


        box.appendChild(card);

    });


    const total=
        estimate.reduce(
            (sum,item)=>
                sum+
                Number(item.amount||0),
            0
        );


    const grandTotal=
        $('#grandTotal');


    if(grandTotal){

        grandTotal.textContent=
            money(total);

    }

}


/* =========================================================
   ESTIMATE TEXT
   ========================================================= */

function estimateText(){

    if(!estimate.length){

        return lang==='hi'
            ? 'Estimate खाली है।'
            : 'Estimate is empty.';

    }


    const lines=
        estimate.map(
            (item,index)=>{

                const details=
                    Object.entries(
                        item.selections||{}
                    )
                    .filter(
                        ([key,value])=>
                            value!==''
                    )
                    .map(
                        ([key,value])=>
                            `${label(key)}: ${txt(value)}`
                    )
                    .join(', ');


                return `${
                    index+1
                }. ${
                    txt(item.name)
                } | ${
                    details
                } | Amount: ${
                    money(item.amount)
                }`;

            }
        );


    const total=
        estimate.reduce(
            (sum,item)=>
                sum+
                Number(item.amount||0),
            0
        );


    return (
        lines.join('\n')+
        `\n\nGrand Total: ${money(total)}`
    );

}


/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings(){

    const box=$('#settingsList');

    if(!box) return;


    box.innerHTML='';


    if(typeof SETTINGS_ITEMS==='undefined'){

        console.warn(
            'SETTINGS_ITEMS not found.'
        );

        return;

    }


    SETTINGS_ITEMS.forEach(settingItem=>{

        if(
            APP_CONFIG.settings?.[
                settingItem.id
            ]===false
        ){

            return;

        }


        const card=
            document.createElement('div');


        card.className=
            'setting-card';


        if(settingItem.kind==='toggle'){

            let enabled=
                safeGet(
                    'setting_'+settingItem.id,
                    'true'
                )!=='false';


            card.innerHTML=`

                <div>

                    <b>
                        ${esc(settingItem.title)}
                    </b>

                    <small>
                        ${esc(settingItem.desc)}
                    </small>

                </div>


                <button
                    type="button"
                    class="toggle ${
                        enabled?'on':''
                    }"
                >

                    <i></i>

                </button>

            `;


            const toggle=
                card.querySelector('.toggle');


            toggle.addEventListener(
                'click',
                ()=>{

                    enabled=!enabled;


                    safeSet(
                        'setting_'+
                        settingItem.id,
                        String(enabled)
                    );


                    toggle.classList.toggle(
                        'on',
                        enabled
                    );


                    if(
                        settingItem.id===
                        'darkMode'
                    ){

                        applyTheme(
                            enabled
                            ? 'dark'
                            : 'light'
                        );

                    }


                    activate(toggle);

                }
            );


        }else{

            let buttonText='View';


            if(settingItem.id==='language'){

                buttonText='Change';

            }

            if(settingItem.id==='backup'){

                buttonText='Export';

            }

            if(settingItem.id==='reset'){

                buttonText='Reset';

            }


            card.innerHTML=`

                <div>

                    <b>
                        ${esc(settingItem.title)}
                    </b>

                    <small>
                        ${esc(settingItem.desc)}
                    </small>

                </div>


                <button
                    type="button"
                    class="cyber small"
                >
                    ${buttonText}
                </button>

            `;


            const button=
                card.querySelector('button');


            button.addEventListener(
                'click',
                ()=>setting(settingItem.id)
            );

        }


        box.appendChild(card);

    });

}


/* =========================================================
   SETTINGS ACTION
   ========================================================= */

function setting(id){

    if(id==='language'){

        toggleLanguage();

        return;

    }


    if(id==='reset'){

        openResetModal();

        return;

    }


    if(id==='backup'){

        const blob=
            new Blob(
                [
                    JSON.stringify(
                        estimate,
                        null,
                        2
                    )
                ],
                {
                    type:
                        'application/json'
                }
            );


        const url=
            URL.createObjectURL(blob);


        const anchor=
            document.createElement('a');


        anchor.href=url;

        anchor.download=
            'electrofix-estimate.json';


        document.body.appendChild(anchor);

        anchor.click();

        anchor.remove();

        URL.revokeObjectURL(url);

        return;

    }


    if(id==='about'){

        openModal(
            'About',
            `

                <div class="profile-card">

                    <div class="profile-logo">
                        ⚡
                    </div>

                    <div>

                        <b>
                            Sandeep ElectroFix
                        </b>

                        <small>
                            Powering Your Trust
                        </small>

                        <small>
                            Electrical Material
                            Estimate System
                        </small>

                    </div>

                </div>

            `
        );

    }

}


/* =========================================================
   LANGUAGE
   ========================================================= */

function toggleLanguage(){

    lang=
        lang==='en'
        ? 'hi'
        : 'en';


    safeSet(
        LANG,
        lang
    );


    const languageButton=
        $('#langBtn');


    if(languageButton){

        languageButton.textContent=
            lang.toUpperCase();

    }


    renderStages();


    if(current){

        renderOptions();

    }


    renderEstimate();

    renderSettings();

    renderCalc('power');

}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme(theme){

    document.body.classList.toggle(
        'light',
        theme==='light'
    );


    safeSet(
        THEME,
        theme
    );

}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(title,body){

    const titleBox=$('#modalTitle');

    const bodyBox=$('#modalBody');

    const backdrop=$('#modalBackdrop');


    if(titleBox){

        titleBox.textContent=title;

    }


    if(bodyBox){

        bodyBox.innerHTML=body;

    }


    if(backdrop){

        backdrop.classList.add('open');

    }

}


function closeModal(){

    const backdrop=
        $('#modalBackdrop');


    if(backdrop){

        backdrop.classList.remove('open');

    }

}


/* =========================================================
   RESET
   ========================================================= */

function openResetModal(){

    openModal(
        'Clear App Data',
        `

            <p
                style="
                    color:#7895a2;
                    font-size:10px
                "
            >
                This will remove the current
                estimate and saved view preferences.
            </p>


            <div class="actions">

                <button
                    type="button"
                    id="cancelReset"
                    class="cyber"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    id="confirmReset"
                    class="cyber gold"
                >
                    Reset
                </button>

            </div>

        `
    );


    const cancel=
        $('#cancelReset');


    const confirm=
        $('#confirmReset');


    cancel?.addEventListener(
        'click',
        closeModal
    );


    confirm?.addEventListener(
        'click',
        ()=>{

            estimate=[];

            save();

            localStorage.removeItem(VIEW);

            closeModal();

            renderEstimate();

            alert(
                lang==='hi'
                ? 'Estimate reset हो गया।'
                : 'Estimate reset.'
            );

        }
    );

}


/* =========================================================
   CALCULATOR
   ========================================================= */

function calcInput(
    id,
    labelText,
    value=''
){

    return `

        <div class="calc-field">

            <label>
                ${labelText}
            </label>

            <input
                id="${id}"
                type="number"
                value="${value}"
                inputmode="decimal"
            >

        </div>

    `;

}


function renderCalc(type='power'){

    const box=$('#calcBox');

    if(!box) return;


    if(type==='power'){

        box.innerHTML=`

            <h3>
                Power (P) Calculation
            </h3>

            <div class="formula">
                P = V × I
            </div>

            <div class="calc-fields">

                ${calcInput(
                    'cv',
                    'Voltage (V)',
                    '230'
                )}

                ${calcInput(
                    'ci',
                    'Current (A)',
                    '10'
                )}

            </div>

            <div class="calc-result">

                <span>
                    Power (W)
                </span>

                <b id="cr">
                    2300
                </b>

            </div>

            <button
                type="button"
                class="cyber calc-btn"
                id="calculateBtn"
            >
                Calculate
            </button>

        `;

    }


    if(type==='current'){

        box.innerHTML=`

            <h3>
                Current (I) Calculation
            </h3>

            <div class="formula">
                I = P ÷ V
            </div>

            <div class="calc-fields">

                ${calcInput(
                    'cp',
                    'Power (W)',
                    '2300'
                )}

                ${calcInput(
                    'cv',
                    'Voltage (V)',
                    '230'
                )}

            </div>

            <div class="calc-result">

                <span>
                    Current (A)
                </span>

                <b id="cr">
                    10
                </b>

            </div>

            <button
                type="button"
                class="cyber calc-btn"
                id="calculateBtn"
            >
                Calculate
            </button>

        `;

    }


    if(type==='voltage'){

        box.innerHTML=`

            <h3>
                Voltage (V) Calculation
            </h3>

            <div class="formula">
                V = P ÷ I
            </div>

            <div class="calc-fields">

                ${calcInput(
                    'cp',
                    'Power (W)',
                    '2300'
                )}

                ${calcInput(
                    'ci',
                    'Current (A)',
                    '10'
                )}

            </div>

            <div class="calc-result">

                <span>
                    Voltage (V)
                </span>

                <b id="cr">
                    230
                </b>

            </div>

            <button
                type="button"
                class="cyber calc-btn"
                id="calculateBtn"
            >
                Calculate
            </button>

        `;

    }


    if(type==='other'){

        box.innerHTML=`

            <h3>
                Ohm's Law
            </h3>

            <div class="formula">
                V = I × R
            </div>

            <div class="calc-fields">

                ${calcInput(
                    'oi',
                    'Current (A)',
                    '5'
                )}

                ${calcInput(
                    'or',
                    'Resistance (Ω)',
                    '46'
                )}

            </div>

            <div class="calc-result">

                <span>
                    Voltage (V)
                </span>

                <b id="cr">
                    230
                </b>

            </div>

            <button
                type="button"
                class="cyber calc-btn"
                id="calculateBtn"
            >
                Calculate
            </button>

        `;

    }


    const calculate=
        $('#calculateBtn');


    if(!calculate) return;


    calculate.addEventListener(
        'click',
        ()=>{

            let result=0;


            if(type==='power'){

                result=
                    Number($('#cv')?.value||0)*
                    Number($('#ci')?.value||0);

            }


            if(type==='current'){

                result=
                    Number($('#cp')?.value||0)/
                    Number($('#cv')?.value||1);

            }


            if(type==='voltage'){

                result=
                    Number($('#cp')?.value||0)/
                    Number($('#ci')?.value||1);

            }


            if(type==='other'){

                result=
                    Number($('#oi')?.value||0)*
                    Number($('#or')?.value||0);

            }


            const resultBox=$('#cr');


            if(resultBox){

                resultBox.textContent=
                    Number.isFinite(result)
                    ? result.toFixed(2)
                    : '0';

            }

        }
    );

}


/* =========================================================
   BOOT
   ========================================================= */

function boot(){

    applyConfig();


    const languageButton=
        $('#langBtn');


    if(languageButton){

        languageButton.textContent=
            lang.toUpperCase();

    }


    applyTheme(
        safeGet(
            THEME,
            'dark'
        )
    );


    renderStages();

    renderEstimate();

    renderSettings();

    renderCalc('power');


    /* -----------------------------------------
       VIEW SWITCHER
       ----------------------------------------- */

    $$('#viewSwitcher button')
        .forEach(button=>{

            button.classList.toggle(
                'active',
                button.dataset.view===view
            );


            button.addEventListener(
                'click',
                ()=>{

                    activate(button);

                    view=
                        button.dataset.view;


                    if(
                        safeGet(
                            'setting_rememberView',
                            'true'
                        )!=='false'
                    ){

                        safeSet(
                            VIEW,
                            view
                        );

                    }


                    renderMaterials();

                }
            );

        });


    /* -----------------------------------------
       MATERIAL SEARCH
       ----------------------------------------- */

    $('#materialSearch')?.addEventListener(
        'input',
        renderMaterials
    );


    /* -----------------------------------------
       GLOBAL SEARCH
       ----------------------------------------- */

    $('#globalSearch')?.addEventListener(
        'input',
        event=>{

            const query=
                event.target.value
                    .trim()
                    .toLowerCase();


            if(!query) return;


            const material=
                MATERIALS.find(
                    item=>
                        item.enabled &&
                        txt(item.name)
                            .toLowerCase()
                            .includes(query)
                );


            if(material){

                openStage(material.stage);

            }

        }
    );


    /* -----------------------------------------
       LANGUAGE
       ----------------------------------------- */

    $('#langBtn')?.addEventListener(
        'click',
        event=>{

            activate(event.currentTarget);

            toggleLanguage();

        }
    );


    /* -----------------------------------------
       DRAWER
       ----------------------------------------- */

    $('#menuBtn')?.addEventListener(
        'click',
        event=>{

            activate(event.currentTarget);

            $('#drawerBackdrop')
                ?.classList
                .add('open');

        }
    );


    $('#closeDrawer')?.addEventListener(
        'click',
        ()=>{

            $('#drawerBackdrop')
                ?.classList
                .remove('open');

        }
    );


    $('#drawerBackdrop')?.addEventListener(
        'click',
        event=>{

            if(
                event.target.id===
                'drawerBackdrop'
            ){

                $('#drawerBackdrop')
                    ?.classList
                    .remove('open');

            }

        }
    );


    $$('.drawer-links button')
        .forEach(button=>{

            button.addEventListener(
                'click',
                ()=>{

                    $('#drawerBackdrop')
                        ?.classList
                        .remove('open');

                    page(
                        button.dataset.page
                    );

                }
            );

        });


    $('#drawerLang')?.addEventListener(
        'click',
        toggleLanguage
    );


    /* -----------------------------------------
       MATERIAL NAVIGATION
       ----------------------------------------- */

    $('#backToStages')?.addEventListener(
        'click',
        ()=>page('homePage')
    );


    $('#stageSearchBtn')?.addEventListener(
        'click',
        ()=>{

            $('#materialSearch')?.focus();

        }
    );


    /* -----------------------------------------
       SHEET
       ----------------------------------------- */

    $('#closeSheet')?.addEventListener(
        'click',
        closeSheet
    );


    $('#sheetBackdrop')?.addEventListener(
        'click',
        event=>{

            if(
                event.target.id===
                'sheetBackdrop'
            ){

                closeSheet();

            }

        }
    );


    /* -----------------------------------------
       NEXT
       ----------------------------------------- */

    $('#nextMaterial')?.addEventListener(
        'click',
        event=>{

            activate(event.currentTarget);

            next();

        }
    );


    /* -----------------------------------------
       ADD TO ESTIMATE
       ----------------------------------------- */

    $('#addEstimate')?.addEventListener(
        'click',
        event=>{

            event.preventDefault();

            activate(event.currentTarget);

            add();

        }
    );


    /* -----------------------------------------
       MODAL
       ----------------------------------------- */

    $('#modalBackdrop')?.addEventListener(
        'click',
        event=>{

            if(
                event.target.id===
                'modalBackdrop'
            ){

                closeModal();

            }

        }
    );


    $('#closeModal')?.addEventListener(
        'click',
        closeModal
    );


    /* -----------------------------------------
       BOTTOM NAV
       ----------------------------------------- */

    $$('#bottomNav button')
        .forEach(button=>{

            button.addEventListener(
                'click',
                ()=>{

                    activate(button);

                    page(
                        button.dataset.page
                    );

                }
            );

        });


    /* -----------------------------------------
       CLEAR ESTIMATE
       ----------------------------------------- */

    $('#clearEstimateTop')
        ?.addEventListener(
            'click',
            ()=>{

                if(
                    !estimate.length
                ){

                    return;

                }


                if(
                    confirm(
                        lang==='hi'
                        ? 'क्या आप पूरा Estimate clear करना चाहते हैं?'
                        : 'Clear current estimate?'
                    )
                ){

                    estimate=[];

                    save();

                    renderEstimate();

                }

            }
        );


    /* -----------------------------------------
       COPY
       ----------------------------------------- */

    $('#copyEstimate')
        ?.addEventListener(
            'click',
            async event=>{

                activate(
                    event.currentTarget
                );


                const text=
                    estimateText();


                try{

                    await navigator.clipboard.writeText(
                        text
                    );


                    alert(
                        lang==='hi'
                        ? 'Estimate copy हो गया।'
                        : 'Estimate copied.'
                    );

                }catch(error){

                    alert(text);

                }

            }
        );


    /* -----------------------------------------
       SHARE
       ----------------------------------------- */

    $('#shareEstimate')
        ?.addEventListener(
            'click',
            async event=>{

                activate(
                    event.currentTarget
                );


                const text=
                    estimateText();


                try{

                    if(
                        navigator.share
                    ){

                        await navigator.share({

                            title:
                                'Sandeep ElectroFix Estimate',

                            text:
                                text

                        });

                    }else{

                        await navigator.clipboard?.writeText(
                            text
                        );


                        alert(
                            lang==='hi'
                            ? 'Estimate copy हो गया।'
                            : 'Estimate copied.'
                        );

                    }

                }catch(error){

                    console.log(
                        'Share cancelled:',
                        error
                    );

                }

            }
        );


    /* -----------------------------------------
       PRINT
       ----------------------------------------- */

    $('#printEstimate')
        ?.addEventListener(
            'click',
            event=>{

                activate(
                    event.currentTarget
                );

                window.print();

            }
        );


    /* -----------------------------------------
       CALCULATOR TABS
       ----------------------------------------- */

    $$('.calc-tabs button')
        .forEach(button=>{

            button.addEventListener(
                'click',
                ()=>{

                    $$('.calc-tabs button')
                        .forEach(item=>
                            item.classList.remove(
                                'active'
                            )
                        );


                    button.classList.add(
                        'active'
                    );


                    renderCalc(
                        button.dataset.calc
                    );

                }
            );

        });


    /* -----------------------------------------
       QUICK CALCULATORS
       ----------------------------------------- */

    $$('.quick-calc-grid button')
        .forEach(button=>{

            button.addEventListener(
                'click',
                ()=>{

                    const tool=
                        button.dataset.tool;


                    if(tool==='ohm'){

                        $$('.calc-tabs button')
                            .forEach(item=>
                                item.classList.remove(
                                    'active'
                                )
                            );


                        const other=
                            document.querySelector(
                                '[data-calc="other"]'
                            );


                        other?.classList.add(
                            'active'
                        );


                        renderCalc('other');

                        return;

                    }


                    alert(
                        (
                            button.querySelector('b')
                                ?.textContent ||
                            'Calculator'
                        )+
                        ' module is ready for integration.'
                    );

                }
            );

        });

}


/* =========================================================
   LOADER
   ========================================================= */

function hideLoadingScreen(){

    const loader=
        document.getElementById(
            'loadingScreen'
        );


    if(!loader) return;


    loader.style.opacity='0';

    loader.style.pointerEvents='none';


    setTimeout(()=>{

        loader.style.display='none';

    },400);

}


/* =========================================================
   SAFE BOOT
   ========================================================= */

function safeBoot(){

    try{

        boot();

    }catch(error){

        console.error(
            'Sandeep ElectroFix boot error:',
            error
        );


        /*
         * App should not remain permanently
         * behind the loading screen.
         */

    }finally{

        hideLoadingScreen();

    }

}


/* =========================================================
   START APP
   ========================================================= */

if(
    document.readyState===
    'loading'
){

    document.addEventListener(
        'DOMContentLoaded',
        safeBoot,
        {
            once:true
        }
    );

}else{

    safeBoot();

}


/* =========================================================
   EMERGENCY LOADER FAILSAFE
   ========================================================= */

setTimeout(
    hideLoadingScreen,
    3000
);


})();
