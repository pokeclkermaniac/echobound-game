import {abilities,enemies,route,traits} from "./data.js";
export const SAVE_KEY="echobound.vertical-slice.v1";

export function freshState(generation=1){
  return {screen:"title",generation,node:0,maxHp:68,hp:68,guard:0,energy:3,mutation:0,wins:0,legacyGuard:0,bonkBonus:0,traits:[],battle:null,message:""};
}
export function loadState(){
  try{
    if(typeof localStorage==="undefined")return freshState();
    const value=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(!value?.generation)return freshState();
    if(value.battle)value.battle={phase:1,seeds:0,power:0,phaseChanged:false,...value.battle};
    return value;
  }catch{return freshState()}
}
export function saveState(state){if(typeof localStorage!=="undefined")localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
export function clearSave(){if(typeof localStorage!=="undefined")localStorage.removeItem(SAVE_KEY)}
export function beginRun(state){return {...state,screen:"map",hp:state.maxHp,node:0,wins:0,mutation:0,battle:null,message:"A fresh route wiggles into view!"}}
export function startBattle(state,id){
  const e=enemies[id],battle={enemyId:id,enemyHp:e.hp,enemyMaxHp:e.hp,enemyGuard:0,enemyVulnerable:0,enemyDodge:0,turn:1,patternIndex:0,uhohUsed:false,phase:1,seeds:0,power:0,phaseChanged:false,log:[e.boss?`${e.name} declares this island his royal court!`:`${e.name} blocks the path!`],locked:false};
  return {...state,screen:"battle",energy:3,guard:state.legacyGuard,battle};
}
function hurt(amount,guard){const blocked=Math.min(guard,amount);return {hpLoss:amount-blocked,guard:guard-blocked}}
export function useAbility(state,key){
  const ability=abilities[key],b={...state.battle,log:[...state.battle.log]};
  if(b.locked||state.energy<ability.cost||(ability.action.once&&b.uhohUsed))return state;
  let energy=state.energy-ability.cost,guard=state.guard,hp=state.hp,damage=ability.action.damage||0;
  if(key==="bonk")damage+=state.bonkBonus||0;
  if(b.enemyDodge){damage=0;b.enemyDodge=0;b.log.push(`${enemies[b.enemyId].name} springs clear!`)}
  if(damage){if(b.enemyVulnerable){damage+=4;b.enemyVulnerable=0}const hit=hurt(damage,b.enemyGuard);b.enemyGuard=hit.guard;b.enemyHp=Math.max(0,b.enemyHp-hit.hpLoss);b.log.push(`${ability.name} deals ${hit.hpLoss} damage.`)}
  if(b.enemyId==="squashbuckler"&&key==="quick"&&b.seeds>0){b.seeds--;b.log.push("Quickstep scatters one Seedling!")}
  if(ability.action.vulnerable)b.enemyVulnerable=ability.action.vulnerable;
  if(ability.action.guard){guard+=ability.action.guard;b.log.push(`Bop gains ${ability.action.guard} Guard.`)}
  if(ability.action.energy)energy=Math.min(3,energy+ability.action.energy);
  if(ability.action.cleanse){hp=Math.min(state.maxHp,hp+ability.action.heal);b.uhohUsed=true;b.log.push("Bop shakes it off and heals 3.")}
  if(b.enemyId==="squashbuckler"&&b.enemyHp>0){
    const nextPhase=b.enemyHp<=70?3:b.enemyHp<=140?2:1;
    if(nextPhase>b.phase){b.phase=nextPhase;b.patternIndex=0;b.phaseChanged=true;b.enemyGuard=0;b.log.push(`PHASE ${nextPhase}! The King's routine changes.`)}
  }
  return {...state,hp,guard,energy,battle:b};
}
export function enemyTurn(state){
  const b={...state.battle,log:[...state.battle.log]},enemy=enemies[b.enemyId];
  if(b.enemyHp<=0)return victory(state);
  const pattern=enemy.boss?enemy.phases[b.phase-1]:enemy.pattern;
  const move=pattern[b.patternIndex%pattern.length];let hp=state.hp,guard=state.guard,energy=3;
  if(move.kind==="attack"){const amount=move.value+(b.power||0);const hit=hurt(amount,guard);guard=hit.guard;hp=Math.max(0,hp-hit.hpLoss);b.log.push(`${enemy.name} uses ${move.label} for ${hit.hpLoss} damage.`)}
  if(move.kind==="guard"){b.enemyGuard+=move.value;b.log.push(`${enemy.name} gains ${move.value} Guard.`)}
  if(move.kind==="sticky"){energy=2;b.log.push(`${enemy.name} makes everything sticky. Next turn starts with 2 Energy.`)}
  if(move.kind==="dodge"){b.enemyDodge=1;b.log.push(`${enemy.name} coils up to dodge the next attack.`)}
  if(move.kind==="seeds"){b.seeds=Math.min(4,b.seeds+move.value);b.log.push(`${enemy.name} summons ${move.value} Seedling${move.value>1?"s":""}.`)}
  if(move.kind==="cannonade"){const amount=move.value+(b.seeds*3)+(b.power||0);const hit=hurt(amount,guard);guard=hit.guard;hp=Math.max(0,hp-hit.hpLoss);b.log.push(`${move.label} fires for ${hit.hpLoss} damage (${b.seeds} Seedlings).`)}
  if(move.kind==="enrage"){b.power+=move.value;b.log.push(`The royal mustache bristles! Power rises to +${b.power}.`)}
  b.patternIndex++;b.turn++;
  b.phaseChanged=false;
  if(hp<=0)return {...state,hp,guard,energy,battle:b,screen:"inherit",message:"Bop's run ended, but the family keeps what it learned."};
  return {...state,hp,guard:0,energy,battle:b};
}
export function currentIntent(state){const e=enemies[state.battle.enemyId],pattern=e.boss?e.phases[state.battle.phase-1]:e.pattern;return pattern[state.battle.patternIndex%pattern.length]}
export function victory(state){
  const wasBoss=state.battle?.enemyId==="squashbuckler";
  const wins=state.wins+(wasBoss?0:1),node=state.node+1,mutation=Math.min(100,state.mutation+(wasBoss?0:30));
  return {...state,wins,node,mutation,battle:null,screen:wasBoss?"inherit":"reward",message:wasBoss?"King Squashbuckler is dethroned! Bop's first full journey is complete.":`Victory! Mutation reached ${mutation}%.`};
}
export function takeReward(state,kind){
  const next={...state,screen:"map"};
  if(kind==="heal")next.hp=Math.min(next.maxHp,next.hp+18);
  if(kind==="mutate")next.bonkBonus=(next.bonkBonus||0)+1;
  if(kind==="guard")next.legacyGuard=(next.legacyGuard||0)+2;
  saveState(next);return next;
}
export function completeEvent(state){const next={...state,node:state.node+1,hp:Math.min(state.maxHp,state.hp+10),message:"The Fizzy Fountain restores 10 health."};saveState(next);return next}
export function inherit(state,traitId){
  const chosen=traits.find(t=>t.id===traitId),next=freshState(state.generation+1);
  next.maxHp=state.maxHp;next.bonkBonus=state.bonkBonus||0;next.legacyGuard=state.legacyGuard||0;next.traits=[...(state.traits||[]),traitId];chosen.apply(next);next.screen="map";next.message=`Generation ${next.generation} inherited ${chosen.name}!`;saveState(next);return next;
}
export {abilities,enemies,route,traits};
