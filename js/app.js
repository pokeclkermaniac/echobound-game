import * as game from "./engine.js";
let state=game.loadState();
const app=document.querySelector("#app");
const icon=id=>`<svg class="echo-icon"><use href="assets/ui-icons.svg#${id}"></use></svg>`;
const creature=(id)=>`<svg class="creature" aria-label="${id}"><use href="assets/creatures.svg#${id}"></use></svg>`;
const bossIcon=id=>`<svg class="echo-icon boss-intent-icon"><use href="assets/boss-icons.svg#${id}"></use></svg>`;
const meter=(value,max,color)=>`<div class="echo-meter mini-meter"><span style="--value:${Math.max(0,value/max*100)}%;--meter-color:${color}"></span></div>`;
function commit(next){state=next;game.saveState(state);render()}
function shell(content,cls=""){return `<main class="screen ${cls}"><div class="shell">${content}</div></main>`}
function topbar(){return `<header class="topbar"><img class="brand" src="assets/echobound-logo.svg" alt="Echobound"><div class="run-chip">GEN ${state.generation} • ${state.hp}/${state.maxHp} HP</div></header>`}

function title(){
  const hasSave=state.screen!=="title"||state.generation>1||state.node>0;
  app.innerHTML=shell(`<section class="title-card echo-panel"><img class="brand" src="assets/echobound-logo.svg" alt="Echobound"><h1>The line begins</h1><p>A playful turn-based roguelite where every run strengthens the creature family that comes next.</p><div class="title-actions"><button class="echo-button echo-button--attack" data-action="new">Hatch Bop</button>${hasSave?`<button class="echo-button echo-button--guard" data-action="continue">Continue Gen ${state.generation}</button>`:""}</div></section>`,"title-screen");
}
function map(){
  const nodes=game.route.map((n,i)=>{
    const done=i<state.node,current=i===state.node,locked=i>state.node;
    return `<div class="route-stop"><button class="echo-node" data-node="${n.type}" data-index="${i}" ${current?'aria-current="step"':''} ${locked||done?"disabled":""}>${icon("node-"+(n.type==="battle"?"battle":n.type))}</button><span class="route-label">${done?"✓ ":current?"GO! ":""}${n.label}</span></div>`;
  }).join("");
  app.innerHTML=shell(`${topbar()}<section class="map-head echo-panel"><div><h1>Fizzlefruit Isles</h1><p>${state.message||"Choose the next wobbling path."}</p></div><div class="map-stats">WINS ${state.wins}/3<br>MUTATION ${state.mutation}%<br>${state.node===4?"BOSS READY":""}</div></section><section class="route echo-panel">${nodes}</section><div class="map-actions"><button class="echo-button" data-action="save">Save Run</button></div>`,"map-screen");
}
function battle(){
  const b=state.battle,e=game.enemies[b.enemyId],intent=game.currentIntent(state);
  const boss=e.boss;
  const phasePips=boss?`<div class="phase-pips" aria-label="Boss phase ${b.phase} of 3">${[1,2,3].map(p=>`<i class="${p<=b.phase?"active":""}"></i>`).join("")}</div>`:"";
  const seedCourt=boss?`<div class="seed-court" aria-label="${b.seeds} Seedlings">${[0,1,2,3].map(i=>`<svg class="seedling-icon ${i<b.seeds?"awake":""}"><use href="assets/creatures.svg#royal-seedling"></use></svg>`).join("")}<b>SEEDLINGS</b></div>`:"";
  const intentValue=intent.detail||`${intent.kind==="attack"?intent.value+" damage":intent.kind}`;
  const intentIcons={"Royal Wallop":"royal-wallop","Call the Court":"call-court","Seed Cannonade":"seed-cannonade","Rind Parry":"rind-parry","More Minions!":"call-court","Royal Ricochet":"seed-cannonade","Booted Boogie":"royal-wallop","Mustache Tantrum":"mustache-power","Crown Pound":"crown-pound","Grand Finale":"seed-cannonade"};
  const cards=Object.entries(game.abilities).map(([key,a])=>`<button class="echo-card ability" style="--card-color:${a.color}" data-ability="${key}" ${state.energy<a.cost||(a.action.once&&b.uhohUsed)?"disabled":""}><b class="echo-card__cost">${a.cost}</b>${icon(a.icon)}<div><h3 class="echo-card__name">${a.name}</h3><p class="echo-card__text">${a.text}</p></div></button>`).join("");
  app.innerHTML=shell(`${topbar()}<section class="battle-board ${boss?"boss-arena phase-"+b.phase:""}"><div class="turn-banner">${boss?`PHASE ${b.phase} • `:""}TURN ${b.turn}</div>${phasePips}${seedCourt}<aside class="intent">${boss&&intentIcons[intent.label]?bossIcon(intentIcons[intent.label]):""}<b>${boss?"ROYAL INTENT":"ENEMY INTENT"}</b><p>${intent.label}</p><small>${intentValue}</small></aside><div class="combatant player idle" id="player">${creature("bop")}<div class="nameplate"><div class="name-row"><span>BOP</span><span>${state.hp}/${state.maxHp}${state.guard?` +${state.guard}G`:""}</span></div>${meter(state.hp,state.maxHp,"var(--echo-raspberry)")}</div></div><div class="combatant enemy idle ${boss?"boss":""}" id="enemy">${creature(e.sprite)}<div class="nameplate"><div class="name-row"><span>${e.name.toUpperCase()}</span><span>${b.enemyHp}/${b.enemyMaxHp}${b.enemyGuard?` +${b.enemyGuard}G`:""}${b.power?` +${b.power}P`:""}</span></div>${meter(b.enemyHp,b.enemyMaxHp,"var(--echo-green)")}</div></div>${b.phaseChanged?`<div class="phase-splash">PHASE ${b.phase}!<small>${b.phase===2?"THE COURT GETS ROWDY":"MUSTACHE TANTRUM"}</small></div>`:""}</section><div class="battle-log">${b.log.slice(-3).join(" ")}</div><section class="hand">${cards}</section><footer class="battle-footer"><div class="energy">${icon("icon-energy")} ${state.energy}/3 ENERGY</div>${boss?`<div class="boss-tip">${b.seeds?"Quickstep scatters Seedlings.":"No Seedlings in the court."}</div>`:""}<button class="echo-button echo-button--attack" data-action="end-turn">End Turn</button></footer>`,"battle-screen");
}
function reward(){
  app.innerHTML=shell(`${topbar()}<div class="modal-layer"><section class="reward echo-panel"><h2>Pick a Run Boost!</h2><p>${state.message}</p><div class="reward-grid"><button class="trait" data-reward="heal"><b>Fizzy Fruit</b><span>Heal 18 health.</span></button><button class="trait" data-reward="mutate"><b>Heavy Bonk</b><span>Bonk gains +1 damage this run.</span></button><button class="trait" data-reward="guard"><b>Springy Hide</b><span>Begin battles with +2 Guard.</span></button></div></section></div>`,"map-screen");
}
function inherit(){
  const picks=game.traits.map(t=>`<button class="trait" data-trait="${t.id}"><b>${t.name}</b><span>${t.text}</span></button>`).join("");
  app.innerHTML=shell(`${topbar()}<section class="inherit echo-panel"><h1>What a Run!</h1>${creature("bop")}<p>${state.message||`Generation ${state.generation} reached the Legacy Gate.`}</p><h2>Pick a Family Quirk</h2><div class="family-picks">${picks}</div></section>`,"inherit-screen");
}
function render(){({title,map,battle,reward,inherit}[state.screen]||title)()}
app.addEventListener("click",e=>{
  const el=e.target.closest("button");if(!el)return;
  if(el.dataset.action==="new"){game.clearSave();commit(game.beginRun(game.freshState()))}
  if(el.dataset.action==="continue"){state.screen=state.battle?"battle":"map";commit(state)}
  if(el.dataset.action==="save"){game.saveState(state);showToast("Run saved!")}
  if(el.dataset.index!==undefined){const node=game.route[Number(el.dataset.index)];if(node.type==="battle"||node.type==="boss")commit(game.startBattle(state,node.id));if(node.type==="event")commit(game.completeEvent(state))}
  if(el.dataset.ability){const before=state.battle.enemyHp;commit(game.useAbility(state,el.dataset.ability));const target=document.querySelector("#enemy");if(target&&state.battle&&state.battle.enemyHp<before){target.classList.add("hit");setTimeout(()=>target.classList.remove("hit"),320)}}
  if(el.dataset.action==="end-turn")commit(game.enemyTurn(state));
  if(el.dataset.reward)commit(game.takeReward(state,el.dataset.reward));
  if(el.dataset.trait)commit(game.inherit(state,el.dataset.trait));
});
function showToast(text){const t=document.createElement("div");t.className="toast";t.textContent=text;document.body.append(t);setTimeout(()=>t.remove(),1300)}
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
render();
