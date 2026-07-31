import {abilities,enemies,route,runRewards,traits} from "./data.js";
export const SAVE_KEY="echobound.save.v3";
export const SCHEMA_VERSION=3;

export function freshState(generation=1,genes={}){
  const baseMaxHp=genes.baseMaxHp??68;
  return {
    schemaVersion:SCHEMA_VERSION,screen:"title",generation,node:0,wins:0,mutation:0,
    baseMaxHp,baseBonkDamage:genes.baseBonkDamage??10,baseStartGuard:genes.baseStartGuard??0,
    runMaxHpBonus:0,runBonkBonus:0,runGuardBonus:0,
    maxHp:baseMaxHp,hp:baseMaxHp,guard:0,energy:3,
    inheritedTraits:genes.inheritedTraits??[],runRewards:[],battle:null,message:""
  };
}
export const bonkDamage=s=>s.baseBonkDamage+s.runBonkBonus;
export const startingGuard=s=>s.baseStartGuard+s.runGuardBonus;
export const statSnapshot=s=>({maxHp:s.maxHp,bonkDamage:bonkDamage(s),startingGuard:startingGuard(s)});
export function abilityText(state,key){
  if(key==="bonk")return `Deal ${bonkDamage(state)} damage. Apply Vulnerable.`;
  if(key==="puff")return "Gain 10 Guard.";
  if(key==="quick")return "Deal 5 damage. Refund 1 Energy. Scatter 1 Seedling.";
  return "Clear Sticky. Heal 4. Once per battle.";
}
export function loadState(){
  try{
    if(typeof localStorage==="undefined")return freshState();
    const value=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(value?.schemaVersion!==SCHEMA_VERSION)return freshState();
    if(value.battle)value.battle={phase:1,seeds:0,power:0,phaseChanged:false,...value.battle};
    return value;
  }catch{return freshState()}
}
export function saveState(state){if(typeof localStorage!=="undefined")localStorage.setItem(SAVE_KEY,JSON.stringify(state))}
export function clearSave(){if(typeof localStorage!=="undefined")localStorage.removeItem(SAVE_KEY)}
export function beginRun(state){
  const maxHp=state.baseMaxHp;
  return {...state,screen:"map",node:0,wins:0,mutation:0,runMaxHpBonus:0,runBonkBonus:0,runGuardBonus:0,runRewards:[],maxHp,hp:maxHp,guard:0,energy:3,battle:null,message:`Generation ${state.generation} begins with Bonk at ${state.baseBonkDamage} damage.`};
}
export function startBattle(state,id){
  const e=enemies[id];
  const battle={enemyId:id,enemyHp:e.hp,enemyMaxHp:e.hp,enemyGuard:0,enemyVulnerable:0,enemyDodge:0,turn:1,patternIndex:0,uhohUsed:false,phase:1,seeds:0,power:0,phaseChanged:false,log:[e.boss?`${e.name} declares this island his royal court!`:`${e.name} blocks the path!`],locked:false};
  return {...state,screen:"battle",energy:3,guard:startingGuard(state),battle,message:""};
}
function hurt(amount,guard){const blocked=Math.min(guard,amount);return {hpLoss:amount-blocked,guard:guard-blocked}}
export function useAbility(state,key){
  const ability=abilities[key],b={...state.battle,log:[...state.battle.log]};
  if(!ability||b.locked||state.energy<ability.cost||(ability.action.once&&b.uhohUsed))return state;
  let energy=state.energy-ability.cost,guard=state.guard,hp=state.hp;
  let damage=ability.action.damage==="bonk"?bonkDamage(state):(ability.action.damage||0);
  if(b.enemyDodge&&damage){damage=0;b.enemyDodge=0;b.log.push(`${enemies[b.enemyId].name} springs clear!`)}
  if(damage){
    if(b.enemyVulnerable){damage+=3;b.enemyVulnerable=0}
    const hit=hurt(damage,b.enemyGuard);b.enemyGuard=hit.guard;b.enemyHp=Math.max(0,b.enemyHp-hit.hpLoss);
    b.log.push(`${ability.name} deals ${hit.hpLoss} damage.`);
  }
  if(b.enemyId==="squashbuckler"&&key==="quick"&&b.seeds>0){b.seeds--;b.log.push("Quickstep scatters one Seedling!")}
  if(ability.action.vulnerable)b.enemyVulnerable=ability.action.vulnerable;
  if(ability.action.guard){guard+=ability.action.guard;b.log.push(`Bop gains ${ability.action.guard} Guard.`)}
  if(ability.action.energy)energy=Math.min(3,energy+ability.action.energy);
  if(ability.action.cleanse){hp=Math.min(state.maxHp,hp+ability.action.heal);b.uhohUsed=true;b.log.push(`Bop shakes it off and heals ${ability.action.heal}.`)}
  if(b.enemyId==="squashbuckler"&&b.enemyHp>0){
    const nextPhase=b.enemyHp<=70?3:b.enemyHp<=140?2:1;
    if(nextPhase>b.phase){b.phase=nextPhase;b.patternIndex=0;b.phaseChanged=true;b.enemyGuard=0;b.log.push(`PHASE ${nextPhase}! The King's routine changes.`)}
  }
  const next={...state,hp,guard,energy,battle:b};
  return b.enemyHp<=0?victory(next):next;
}
export function currentIntent(state){
  const e=enemies[state.battle.enemyId],pattern=e.boss?e.phases[state.battle.phase-1]:e.pattern;
  return pattern[state.battle.patternIndex%pattern.length];
}
export function enemyTurn(state){
  const b={...state.battle,log:[...state.battle.log]},enemy=enemies[b.enemyId];
  if(b.enemyHp<=0)return victory(state);
  const move=currentIntent(state);let hp=state.hp,guard=state.guard,energy=3;
  if(move.kind==="attack"){const amount=move.value+(b.power||0),hit=hurt(amount,guard);guard=hit.guard;hp=Math.max(0,hp-hit.hpLoss);b.log.push(`${enemy.name} uses ${move.label} for ${hit.hpLoss} damage.`)}
  if(move.kind==="guard"){b.enemyGuard+=move.value;b.log.push(`${enemy.name} gains ${move.value} Guard.`)}
  if(move.kind==="sticky"){energy=2;b.log.push(`${enemy.name} makes everything sticky. Next turn starts with 2 Energy.`)}
  if(move.kind==="dodge"){b.enemyDodge=1;b.log.push(`${enemy.name} coils up to dodge the next damaging move.`)}
  if(move.kind==="seeds"){b.seeds=Math.min(4,b.seeds+move.value);b.log.push(`${enemy.name} summons ${move.value} Seedling${move.value>1?"s":""}.`)}
  if(move.kind==="cannonade"){const amount=move.value+b.seeds*3+(b.power||0),hit=hurt(amount,guard);guard=hit.guard;hp=Math.max(0,hp-hit.hpLoss);b.log.push(`${move.label} fires for ${hit.hpLoss} damage (${b.seeds} Seedlings).`)}
  if(move.kind==="enrage"){b.power+=move.value;b.log.push(`Mustache Power rises to +${b.power}.`)}
  b.patternIndex++;b.turn++;b.phaseChanged=false;
  if(hp<=0)return {...state,hp:0,guard,energy,battle:b,screen:"inherit",message:`Generation ${state.generation} fell at node ${state.node+1}, but its family can inherit one permanent trait.`};
  return {...state,hp,guard:0,energy,battle:b};
}
export function victory(state){
  const wasBoss=state.battle?.enemyId==="squashbuckler";
  const wins=state.wins+(wasBoss?0:1),node=state.node+1,mutation=Math.min(100,state.mutation+(wasBoss?10:30));
  return {...state,wins,node,mutation,battle:null,screen:wasBoss?"inherit":"reward",message:wasBoss?`King Squashbuckler is dethroned! Generation ${state.generation} completed the Fizzlefruit Isles.`:`Victory ${wins}/3! Choose a run upgrade; its new value will appear immediately.`};
}
export function takeReward(state,rewardId){
  const next={...state,screen:"map",runRewards:[...state.runRewards,rewardId]};
  if(rewardId==="power-pop")next.runBonkBonus+=3;
  if(rewardId==="plump-peel"){next.runMaxHpBonus+=10;next.maxHp+=10;next.hp=Math.min(next.maxHp,next.hp+10)}
  if(rewardId==="spring-sole")next.runGuardBonus+=2;
  const reward=runRewards.find(r=>r.id===rewardId);
  next.message=`${reward.name} applied: ${reward.description} Current Bonk ${bonkDamage(next)}, HP ${next.hp}/${next.maxHp}, starting Guard ${startingGuard(next)}.`;
  saveState(next);return next;
}
export function completeEvent(state){
  const healed=Math.min(12,state.maxHp-state.hp),next={...state,node:state.node+1,hp:Math.min(state.maxHp,state.hp+12),message:`The Fizzy Fountain restores ${healed} health. HP ${Math.min(state.maxHp,state.hp+12)}/${state.maxHp}.`};
  saveState(next);return next;
}
export function inherit(state,traitId){
  const trait=traits.find(t=>t.id===traitId);
  const genes={baseMaxHp:state.baseMaxHp,baseBonkDamage:state.baseBonkDamage,baseStartGuard:state.baseStartGuard,inheritedTraits:[...state.inheritedTraits,traitId]};
  if(traitId==="thick-fluff")genes.baseMaxHp+=8;
  if(traitId==="quick-feet")genes.baseStartGuard+=2;
  if(traitId==="lucky-bonk")genes.baseBonkDamage+=3;
  const next=beginRun(freshState(state.generation+1,genes));
  next.message=`Generation ${next.generation} inherited ${trait.name}. Permanent stats: Bonk ${next.baseBonkDamage}, HP ${next.baseMaxHp}, starting Guard ${next.baseStartGuard}.`;
  saveState(next);return next;
}
export {abilities,enemies,route,runRewards,traits};
