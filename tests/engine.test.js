import test from "node:test";
import assert from "node:assert/strict";
import {freshState,beginRun,startBattle,useAbility,enemyTurn,takeReward,inherit,currentIntent,victory} from "../js/engine.js";

test("a new run starts on the route with full health",()=>{
  const s=beginRun(freshState());
  assert.equal(s.screen,"map");assert.equal(s.hp,68);assert.equal(s.node,0);
});
test("Bonk consumes energy and damages an enemy",()=>{
  let s=startBattle(beginRun(freshState()),"crumbler");
  s=useAbility(s,"bonk");
  assert.equal(s.energy,2);assert.equal(s.battle.enemyHp,30);assert.equal(s.battle.enemyVulnerable,1);
});
test("guard absorbs enemy damage",()=>{
  let s=startBattle(beginRun(freshState()),"crumbler");
  s=useAbility(s,"puff");s=enemyTurn(s);
  assert.equal(s.hp,68);assert.equal(s.battle.turn,2);
});
test("inheritance advances generation and applies a trait",()=>{
  const s=inherit({...freshState(),generation:3},"thick-fluff");
  assert.equal(s.generation,4);assert.equal(s.maxHp,76);assert.equal(s.screen,"map");
});
test("reward returns to map",()=>{
  const s=takeReward({...freshState(),screen:"reward",hp:30},"heal");
  assert.equal(s.screen,"map");assert.equal(s.hp,48);
});
test("Squashbuckler changes phases at 140 and 70 health",()=>{
  let s=startBattle(beginRun(freshState()),"squashbuckler");
  s.battle.enemyHp=143;
  s=useAbility(s,"quick");
  assert.equal(s.battle.phase,2);
  s.battle.enemyHp=73;s.energy=3;
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
  s.battle.patternIndex=2;s.battle.seeds=2;
  assert.equal(currentIntent(s).label,"Seed Cannonade");
  s=enemyTurn(s);
  assert.equal(s.hp,54);
});
test("defeating Squashbuckler opens inheritance without adding a normal win",()=>{
  let s=startBattle({...beginRun(freshState()),wins:3,node:4},"squashbuckler");
  s.battle.enemyHp=0;
  s=enemyTurn(s);
  assert.equal(s.screen,"inherit");assert.equal(s.wins,3);assert.equal(s.node,5);
});
