import {test} from 'node:test';import assert from 'node:assert/strict';
import {acts,board,initial,step,solve,won,sight,moves} from './engine.js';
test('all six acts are solvable, distinct, and require a double',()=>{
 const signatures=[];
 for(const a of acts){const b=board(a),plan=solve(b);assert.ok(plan?.length);signatures.push(plan.join(','));let s=initial(b);for(const move of plan){const r=step(b,s,move);assert.equal(r.ok,true);assert.notEqual(r.state,s);s=r.state;}assert.equal(won(b,s),true);assert.equal(solve(b,{...initial(b),e:null},Object.keys(moves)),null);}
 assert.equal(new Set(signatures).size,acts.length);
});
test('echo holds a switch; recall closes it; unsafe changes leave source intact',()=>{
 const b=board(acts[0]);let s=initial(b);s=step(b,s,'right').state;s=step(b,s,'right').state;
 assert.equal(step(b,s,'right').ok,false);s=step(b,s,'double').state;assert.equal(step(b,s,'right').ok,true);
 const closed=step(b,s,'recall').state;assert.equal(step(b,closed,'right').ok,false);const old=JSON.stringify(s);assert.equal(step(b,s,'double').ok,false);assert.equal(JSON.stringify(s),old);
});
test('tickets are collected by performer, not double; swap transports performer',()=>{
 const b=board(acts[1]);let s=initial(b);assert.equal(s.k,0);s=step(b,s,'right').state;s=step(b,s,'right').state;assert.equal(s.k,1);const old=s;s=step(b,s,'swap').state;assert.equal(s.p,old.e);assert.equal(s.e,old.p);assert.equal(s.k,old.k);
});
test('double blocks usher sight, walls block it, recalling while exposed is refused',()=>{
 const b=board(acts[3]),s=initial(b),row=2*b.w;
 assert.equal(sight(b,s).has(row+3),true);assert.equal(sight(b,s).has(row+5),false);
 const exposed={...s,p:row+5};assert.equal(step(b,exposed,'recall').ok,false);
 assert.equal(sight(b,{...s,e:null}).has(row+5),true);
 assert.equal(step(b,s,'up').ok,false);
});
test('winning needs all tickets, not merely reaching the exit',()=>{
 const b=board(acts[5]),s={...initial(b),p:b.exit};assert.equal(won(b,s),false);assert.equal(won(b,{...s,k:3}),true);
});
test('hint replans after a detour, and has no move after a win',()=>{
 const b=board(acts[0]);let s=step(b,initial(b),'right').state;const plan=solve(b,s);assert.equal(plan.length,12);for(const a of plan)s=step(b,s,a).state;assert.deepEqual(solve(b,s),[]);assert.equal(step(b,s,'nope').ok,false);
});
test('boards contain valid single endpoints, paired curtains and safe starting poses',()=>{
 for(const a of acts){const b=board(a),s=initial(b);assert.equal([...b.cells].filter(c=>c==='P').length,1);assert.equal([...b.cells].filter(c=>c==='E').length,1);for(const c of ['A','B'])if(b.cells.includes(c))assert.ok(b.cells.includes(c.toLowerCase()));assert.equal(sight(b,s).has(s.p),false);assert.ok(b.keyCells.length>0);}
});
