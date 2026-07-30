export const abilities = {
  bonk:{name:"Bonk",cost:1,icon:"icon-bonk",color:"var(--echo-orange)",text:"Deal 12 damage. Apply Vulnerable.",action:{damage:12,vulnerable:1}},
  puff:{name:"Puff Up",cost:1,icon:"icon-puff",color:"var(--echo-blue)",text:"Gain 9 Guard.",action:{guard:9}},
  quick:{name:"Quickstep",cost:1,icon:"icon-quickstep",color:"var(--echo-yellow)",text:"Deal 5 damage. Gain 1 Energy.",action:{damage:5,energy:1}},
  uhoh:{name:"Uh-Oh!",cost:0,icon:"icon-uhoh",color:"var(--echo-grape)",text:"Clear Sticky. Heal 3. Once per battle.",action:{cleanse:true,heal:3,once:true}}
};

export const enemies = {
  crumbler:{name:"Crumbler",sprite:"crumbler",hp:42,pattern:[{kind:"guard",value:7,label:"Brace Up"},{kind:"attack",value:8,label:"Rock Knock"},{kind:"attack",value:11,label:"Crumb Crash"}]},
  syrup:{name:"Syrup Slug",sprite:"syrup-slug",hp:38,pattern:[{kind:"sticky",value:1,label:"Sticky Spill"},{kind:"attack",value:9,label:"Syrup Slap"},{kind:"attack",value:12,label:"Sugar Rush"}]},
  spring:{name:"Springbean",sprite:"springbean",hp:46,pattern:[{kind:"attack",value:7,label:"Boing!"},{kind:"dodge",value:1,label:"Coil Up"},{kind:"attack",value:14,label:"Sky Drop"}]},
  squashbuckler:{
    name:"King Squashbuckler",
    sprite:"king-squashbuckler",
    hp:210,
    boss:true,
    phases:[
      [
        {kind:"attack",value:9,label:"Royal Wallop",detail:"9 damage"},
        {kind:"seeds",value:2,label:"Call the Court",detail:"Summon 2 Seedlings"},
        {kind:"cannonade",value:8,label:"Seed Cannonade",detail:"8 + 3 per Seedling"}
      ],
      [
        {kind:"guard",value:13,label:"Rind Parry",detail:"Gain 13 Guard"},
        {kind:"seeds",value:1,label:"More Minions!",detail:"Summon 1 Seedling"},
        {kind:"cannonade",value:11,label:"Royal Ricochet",detail:"11 + 3 per Seedling"},
        {kind:"attack",value:13,label:"Booted Boogie",detail:"13 damage"}
      ],
      [
        {kind:"enrage",value:2,label:"Mustache Tantrum",detail:"+2 permanent Power"},
        {kind:"attack",value:12,label:"Crown Pound",detail:"12 + Power damage"},
        {kind:"cannonade",value:13,label:"Grand Finale",detail:"13 + Power + Seedlings"}
      ]
    ]
  }
};

export const route = [
  {id:"crumbler",type:"battle",label:"Crumbler"},
  {id:"event",type:"event",label:"Fizzy Fountain"},
  {id:"syrup",type:"battle",label:"Syrup Slug"},
  {id:"spring",type:"battle",label:"Springbean"},
  {id:"squashbuckler",type:"boss",label:"King Squashbuckler"}
];

export const traits = [
  {id:"thick-fluff",name:"Thick Fluff",text:"+8 maximum health next generation.",apply:s=>{s.maxHp+=8;s.hp=s.maxHp}},
  {id:"quick-feet",name:"Quick Feet",text:"Begin every battle with 1 Guard.",apply:s=>{s.legacyGuard=1}},
  {id:"lucky-bonk",name:"Lucky Bonk",text:"Bonk deals 3 additional damage.",apply:s=>{s.bonkBonus=3}}
];
