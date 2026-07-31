export const abilities = {
  bonk:{name:"Bonk",cost:1,icon:"icon-bonk",color:"var(--echo-orange)",action:{damage:"bonk",vulnerable:1}},
  puff:{name:"Puff Up",cost:1,icon:"icon-puff",color:"var(--echo-blue)",action:{guard:10}},
  quick:{name:"Quickstep",cost:1,icon:"icon-quickstep",color:"var(--echo-yellow)",action:{damage:5,energy:1}},
  uhoh:{name:"Uh-Oh!",cost:0,icon:"icon-uhoh",color:"var(--echo-grape)",action:{cleanse:true,heal:4,once:true}}
};

export const enemies = {
  crumbler:{
    name:"Crumbler",asset:"crumbler",hp:58,
    pattern:[
      {kind:"guard",value:8,label:"Brace Up",detail:"Gain 8 Guard",pose:"brace"},
      {kind:"attack",value:9,label:"Rock Knock",detail:"9 damage",pose:"attack"},
      {kind:"attack",value:13,label:"Crumb Crash",detail:"13 damage",pose:"attack"}
    ]
  },
  syrup:{
    name:"Syrup Slug",asset:"syrup-slug",hp:54,
    pattern:[
      {kind:"sticky",value:1,label:"Sticky Spill",detail:"Next turn starts with 2 Energy",pose:"sticky"},
      {kind:"attack",value:10,label:"Syrup Slap",detail:"10 damage",pose:"attack"},
      {kind:"attack",value:14,label:"Sugar Rush",detail:"14 damage",pose:"attack"}
    ]
  },
  spring:{
    name:"Springbean",asset:"springbean",hp:62,
    pattern:[
      {kind:"attack",value:8,label:"Boing!",detail:"8 damage",pose:"sky-drop"},
      {kind:"dodge",value:1,label:"Coil Up",detail:"Dodge the next damaging move",pose:"coil"},
      {kind:"attack",value:15,label:"Sky Drop",detail:"15 damage",pose:"sky-drop"}
    ]
  },
  squashbuckler:{
    name:"King Squashbuckler",asset:"king-squashbuckler",hp:210,boss:true,
    phases:[
      [
        {kind:"attack",value:9,label:"Royal Wallop",detail:"9 damage",pose:"wallop"},
        {kind:"seeds",value:2,label:"Call the Court",detail:"Summon 2 Seedlings",pose:"cannonade"},
        {kind:"cannonade",value:8,label:"Seed Cannonade",detail:"8 + 3 per Seedling",pose:"cannonade"}
      ],
      [
        {kind:"guard",value:13,label:"Rind Parry",detail:"Gain 13 Guard",pose:"idle"},
        {kind:"seeds",value:1,label:"More Minions!",detail:"Summon 1 Seedling",pose:"cannonade"},
        {kind:"cannonade",value:11,label:"Royal Ricochet",detail:"11 + 3 per Seedling",pose:"cannonade"},
        {kind:"attack",value:13,label:"Booted Boogie",detail:"13 damage",pose:"wallop"}
      ],
      [
        {kind:"enrage",value:2,label:"Mustache Tantrum",detail:"+2 permanent Power",pose:"idle"},
        {kind:"attack",value:12,label:"Crown Pound",detail:"12 + Power damage",pose:"wallop"},
        {kind:"cannonade",value:13,label:"Grand Finale",detail:"13 + Power + Seedlings",pose:"cannonade"}
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

export const runRewards = [
  {id:"power-pop",name:"Power Pop",description:"+3 Bonk damage for this run.",stat:"bonk"},
  {id:"plump-peel",name:"Plump Peel",description:"+10 maximum health and heal 10.",stat:"health"},
  {id:"spring-sole",name:"Spring Sole",description:"+2 starting Guard every battle this run.",stat:"guard"}
];

export const traits = [
  {id:"thick-fluff",name:"Thick Fluff",text:"+8 permanent maximum health.",stat:"health"},
  {id:"quick-feet",name:"Quick Feet",text:"+2 permanent starting Guard.",stat:"guard"},
  {id:"lucky-bonk",name:"Lucky Bonk",text:"+3 permanent Bonk damage.",stat:"bonk"}
];
