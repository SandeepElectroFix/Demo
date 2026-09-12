/* UI MASTER CONTROL — true = show, false = hide. Material data remains in material.js. */
const APP_CONFIG={
 navigation:{home:true,estimate:true,calculator:true,settings:true},
 home:{header:true,menu:true,language:true,search:true,stages:true,materialCount:true},
 materials:{search:true,materialView:true,materialImage:true,materialName:true},
 selection:{type:true,subType:true,size:true,shape:true,material:true,conduitSize:true,ways:true,depth:true,hookRod:true,module:true,door:true,phase:true,amp:true,colour:true,voltage:true,sensitivity:true,base:true,wattage:true,length:true,mounting:true,ledDensity:true,supply:true,ipRating:true,structure:true,diameter:true,cableSize:true,studSize:true,quantity:true,unit:true,brand:true,rate:true,nextMaterial:true,addEstimate:true},
 estimate:{quantity:true,unit:true,rate:true,amount:true,delete:true,grandTotal:true,copyEstimate:true,printEstimate:true,shareEstimate:true},
 calculator:{power:true,current:true,voltage:true,other:true,quickTools:true},
 settings:{language:true,darkMode:true,rememberView:true,backup:true,reset:true,about:true}
};
const SETTINGS_ITEMS=[
 {id:'language',title:'Language',desc:'English / हिन्दी',kind:'action'},
 {id:'darkMode',title:'Theme',desc:'Dark / Light',kind:'toggle'},
 {id:'rememberView',title:'Remember Material View',desc:'Save Grid / List / Compact / Image',kind:'toggle'},
 {id:'backup',title:'Backup Estimate',desc:'Download current estimate as JSON',kind:'action'},
 {id:'reset',title:'Clear App Data',desc:'Reset estimate and saved preferences',kind:'action'},
 {id:'about',title:'About',desc:'Sandeep ElectroFix • Powering Your Trust',kind:'action'}
];
