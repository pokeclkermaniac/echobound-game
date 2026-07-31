import test from "node:test";
import assert from "node:assert/strict";
import {
  abilityText,beginRun,bonkDamage,completeEvent,currentIntent,enemyTurn,freshState,
  inherit,route,startBattle,startingGuard,takeReward,useAbility
} from "../js/engine.js";

test("a new run starts on the route with full health",()=>{
  const s=beginRun(freshState());
  assert.equal(s.screen,"map");
  assert.equal(s.hp,68);
  assert.equal(s.node,0);
});

test("Bonk consumes energy and uses the displayed damage value",()=>{
  let s=startBattle(beginRun(freshState()),"crumbler");
  assert.match(abilityText(s,"bonk"),/10 damage/);
  s=useAbility(s,"bonk");
  assert.equal(s.energy,2);
  assert.equal(s.battle.enemyHp,48);
  assert.equal(s.battle.enemyVulnerable,1);
});

test("guard absorbs enemy damage",()=>{
  let s=startBattle(beginRun(freshState()),"crumbler");
  s=useAbility(s,"puff");
  s=enemyTurn(s);
  assert.equal(s.hp,68);
  assert.equal(s.battle.turn,2);
});

test("Power Pop changes Bonk immediately and in the next battle",()=>{
  let s=takeReward({...beginRun(freshState()),screen:"reward"},"power-pop");
  assert.equal(bonkDamage(s),13);
  assert.match(abilityText(s,"bonk"),/13 damage/);
  s=startBattle(s,"syrup");
  s=useAbility(s,"bonk");
  assert.equal(s.battle.enemyHp,41);
});

test("Plump Peel increases maximum health and heals exactly ten",()=>{
  const s=takeReward({...beginRun(freshState()),screen:"reward",hp:30},"plump-peel");
  assert.equal(s.screen,"map");
  assert.equal(s.maxHp,78);
  assert.equal(s.hp,40);
});

test("Spring Sole grants starting guard in every later battle",()=>{
  let s=takeReward({...beginRun(freshState()),screen:"reward"},"spring-sole");
  assert.equal(startingGuard(s),2);
  s=startBattle(s,"spring");
  assert.equal(s.guard,2);
});

test("inheritance advances generation and applies a permanent trait",()=>{
  const s=inherit({...freshState(),generation:3},"thick-fluff");
  assert.equal(s.generation,4);
  assert.equal(s.maxHp,76);
  assert.equal(s.baseMaxHp,76);
  assert.equal(s.screen,"map");
});

test("run bonuses expire while inherited genes persist",()=>{
  let s=takeReward({...beginRun(freshState()),screen:"reward"},"power-pop");
  assert.equal(bonkDamage(s),13);
  s=inherit(s,"lucky-bonk");
  assert.equal(s.generation,2);
  assert.equal(s.baseBonkDamage,13);
  assert.equal(s.runBonkBonus,0);
  assert.equal(bonkDamage(s),13);
  assert.deepEqual(s.runRewards,[]);
});

test("Squashbuckler changes phases at 140 and 70 health",()=>{
  let s=startBattle(beginRun(freshState()),"squashbuckler");
  s.battle.enemyHp=143;
  s=useAbility(s,"quick");
  assert.equal(s.battle.phase,2);
  s.battle.enemyHp=73;
  s.energy=3;
  s=useAbility(s,"quick");
  assert.equal(s.battle.phase,3);
});

test("Quickstep scatters one summoned Seedling",()=>{
  let s=startBattle(beginRun(freshState()),"squashbuckler");
  s.battle.seeds=2;
  s=useAbility(s,"quick");
  assert.equal(s.battle.seeds,1);
});

test("Seed Cannonade scales with the active court",()=>{
  let s=startBattle(beginRun(freshState()),"squashbuckler");
  s.battle.patternIndex=2;
  s.battle.seeds=2;
  assert.equal(currentIntent(s).label,"Seed Cannonade");
  s=enemyTurn(s);
  assert.equal(s.hp,54);
});

test("a lethal ability immediately resolves victory",()=>{
  let s=startBattle({...beginRun(freshState()),wins:3,node:4},"squashbuckler");
  s.battle.enemyHp=5;
  s=useAbility(s,"quick");
  assert.equal(s.screen,"inherit");
  assert.equal(s.wins,3);
  assert.equal(s.node,5);
});

test("a complete route reaches the boss legacy and starts generation two",()=>{
  let s=beginRun(freshState());
  const rewards=["power-pop","plump-peel","spring-sole"];
  for(const node of route){
    if(node.type==="event"){
      s=completeEvent(s);
      continue;
    }
    s=startBattle(s,node.id);
    for(let turns=0;s.screen==="battle"&&turns<30;turns++){
      const intent=currentIntent(s);
      if(["attack","cannonade"].includes(intent.kind))s=useAbility(s,"puff");
      if(s.screen==="battle"&&s.battle.seeds)s=useAbility(s,"quick");
      while(s.screen==="battle"&&s.energy>0)s=useAbility(s,"bonk");
      if(s.screen==="battle")s=enemyTurn(s);
    }
    if(s.screen==="reward")s=takeReward(s,rewards[s.wins-1]);
  }
  assert.equal(s.screen,"inherit");
  assert.equal(s.hp>0,true);
  assert.equal(s.wins,3);
  assert.equal(s.node,5);
  s=inherit(s,"lucky-bonk");
  assert.equal(s.generation,2);
  assert.equal(bonkDamage(s),13);
  assert.equal(s.screen,"map");
});
